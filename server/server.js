Items = new Mongo.Collection("items");
Clubs = new Mongo.Collection("clubs");
Events = new Mongo.Collection("events");

//Code that runs on startup.
Meteor.startup(function () {
	console.log("Successful startup");
	console.log(Clubs.find().fetch());
	Meteor.publish("items", function() {
		return Items.find();
	});
	Meteor.publish("clubs", function() {
		return Clubs.find();
	});
	Meteor.publish("events", function() {
		return Events.find({});
	})
  Meteor.publish("users", function() {
    return Meteor.users.find();
  });
});

Meteor.methods({
	deleteEvent: function (key) {
		if (Events.find({id:key})) {
			console.log(Events.remove({_id:key}));
		} else {
			throw 'Invalid key';s
		}
	},
	
	insertSuggestion: function (name, email, subject, body, link, image) {
		if (!image) {
			image = "http://placekitten.com/g/300/205";
		}

		Items.insert({
			name: name,
			email: email,
			subject: subject,
			body: body,
			display: false,
			link: link,
			image: image,
		});

		return true;
	},

	insertClubSuggestion: function (name, email, subject, body, link, image) {
		if (!image) {
			image = "http://placekitten.com/g/300/205";
		}

		Clubs.insert({
			name: name,
			email: email,
			subject: subject,
			body: body,
			display: false,
			link: link,
			image: image,
		});

		return true;
	},

	insertEvent: function (event) {
		if (event.start == '') {
			throw 'Invalid Start Date';
		} else if (event.end == '') {
			throw 'Invalid End Date';
		} else {
			var id = Events.insert({
				title: event.title,
				start: event.start,
				info: event.info,
				end: event.end
			});
			return id;
		}
	},
	
	getClubs: function () {
		var itemList = Clubs.find({}).fetch();
		console.log(itemList);
		return itemList;
	},

	getItems: function () {
		var itemList = Items.find({}).fetch();
		console.log(itemList);
		return itemList;
	},

	getEvents: function () {
		var eventList = Events.find({}).fetch();
		console.log(eventList);
		return eventList;
	},

	updateItem: function(id, subject, message, image, link, display) {
		if (!image) {
			image = "http://placekitten.com/g/300/205";
		}

		Items.update({_id: id}, {
			subject: subject, 
			body: message,
			image:image,
			link:link,
			display: display,
		});

		return true;
	},

	updateEvent: function(event) {
		console.log(event);
		Events.update({_id:event._id}, {
			title: event.title,
			start: event.start,
			info: event.info,
			end: event.end
		});
	},

  setAdmin: function (id, value) {
    var auth_as = Meteor.users.findOne( { _id: Meteor.userId() } );
    if (auth_as.admin) {
      Meteor.users.update({_id: id}, {
        $set: {admin: value},
      });
    } else if (Meteor.users.find( { admin: true } ).count() === 0) {
      console.log("No admins exist, allowing access to setAdmin.");
      Meteor.users.update({_id: id}, {
        $set: {admin: value},
      });
    } else {
      console.log("Not an admin!")
      return false;
    }
    return true;
  },

  isAdmin: function () {
    return Meteor.users.findOne( { _id: Meteor.userId() } ).admin ||
       Meteor.users.find( { admin: true } ).count() === 0;
  },
});
