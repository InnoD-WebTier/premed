/*
Need:
    How to log in - add isAdmin later
    Modale/stylish popup for adding event
    Drop down/window for displaying event info
*/
Events = new Mongo.Collection('events');
addEventToggle = 0;
var addEventToggleDep = new Tracker.Dependency;
startDate = '';
endDate = '';
eventDescription = '';
currEvent = null;
editMode = 0;
var editModeDep = new Tracker.Dependency;
deleteMode = 0;
eventList = [];
noEndDate = 'No end specified';
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
                if (addEventToggle === 1) {
                    startDate = date.format();
                    addEventToggle = 2;
                    addEventToggleDep.changed();
                } else if (addEventToggle === 2) {
                    endDate = date.format();
                    addEventToggle = 3;
                    addEventToggleDep.changed();
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
                    currEvent = event;
                    var eventInfo = event.info;
                    document.getElementById('info').innerHTML = event.title;
                    document.getElementById('startDate').innerHTML = event.start.format("MMMM Do, YYYY");
                    document.getElementById('startTime').innerHTML = event.start.format("h:mm a");
                    document.getElementById('eventDescription').innerHTML = eventInfo;
                    document.getElementById('endDate').innerHTML = endDay;
                    document.getElementById('endTime').innerHTML = endTime;
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
            if (addEventToggle === 0) {
                addEventToggle = 1;
                addEventToggleDep.changed();
            } else if (addEventToggle === 1 || addEventToggle === 2) {
                addEventToggle = 0;
                addEventToggleDep.changed();
                startDate = '';
                endDate = '';
            } else if (addEventToggle === 3) {
                var desc = document.getElementById('description').value;
                var event = {
                    title: desc,
                    start: startDate,
                    info: '',
                    end: endDate
                };
                Meteor.call('insertEvent', event, function (err, success) {
                    if (err) {
                        console.log('event failed');
                        console.log(err);
                    } else {
                        console.log('event added');
                        event._id = success;
                        console.log(event);
                        $("#myCalendar").fullCalendar("renderEvent", event);
                    }
                });
                addEventToggle = 0;
                addEventToggleDep.changed();
                $('#description').hide();
                startDate = '';
                endDate = '';
            }
        }
    },

    "click #edit": function(e) {
        e.preventDefault();
        if (isAdmin()) {
            if (editMode === 0) {
                editMode = 1;
                editModeDep.changed();
                var desc = currEvent.title;
                var sDay = currEvent.start.format('DD');
                var sMonth = currEvent.start.format('MM');
                var sYear = currEvent.start.format('YYYY');
                var sHour = currEvent.start.format('hh');
                var sMinute = currEvent.start.format('mm');
                var sAM = currEvent.start.format('A');
                var sids = ['sMonth'+sMonth, 'sDay'+sDay, 'sYear'+sYear, 'sHour'+sHour, 'sMinute'+sMinute, 's'+sAM];
                var eDay = sDay;
                var eMonth = sMonth;
                var eYear = sYear;
                var eHour = sHour;
                var eMinute = sMinute;
                var eAM = sAM;
                if (currEvent.end != null) {
                    eDay = currEvent.end.format('DD');
                    eMonth = currEvent.end.format('MM');
                    eYear = currEvent.end.format('YYYY');
                    eHour = currEvent.end.format('hh');
                    eMinute = currEvent.end.format('mm');
                    eAM = currEvent.end.format('A');
                }
                var eids = ['eMonth'+eMonth, 'eDay'+eDay, 'eYear'+eYear, 'eHour'+eHour, 'eMinute'+eMinute, 'e'+eAM];
                document.getElementById('startDate').innerHTML = "Month: <select id='sMonth'>" + sMonths + "</select>  Day: <select id='sDay'>" + sDays + 
                                                                 "</select>  Year: <select id='sYear'>" + sYears + "</select>";
                document.getElementById('startTime').innerHTML = "Hour: <select id='sHour'>" + sHours + "</select>  Minute: <select id='sMin'>" + sMinutes + 
                                                                 "</select> <select id='sAM'>" + sAMOption + "</select>";
                document.getElementById('eventDescription').innerHTML = "<textarea id='editEventDscription' rows='4' cols='58' style='resize:vertical;' value='" + info + "'></textarea>";
                document.getElementById('endDate').innerHTML = "Month: <select id='eMonth'>" + eMonths + "</select>  Day: <select id='eDay'>" + eDays + 
                                                                 "</select>  Year: <select id='eYear'>" + eYears + "</select>";
                document.getElementById('endTime').innerHTML = "Hour: <select id='eHour'>" + eHours + "</select>  Minute: <select id='eMin'>" + eMinutes + 
                                                                 "</select> <select id='eAM'>" + eAMOption + "</select>";
                document.getElementById('info').innerHTML = "Title: <input type='text' id='editDesc' value=\"" + desc + "\"/>";
                for (var i = 0; i < sids.length; i++) {
                    document.getElementById(sids[i]).selected = "selected";
                }
                for (var i = 0; i < eids.length; i++) {
                    document.getElementById(eids[i]).selected = "selected";
                }
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
            if (editMode === 1) {
                var desc = document.getElementById('editDesc').value;
                var start = document.getElementById('sMonth').value + " " + document.getElementById('sDay').value + " " + 
                            document.getElementById('sYear').value + " " + document.getElementById('sHour').value + " " + 
                            document.getElementById('sMin').value + " " + document.getElementById('sAM').value;
                var end = document.getElementById('eMonth').value + " " + document.getElementById('eDay').value + " " + 
                          document.getElementById('eYear').value + " " + document.getElementById('eHour').value + " " + 
                          document.getElementById('eMin').value + " " + document.getElementById('eAM').value;
                var eventDescription = document.getElementById('editEventDscription').value;
                var event = {
                    _id: currEvent._id,
                    start: $.fullCalendar.moment(start, "M D YYYY h m A").toISOString(),
                    end: $.fullCalendar.moment(end, "M D YYYY h m A").toISOString(),
                    info: eventDescription,
                    title: desc
                };
                Meteor.call('updateEvent', event, function (err, success) {
                    if (err) {
                        console.log('failed to edit event');
                        console.log(err);
                    } else {
                        console.log('event editted');
                        refetch();
                    }
                    editMode = 0;
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
            editMode = 0;
            editModeDep.changed();
            currEvent = null;
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
        addEventToggleDep.depend();
        switch (addEventToggle) {
          case 0:
            return 'Add Event'
          case 1:
            return 'Select a start date (Click here to Cancel)'
          case 2:
            return 'Pick an end date (Click here to cancel)'
          case 3:
            return 'Set Title'
          default:
            return 'Add Event?'
        }
    }
});

function generateNumbers(start, end, type) {
    select = "";
    var num;
    for (var i = start; i <= end; i++) {
        num = (i < 10 ? '0' : '') + i.toString();
        select = select + "<option id=\'" + type + num + "\' value=\'" + num + "\'>" + num + "</option>";
    }
    return select;
}


var d = new Date();
sYears = generateNumbers(d.getFullYear(), d.getFullYear() + 5, 'sYear');
sMonths = generateNumbers(1, 12, 'sMonth');
sDays = generateNumbers(1, 31, 'sDay');
sHours = generateNumbers(1, 12, 'sHour');
sMinutes = generateNumbers(0, 59, 'sMinute');
sAMOption = "<option id='sAM' value='AM'>AM</option><option id='sPM' value='PM'>PM</option>";

eYears = generateNumbers(d.getFullYear(), d.getFullYear() + 5, 'eYear');
eMonths = generateNumbers(1, 12, 'eMonth');
eDays = generateNumbers(1, 31, 'eDay');
eHours = generateNumbers(1, 12, 'eHour');
eMinutes = generateNumbers(0, 59, 'eMinute');
eAMOption = "<option id='eAM' value='AM'>AM</option><option id='ePM' value='PM'>PM</option>";
