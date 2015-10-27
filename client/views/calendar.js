Events = new Mongo.Collection('events');
var addEventToggle = 0;
var startDate = '';
var endDate = '';
var eventDescription = '';
var currEvent = null;
var editMode = 0;
var deleteMode = 0;
var eventList = [];
var noEndDate = 'No end specified';

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

function confirmButtons() {
    document.getElementById('delete').style.display = "none";
    document.getElementById('edit').style.display = "none";
    document.getElementById('confirm').style.display = "inline";
    document.getElementById('cancel').style.display = "inline";
}

function revert() {
    addEventToggle = 0;
    document.getElementById('addToggle').innerHTML = 'Add Event';
    document.getElementById('description').style.visibility = "hidden";
    startDate = '';
    endDate = '';
    document.getElementById('delete').style.display = "inline";
    document.getElementById('edit').style.display = "inline";
    document.getElementById('confirm').style.display = "none";
    document.getElementById('cancel').style.display = "none";
    document.getElementById('deleteMessage').style.display = "none";
}

function isAdmin() {
    return Meteor.user() && Meteor.users.findOne( { _id: Meteor.userId() }).admin;
}

function editWindow(event) {
    if (editMode === 0) {
        editMode = 1;
        var desc = event.title;
        var info = event.info;
        var sDay = event.start.format('DD');
        var sMonth = event.start.format('MM');
        var sYear = event.start.format('YYYY');
        var sHour = event.start.format('hh');
        var sMinute = event.start.format('mm');
        var sAM = event.start.format('A');
        var sids = ['sMonth'+sMonth, 'sDay'+sDay, 'sYear'+sYear, 'sHour'+sHour, 'sMinute'+sMinute, 's'+sAM];
        var eDay = sDay;
        var eMonth = sMonth;
        var eYear = sYear;
        var eHour = sHour;
        var eMinute = sMinute;
        var eAM = sAM;
        if (event.end != null) {
            eDay = event.end.format('DD');
            eMonth = event.end.format('MM');
            eYear = event.end.format('YYYY');
            eHour = event.end.format('hh');
            eMinute = event.end.format('mm');
            eAM = event.end.format('A');
        }
        var eids = ['eMonth'+eMonth, 'eDay'+eDay, 'eYear'+eYear, 'eHour'+eHour, 'eMinute'+eMinute, 'e'+eAM];
        document.getElementById('startDate').innerHTML = "Month: <select id='sMonth'>" + sMonths + "</select>  Day: <select id='sDay'>" + sDays + 
                                                         "</select>  Year: <select id='sYear'>" + sYears + "</select>";
        document.getElementById('startTime').innerHTML = "Hour: <select id='sHour'>" + sHours + "</select>  Minute: <select id='sMin'>" + sMinutes + 
                                                         "</select> <select id='sMeridian'>" + sAMOption + "</select>";
        document.getElementById('eventDescription').innerHTML = "<textarea id='editEventDscription' rows='4' cols='58' style='resize:vertical;' value='" + info + "'>" + info + "</textarea>";
        document.getElementById('endDate').innerHTML = "Month: <select id='eMonth'>" + eMonths + "</select>  Day: <select id='eDay'>" + eDays + 
                                                         "</select>  Year: <select id='eYear'>" + eYears + "</select>";
        document.getElementById('endTime').innerHTML = "Hour: <select id='eHour'>" + eHours + "</select>  Minute: <select id='eMin'>" + eMinutes + 
                                                         "</select> <select id='eMeridian'>" + eAMOption + "</select>";
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

                var currentDate = new Date();
                currentDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

                if (addEventToggle === 1 && date.format() >= currentDate) {
                    startDate = date.format();
                    console.log(startDate)
                    addEventToggle = 2;
                    document.getElementById('addToggle').innerHTML = 'Pick an end date (Click here to cancel)';
                } else if (addEventToggle === 2) {
                    endDate = date.format();
                    if (endDate >= startDate) {
                        addEventToggle = 3;
                        currEvent = createEvent($.fullCalendar.moment(startDate), $.fullCalendar.moment(endDate));
                        editWindow(currEvent);
                        document.getElementById('eventInfo').checked = true;
                        document.getElementById('addToggle').innerHTML = 'Add details to your event!';
                    } else {
                        alert("Your event cannot end before it starts!");
                        endDate = '';
                    }
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
                    if (event.end == null) {
                        var endDay = noEndDate;
                        var endTime = '';
                    } else {
                        var endDay = event.end.format("MMMM Do, YYYY");
                        var endTime = event.end.format("h:mm a");
                    }
                    currEvent = event;
                    document.getElementById('info').innerHTML = event.title;
                    document.getElementById('startDate').innerHTML = event.start.format("MMMM Do, YYYY");
                    document.getElementById('startTime').innerHTML = event.start.format("h:mm a");
                    document.getElementById('eventDescription').innerHTML = event.info;
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
                document.getElementById('addToggle').innerHTML = 'Select a start date (Click here to Cancel)';
            } else if (addEventToggle === 1 || addEventToggle === 2) {
                addEventToggle = 0;
                startDate = '';
                endDate = '';
                document.getElementById('addToggle').innerHTML = 'Add Event';
            // } else if (addEventToggle === 3) {
            //     var desc = document.getElementById('description').value;
            //     var event = {
            //         title: desc,
            //         start: startDate,
            //         info: '',
            //         end: endDate
            //     };
            //     Meteor.call('insertEvent', event, function (err, success) {
            //         if (err) {
            //             console.log('event failed');
            //             console.log(err);
            //         } else {
            //             console.log('event added');
            //             event._id = success;
            //             console.log(event);
            //             $("#myCalendar").fullCalendar('refetchEvents');
            //         }
            //     });
            }
        }
    },

    "click #edit": function(e) {
        e.preventDefault();
        if (isAdmin()) {
            editWindow(currEvent);
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
            if (editMode === 1 || addToggle === 3) {
                var desc = document.getElementById('editDesc').value;
                var start = document.getElementById('sMonth').value + " " + document.getElementById('sDay').value + " " + 
                            document.getElementById('sYear').value + " " + document.getElementById('sHour').value + " " + 
                            document.getElementById('sMin').value + " " + document.getElementById('sMeridian').value;
                var end = document.getElementById('eMonth').value + " " + document.getElementById('eDay').value + " " + 
                          document.getElementById('eYear').value + " " + document.getElementById('eHour').value + " " + 
                          document.getElementById('eMin').value + " " + document.getElementById('eMeridian').value;
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
                        $("#myCalendar").fullCalendar('refetchEvents');
                    }
                    editMode = 0;
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
                        $("#myCalendar").fullCalendar('refetchEvents');
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
            currEvent = null;
        }
        document.getElementById('eventInfo').checked = false;
    }
});

Template.calendar.helpers({
    is_admin: function() {
        return isAdmin();
    }
});

function generateNumbers(start, end, increment, type) {
    var select = "";
    var num;
    for (var i = start; i <= end; i += increment) {
        num = (i < 10 ? '0' : '') + i.toString();
        select = select + "<option id=\'" + type + num + "\' value=\'" + num + "\'>" + num + "</option>";
    }
    return select;
}


var d = new Date();
var sYears = generateNumbers(d.getFullYear(), d.getFullYear() + 5, 1, 'sYear');
var sMonths = generateNumbers(1, 12, 1, 'sMonth');
var sDays = generateNumbers(1, 31, 1, 'sDay');
var sHours = generateNumbers(1, 12, 1, 'sHour');
var sMinutes = generateNumbers(0, 59, 15, 'sMinute');
var sAMOption = "<option id='sAM' value='AM'>AM</option><option id='sPM' value='PM'>PM</option>";

var eYears = generateNumbers(d.getFullYear(), d.getFullYear() + 5, 1, 'eYear');
var eMonths = generateNumbers(1, 12, 1, 'eMonth');
var eDays = generateNumbers(1, 31, 1, 'eDay');
var eHours = generateNumbers(1, 12, 1, 'eHour');
var eMinutes = generateNumbers(0, 59, 15, 'eMinute');
var eAMOption = "<option id='eAM' value='AM'>AM</option><option id='ePM' value='PM'>PM</option>";