Items = new Mongo.Collection("items");

//Code that runs on startup.
Meteor.startup(function () {
	console.log("Successful startup");

	Meteor.publish("items", function() {
		return Items.find();
	});
});

Meteor.methods({
	insertSuggestion: function (name, email, subject, body, link, image) {
		if (!image) {
			image = "http://placekitten.com/g/300/200";
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

	getItems: function () {
		var itemList = Items.find({}).fetch();
		console.log(itemList);
		return itemList;
	},

	// getDisplayedItems: function () {
	// 	return Items.find({display: true}).fetch();
	// },

	// toggleItemDisplay: function () {
	// 	if (Item.find(id).display == true) {
	// 		item.display = false;
	// 	};
	// 	else {
	// 		item.display = true;
	// 	}
	// },
});