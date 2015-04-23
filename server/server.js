Items = new Mongo.Collection("items");

//Code that runs on startup.
Meteor.startup(function () {
	console.log("Successful startup");
});

Meteor.methods({
	insertSuggestion: function (name, email, subject, content) {
		Items.insert({
			name: name,
			email: email,
			subject: subject,
			content: content,
			display: false,
		});
		return true;
	},

	getItems: function () {
		return Items.find({}).fetch();
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