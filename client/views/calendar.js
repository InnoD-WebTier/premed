/*
Need:
    How to log in - add isAdmin later
    Modale/stylish popup for adding event
    Drop down/window for displaying event info
*/
Events = new Mongo.Collection('events');

var addEventModes = {
  BASE: 'initial state',
  ADD_START: 'waiting for start date',
  ADD_END: 'waiting for end date',
  ADD_TITLE: 'waiting for a title'
}

var editModes = {
  EDITING: 'editing',
  NOT_EDITING: 'not editing'
}

var addEventMode = addEventModes.BASE;
var addEventModeDep = new Tracker.Dependency;

startDate = '';
endDate = '';
eventDescription = '';
currEvent = null;
var currEventDep = new Tracker.Dependency;
editMode = editModes.NOT_EDITING;
var editModeDep = new Tracker.Dependency;
deleteMode = 0;
eventList = [];
noEndDate = 'No end specified';

function range(start, end) {
  var list = [];
  for(var i = start; i <= end; i++) {
    list.push({num: i, selected: false});
  }
  return list;
}

function refetch() {
    eventList = Events.find({}).fetch();
    $("#myCalendar").fullCalendar('removeEvents');
    $("#myCalendar").fullCalendar('addEventSource', eventList);
}

function confirmButtons() {
    document.getElementById('delete').style.display = "none";
    document.getElementById('edit').style.display = "none";
    document.getElementById('confirm').style.display = "inline";
    document.getElementById('cancel').style.display = "inline";
}

function revert() {
    document.getElementById('delete').style.display = "inline";
    document.getElementById('edit').style.display = "inline";
    document.getElementById('confirm').style.display = "none";
    document.getElementById('cancel').style.display = "none";
    document.getElementById('deleteMessage').style.display = "none";
}

function isAdmin() {
    return Meteor.user() && Meteor.users.findOne( { _id: Meteor.userId() }).admin;
}

Template.calendar.rendered = function(){
    Meteor.subscribe("events", function() {
        eventList = Events.find({}).fetch();
        $("#myCalendar").fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            dayClick: function(date, jsEvent, view) {
                if (addEventMode === addEventModes.ADD_START) {
                    startDate = date.format();
                    addEventMode = addEventModes.ADD_END;
                    addEventModeDep.changed();
                } else if (addEventMode === addEventModes.ADD_END) {
                    endDate = date.format();
                    addEventMode = addEventModes.ADD_TITLE;
                    addEventModeDep.changed();
                    $('#description').show();
                }
            },
            defaultDate: new Date(),
            defaultView: 'month',
            editable: true,
            events: eventList,
            eventRender: function (event, element) {
                element.attr('href', 'javascript:void(0);');
                element.click(function () {
                    if (event.end == null) {
                        var endDay = noEndDate;
                        var endTime = '';
                    } else {
                        var endDay = event.end.format("MMMM Do, YYYY");
                        var endTime = event.end.format("h:mm a");
                    }
                    if (event.end === null) {
                      event.end = event.start;
                    }
                    currEvent = event;
                    currEventDep.changed();
                    document.getElementById('eventInfo').checked = true;
                });
            },
            timezone: "local"
        });
    });
}

Template.calendar.events({
    "click #addToggle": function(e) {
        e.preventDefault();
        if (isAdmin()) {
            switch(addEventMode) {
              case addEventModes.BASE:
                addEventMode = addEventModes.ADD_START;
                addEventModeDep.changed();
                break;
              case addEventModes.ADD_START:
              case addEventModes.ADD_END:
                addEventMode = addEventModes.BASE;
                addEventModeDep.changed();
                startDate = '';
                endDate = '';
                break;
              case addEventModes.ADD_TITLE:
                var desc = document.getElementById('description').value;
                var newEvent = {
                    title: desc,
                    start: startDate,
                    info: '',
                    end: endDate
                };
                Meteor.call('insertEvent', newEvent, function (err, success) {
                    if (err) {
                        console.log('event failed');
                        console.log(err);
                    } else {
                        console.log('event added');
                        newEvent._id = success;
                        console.log(newEvent);
                        $("#myCalendar").fullCalendar("renderEvent", newEvent);
                    }
                });
                addEventMode = addEventModes.BASE;
                addEventModeDep.changed();
                $('#description').hide();
                startDate = '';
                endDate = '';
                break;
              default:
                break;
            }
        }
    },

    "click #edit": function(e) {
        e.preventDefault();
        if (isAdmin()) {
            if (editMode === editModes.NOT_EDITING) {
                editMode = editModes.EDITING;
                editModeDep.changed();
                confirmButtons();
            }
        }
    },

    "click #delete": function(e) {
        e.preventDefault();
        if (isAdmin()) {
            if (deleteMode === 0) {
                deleteMode = 1;
                document.getElementById('deleteMessage').innerHTML = "Are you sure you want to delete this event?\n";
                document.getElementById('deleteMessage').style.display = "inline";
                confirmButtons();
            }
        }
    },

    "click #confirm": function(e) {
        if (isAdmin()) {
            if (editMode === editModes.EDITING) {
                var desc = document.getElementById('editDesc').value;
                var start = document.getElementById('sMonth').value + " " + document.getElementById('sDay').value + " " + 
                            document.getElementById('sYear').value + " " + document.getElementById('sHour').value + " " + 
                            document.getElementById('sMin').value + " " + document.getElementById('sAM').value;
                var end = document.getElementById('eMonth').value + " " + document.getElementById('eDay').value + " " + 
                          document.getElementById('eYear').value + " " + document.getElementById('eHour').value + " " + 
                          document.getElementById('eMin').value + " " + document.getElementById('eAM').value;
                var eventDescription = document.getElementById('editEventDscription').value;
                var modEvent = {
                    _id: currEvent._id,
                    start: $.fullCalendar.moment(start, "M D YYYY h m A").toISOString(),
                    end: $.fullCalendar.moment(end, "M D YYYY h m A").toISOString(),
                    info: eventDescription,
                    title: desc
                };
                Meteor.call('updateEvent', modEvent, function (err, success) {
                    if (err) {
                        console.log('failed to edit event');
                        console.log(err);
                    } else {
                        console.log('event editted');
                        refetch();
                    }
                    editMode = editModes.NOT_EDITING;
                    editModeDep.changed();
                    revert();
                    document.getElementById('eventInfo').checked = false;
                });
            } else if (deleteMode === 1) {
                Meteor.call('deleteEvent', currEvent._id, function (err, success) {
                    if (err) {
                        console.log('Failed to delete event');
                        console.log(err);
                    } else {
                        console.log('Event deleted');
                        refetch();
                        document.getElementById('eventInfo').checked = false;
                    }
                    revert();
                })
                deleteMode = 0;
            }
        }
    }, 

    "click #cancel, click #closebox, click #close": function(e) {
        if (isAdmin()) {
            revert();
            deleteMode = 0;
            editMode = editModes.NOT_EDITING;
            editModeDep.changed();
            currEvent = null;
            currEventDep.changed();
        }
        document.getElementById('eventInfo').checked = false;
    }
});

Template.calendar.helpers({
    is_admin: function() {
        return Meteor.user() && (
               Meteor.users.findOne( { _id: Meteor.userId() }).admin || 
               Meteor.users.find( { admin: true } ).count() === 0);
    },
    add_text: function() {
        addEventModeDep.depend();
        switch (addEventMode) {
          case addEventModes.BASE:
            return 'Add Event'
          case addEventModes.ADD_START:
            return 'Select a start date (Click here to Cancel)'
          case addEventModes.ADD_END:
            return 'Pick an end date (Click here to cancel)'
          case addEventModes.ADD_TITLE:
            return 'Set Title'
          default:
            console.err('inconsistent addEventMode state');
            return 'Add Event?'
        }
    },
    currEvent: function() {
      currEventDep.depend();
      if (currEvent === null) {
        return null;
      }
      return {
        title: currEvent.title,
        startDate: currEvent.start.format('MMMM Do, YYYY'),
        startTime: currEvent.start.format('hh:mm A'),
        endDate: currEvent.end.format('MMMM Do, YYYY'),
        endTime: currEvent.end.format('hh:mm A'),
        description: currEvent.info
      }
    },
    editing: function() {
      editModeDep.depend();
      switch(editMode) {
        case editModes.EDITING:
          return true;
        case editModes.NOT_EDITING:
          return false;
        default:
          console.error('Bad editMode state');
          return false;
      }
    },
    startDate: function() {
      currEventDep.depend();
      return generateDates(currEvent.start);
    },
    startTime: function() {
      currEventDep.depend();
      return generateTimes(currEvent.start);
    },
    endDate: function() {
      currEventDep.depend();
      return generateDates(currEvent.end);
    },
    endTime: function() {
      currEventDep.depend();
      return generateTimes(currEvent.end);
    }
});

function generateDates(activeMoment) {
    var currentYear = (new Date()).getFullYear();
    var dates = [
        { type: 'Year', items: range(currentYear, currentYear+5) },
        { type: 'Month', items: range(1, 12) },
        { type: 'Day', items: range(1, 31) }
    ]
    dates[0].items = dates[0].items.map(function(item) {
      if(item.num == activeMoment.format('YYYY')) { item.selected = true; }
      return item;
    })
    dates[1].items = dates[1].items.map(function(item) {
      if(item.num == activeMoment.format('M')) { item.selected = true; }
      return item;
    })
    dates[2].items = dates[2].items.map(function(item) {
      if(item.num == activeMoment.format('D')) { item.selected = true; }
      return item;
    })
    return dates
}

function generateTimes(activeMoment) {
    var times = [
        { type: 'Hour', items: range(1, 12) },
        { type: 'Minute', items: range(0, 59) },
        { type: 'AM', items: [{num: 'AM', selected: false}, {num: 'PM', selected: false}] }
    ]
    times[0].items = times[0].items.map(function(item) {
      if(item.num == activeMoment.format('h')) { item.selected = true; }
      return item;
    })
    times[1].items = times[1].items.map(function(item) {
      if(item.num == activeMoment.format('m')) { item.selected = true; }
      return item;
    })
    times[2].items = times[2].items.map(function(item) {
      if(item.num == activeMoment.format('a')) { item.selected = true; }
      return item;
    })
    return times
}
