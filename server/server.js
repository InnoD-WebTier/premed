Items = new Mongo.Collection("items");
Clubs = new Mongo.Collection("clubs");
Events = new Mongo.Collection("events");

//Code that runs on startup.
Meteor.startup(function () {
	console.log("Successful startup");
	console.log(Items.find().fetch());
	Meteor.publish("items", function() {
		return Items.find({});
	});
	Meteor.publish("clubs", function() {
		return Clubs.find({});
	});
	Meteor.publish("events", function() {
		return Events.find({});
	})
  Meteor.publish("users", function() {
    return Meteor.users.find();
  });
});

Meteor.methods({
  
  /* CRUD for Opportunities
   * - category : string
   * - title : string
   * - date : datetime
   * - desc : string
   * - links : arrays( { title : string, url : string } ) */
  insertOpportunity : function(category, title, date, desc, links) {
    Items.insert({
      'type' : 'opportunity',
      'category' : category,
      'title' : title,
      'date' : date,
      'description' : desc,
      'links' : links
    });
    return true;
  },
  
  getOpportunity : function(id) {
    return Items.find({ '_id' : id }).fetch();
  },

  getAllOpportunities : function() {
    var items = Items.find({}).fetch();
    console.log(items);
    return items;
  },

  updateOpportunity : function(id, category, title, date, desc, links) {

    Items.update({ '_id' : id}, {
      'type' : 'opportunity',
      'category' : category,
      'title' : title,
      'date' : date,
      'description' : description,
      'links' : links
    });

  },

  deleteOpportunity : function(id) {
    if (Items.find({ '_id' : id })) {
      Items.remove({ '_id' : id });
    } else {
      throw 'Invalid Key';
    }
  },

	deleteEvent: function (key) {
		if (Events.find({id:key})) {
			console.log(Events.remove({_id:key}));
		} else {
			throw 'Invalid key';
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
