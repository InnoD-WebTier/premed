Events = new Mongo.Collection("events");

// Code that runs on startup.
// In our case, find all the different collections and make the data
// avaliable to the client.
Meteor.startup(function () {
	console.log("Successful startup");
	Meteor.publish("events", function() {
		return Events.find();
	})
	Meteor.publish("users", function() {
		return Meteor.users.find();
	});
	Meteor.publish("organizations", function () {
		return Organizations.find();
	});
	Meteor.publish("opportunities", function () {
		return Opportunities.find();
	});
	Meteor.publish("about", function () {
		return About.find();
	});
});

Meteor.methods({
	getEvents: function () {
		var eventList = Events.find({}).fetch();
		return eventList;
	},
	
	updateEvent: function(event) {
		console.log(event);
		if (event._id === '') {
			if (event.start == '') {
				console.error('Invalid Start Date');
			} else if (event.end == '') {
				console.error('Invalid End Date');
			} else if (event.title == '') {
				console.error('Your event must have a name!')
			} else {
				var id = Events.insert({
					title: event.title,
					start: event.start,
					info: event.info,
					end: event.end
				});
				return id;
			}
		} else {
			Events.update({_id:event._id}, {
				title: event.title,
				start: event.start,
				info: event.info,
				end: event.end
			});
		}
	},
});
