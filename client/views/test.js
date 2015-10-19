/*
Need:
	How to log in - add isAdmin later
	Modale/stylish popup for adding event
	Drop down/window for displaying event info
*/
Events = new Mongo.Collection('events');
addEventToggle = 0;
startDate = '';
endDate = '';
currID = '';
editMode = 0;
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
				console.log('clicked');
				console.log(addEventToggle);
				if (addEventToggle === 1) {
					startDate = date.format();
					addEventToggle = 2;
					document.getElementById('addToggle').innerHTML = 'Pick an end date (Click here to cancel)';
				} else if (addEventToggle === 2) {
					endDate = date.format();
					addEventToggle = 3;
					document.getElementById('addToggle').innerHTML = "Add Event";
					document.getElementById('description').style.visibility = "visible";
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
					currID = event._id;
					document.getElementById('info').innerHTML = event.title;
					document.getElementById('startDate').innerHTML = event.start.format("MMMM Do, YYYY");
					document.getElementById('startTime').innerHTML = event.start.format("h:mm a");
					document.getElementById('endDate').innerHTML = endDay;
					document.getElementById('endTime').innerHTML = endTime;
					document.getElementById('eventInfo').checked = true;
				});
			},
			timezone: "local"
		});
		console.log(Events.find({}).fetch());
	});
}

Template.calendar.events({
	"click #addToggle": function(e) {
		e.preventDefault();
		if (addEventToggle === 0) {
			console.log('successful');
			addEventToggle = 1;
			document.getElementById('addToggle').innerHTML = 'Select a start date (Click here to Cancel)';
		} else if (addEventToggle === 1 || addEventToggle === 2) {
			addEventToggle = 0;
			startDate = '';
			endDate = '';
			document.getElementById('addToggle').innerHTML = 'Add Event';
		} else if (addEventToggle === 3) {
			var desc = document.getElementById('description').value;
			var event = {
				title: desc,
				start: startDate,
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
			document.getElementById('addToggle').innerHTML = 'Add Event';
			document.getElementById('description').style.visibility = "hidden";
			startDate = '';
			endDate = '';
		}
	},

	"click #edit": function(e) {
		e.preventDefault();
		if (editMode === 0) {
			editMode = 1;
			console.log(document.getElementById('info').innerHTML);
			var desc = document.getElementById('info').innerHTML;
			console.log(desc);
			var startDate = document.getElementById('startDate').innerHTML;
			var startTime = document.getElementById('startTime').innerHTML;
			var endDate = document.getElementById('endDate').innerHTML;
			var endTime = document.getElementById('endTime').innerHTML;
			if (endDate === noEndDate) {
				endDate = '';
				endTime = '';
			}
			document.getElementById('startDate').innerHTML = "<input type='text' id='editStartDate' value='" + startDate + "'/>";
			document.getElementById('startTime').innerHTML = "<input type='text' id='editStartTime' value='" + startTime + "'/>";
			document.getElementById('endDate').innerHTML = "<input type='text' id='editEndDate' value='" + endDate + "'/>";
			document.getElementById('endTime').innerHTML = "<input type='text' id='editEndTime' value='" + endTime + "'/>";
			document.getElementById('info').innerHTML = "Title: <input type='text' id='editDesc' value=\"" + desc + "\"/>";
			confirmButtons();
		}
	},

	"click #delete": function(e) {
		e.preventDefault();
		if (deleteMode === 0) {
			deleteMode = 1;
			document.getElementById('deleteMessage').innerHTML = "Are you sure you want to delete this event?\n";
			document.getElementById('deleteMessage').style.display = "inline";
			confirmButtons();
		}
	},

	"click #confirm": function(e) {
		if (editMode === 1) {
			var desc = document.getElementById('editDesc').value;
			var startDate = document.getElementById('editStartDate').value;
			var startTime = document.getElementById('editStartTime').value;
			var endDate = document.getElementById('editEndDate').value;
			var endTime = document.getElementById('editEndTime').value;
			console.log(startDate + ' ' + startTime);
			console.log($.fullCalendar.moment(startDate + ' ' + startTime, "MMMM Do, YYYY h:mm a"));
			console.log($.fullCalendar.moment(startDate + ' ' + startTime, "MMMM Do, YYYY h:mm a").toISOString());
			var event = {
				_id: currID,
				start: $.fullCalendar.moment(startDate + ' ' + startTime, "MMMM Do, YYYY h:mm a").toISOString(),
				end: $.fullCalendar.moment(endDate + ' ' + endTime, "MMMM Do, YYYY h:mm a").toISOString(),
				title: desc
			};
			console.log(event);
			Meteor.call('updateEvent', event, function (err, success) {
				if (err) {
					console.log('failed to edit event');
					console.log(err);
				} else {
					console.log('event editted');
					refetch();
				}
				editMode = 0;
				revert();
				document.getElementById('eventInfo').checked = false;
			});
		} else if (deleteMode === 1) {
			Meteor.call('deleteEvent', currID, function (err, success) {
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
		}
	}, 

	"click #cancel, click #closebox": function(e) {
		revert();
		deleteMode = 0;
		editMode = 0;
		currId = '';
		document.getElementById('eventInfo').checked = false;
	}
});