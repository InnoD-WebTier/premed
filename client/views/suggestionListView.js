//Use subscribe here instead!
Meteor.subscribe("items");

Template.suggestionListView.helpers({
	items: function() {
		console.log(Session.get("items"));
		return Session.get("items");
	}
});

Template.suggestionListView.onCreated(function(){
	Meteor.call('getItems', function(err, itemList){
		Session.set("items", itemList);
	});
});


