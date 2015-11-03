Events = new Mongo.Collection('events');

function createEvent(start, end, title, info, id) {
    title = typeof title !== 'undefined' ? title : '';
    info = typeof info !== 'undefined' ? info : '';
    id = typeof id !== 'undefined' ? id : '';
    return {
        start: start,
        end: end,
        title: title,
        info: info,
        _id: id
    }
}

function revert() {
    addEventMode = addEventModes.BASE;
    addEventModeDep.changed();
    currEvent = null;
    currEventDep.changed();
    editMode = editModes.NOT_EDITING;
    editModeDep.changed();
    errorMessage = errorMessages.NONE;
    errorMessageDep.changed();
    deleteMode = deleteModes.NOT_DELETING;
    deleteModeDep.changed();    
}

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

var deleteModes = {
  DELETING: 'deleting',
  NOT_DELETING: 'not deleting'
}

var errorMessages = {
    NONE: '',
    START_BEFORE_NOW: "You cannot create an event before today!",
    END_BEFORE_START: "Your event cannot end before it begins!",
    NO_TITLE: "Your event must have a title!"
}

var addEventMode = addEventModes.BASE;
var addEventModeDep = new Tracker.Dependency;

var startDate = '';
var endDate = '';
var eventDescription = '';
var currEvent = null;
var currEventDep = new Tracker.Dependency;
var editMode = editModes.NOT_EDITING;
var editModeDep = new Tracker.Dependency;
var errorMessage = errorMessages.NONE;
var errorMessageDep = new Tracker.Dependency;
var deleteMode = deleteModes.NOT_DELETING;
var deleteModeDep = new Tracker.Dependency;
var eventList = [];
var noEndDate = 'No end specified';

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
                if(!isAdmin()) {
                  return;
                }
                var currentDate = $.fullCalendar.moment().format('YYYY-MM-DD');

                switch(addEventMode) {
                  case addEventModes.ADD_START:
                    if (date.format('YYYY-MM-DD') >= currentDate) {
                        errorMessage = errorMessages.NONE;
                        errorMessageDep.changed();
                        startDate = date;
                        addEventMode = addEventModes.ADD_END;
                        addEventModeDep.changed();
                    } else {
                        errorMessage = errorMessages.START_BEFORE_NOW;
                        errorMessageDep.changed();
                    }
                    break;
                  case addEventModes.ADD_END:
                    endDate = date;
                    if (endDate >= startDate) {
                        errorMessage = errorMessages.NONE;
                        errorMessageDep.changed();
                        currEvent = createEvent(startDate, endDate);
                        currEventDep.changed();
                        addEventMode = addEventModes.ADD_TITLE;
                        addEventModeDep.changed();
                        editMode = editModes.EDITING;
                        editModeDep.changed();
                    } else {
                        errorMessage = errorMessages.END_BEFORE_START;
                        errorMessageDep.changed();
                        endDate = '';
                    }
                    break;
                  default:
                    return;
                }
            },
            defaultDate: new Date(),
            defaultView: 'month',
            editable: true,
            events: function (start, end, timezone, callback) {
                callback(Events.find({}).fetch());
            },
            eventRender: function (event, element) {
                element.attr('href', 'javascript:void(0);');
                element.click(function () {
                    if (event.end === null) {
                      event.end = event.start;
                    }
                    currEvent = event;
                    currEventDep.changed();
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
              default:
                revert();
                break;
            }
        }
    },

    "click #edit": function(e) {
        e.preventDefault();
        if (isAdmin()) {
            editMode = editModes.EDITING;
            editModeDep.changed();
        }
    },

    "click #delete": function(e) {
        e.preventDefault();
        if (isAdmin()) {
            deleteMode = deleteModes.DELETING;
            deleteModeDep.changed();
        }
    },

    "click #confirm": function(e) {
        if (isAdmin()) {
            if (editMode === editModes.EDITING) {
                var title = $('#editDesc').val();
                var start = $('#sMonth').val() + " " + $('#sDay').val() + " " +
                            $('#sYear').val() + " " + $('#sHour').val() + " " +
                            $('#sMinute').val() + " " + $('#sAM').val();
                var end = $('#eMonth').val() + " " + $('#eDay').val() + " " +
                          $('#eYear').val() + " " + $('#eHour').val() + " " +
                          $('#eMinute').val() + " " + $('#eAM').val();
                var eventDescription = $('#editEventDescription').val();
                start = $.fullCalendar.moment(start, "M D YYYY h m A");
                end = $.fullCalendar.moment(end, "M D YYYY h m A");
                if (end <= start) {
                    errorMessage = errorMessages.END_BEFORE_START;
                    errorMessageDep.changed();
                } else if (title === '') {
                    errorMessage = errorMessages.NO_TITLE;
                    errorMessageDep.changed();
                } else {
                    var modEvent = {
                        _id: currEvent._id,
                        start: start.toISOString(),
                        end: end.toISOString(),
                        info: eventDescription,
                        title: title
                    };
                    Meteor.call('updateEvent', modEvent, function (err, success) {
                        if (err) {
                            console.error('failed to edit event');
                            console.error(err);
                            alert('Failed to edit event');
                        } else {
                            console.log('event editted');
                            $("#myCalendar").fullCalendar('refetchEvents');
                            revert();
                        }
                    });
                }
            } else if (deleteMode === deleteModes.DELETING) {
                Meteor.call('deleteEvent', currEvent._id, function (err, success) {
                    if (err) {
                        console.error('Failed to delete event');
                        console.error(err);
                        alert('Failed to delete event')
                    } else {
                        console.log('Event deleted');
                        $("#myCalendar").fullCalendar('refetchEvents');
                        revert();                    
                    }
                });
            }
        }
    }, 

    "click #cancel, click #closebox, click #close, click .modal-overlay": function(e) {
        revert();
    }
});

Template.calendar.helpers({
    is_admin: function() {
        return isAdmin();
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
            return 'Add details to your event!'
          default:
            console.error('inconsistent addEventMode state');
            return 'Add Event?'
        }
    },
    confirmationButtons: function() {
      deleteModeDep.depend();
      editModeDep.depend();
      var deleting = deleteMode === deleteModes.DELETING;
      var editing = editMode === editModes.EDITING;
      return deleting || editing;
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
    deleting: function() {
      deleteModeDep.depend();
      return deleteMode === deleteModes.DELETING;
    },
    editing: function() {
      editModeDep.depend();
      return editMode === editModes.EDITING;
    },
    error: function() {
        errorMessageDep.depend();
        if (errorMessage === '') {
            return 0;
        } else {
            return errorMessage;
        }
    },
    showModal: function() {
      currEventDep.depend();
      return currEvent !== null;
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