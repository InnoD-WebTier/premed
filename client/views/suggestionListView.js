//Use subscribe here instead!

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


