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
						var end = event.start.format();
					} else {
						var end = event.end.format();
					}
					currID = event._id;
					document.getElementById('info').innerHTML = event.title;
					document.getElementById('startDate').innerHTML = event.start.format();
					document.getElementById('endDate').innerHTML = end;
					document.getElementById('eventInfo').checked = true;
				});
			}
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
			var start = document.getElementById('startDate').innerHTML;
			var end = document.getElementById('endDate').innerHTML;
			document.getElementById('startDate').innerHTML = "<input type='text' id='editStart' value='" + start + "'/>";
			document.getElementById('endDate').innerHTML = "<input type='text' id='editEnd' value='" + end + "'/>";
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
			var start = document.getElementById('editStart').value;
			var end = document.getElementById('editEnd').value;
			var event = {
				_id: currID,
				start: start,
				end: end,
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