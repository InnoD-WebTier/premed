/*
Need:
	How to log in - add isAdmin later
	Modale/stylish popup for adding event
	Drop down/window for displaying event info
*/
if (Meteor.isClient) {
	Events = new Mongo.Collection('events');
	addEventToggle = 0;
	startDate = '';
	endDate = '';

	Template.calendar.rendered = function(){
		Meteor.subscribe("events", function() {
			$("#myCalendar").fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
				dayClick: function(date, jsEvent, view) {
					console.log('clicked');
					console.log(addEventToggle);
					if (addEventToggle == 1) {
						startDate = date.format();
						addEventToggle = 2;
						document.getElementById('addToggle').innerHTML = 'Pick an end date';
					} else if (addEventToggle = 2) {
						endDate = date.format();
						addEventToggle = 3;
						document.getElementById('addToggle').innerHTML = "Add Event";
						document.getElementById('description').style.visibility = "visible";
					}
				},
				defaultDate: new Date(),
				defaultView: 'month',
				editable: true,
				events: Events.find({}).fetch()
			});
		});
	}

	Template.calendar.events({
		"click #addToggle": function(e) {
			e.preventDefault();
			if (addEventToggle == 0) {
				console.log('successful');
				addEventToggle = 1;
				document.getElementById('addToggle').innerHTML = 'Select a start date';
			} else if (addEventToggle == 3) {
				var desc = document.getElementById('description').value;
				var event = {
					title: desc,
					start: startDate,
					end: endDate
				};
				Meteor.call('insertEvent', event, function(err, success) {
					if (err) {
						console.log('event failed');
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
		}
	});
}