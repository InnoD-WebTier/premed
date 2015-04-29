//Use subscribe here instead!
Meteor.subscribe("items");

Template.suggestionListView.helpers({
	items: function() {
		return Session.get("items");
	}
});

Template.suggestionListView.onCreated(function(){
	Meteor.call('getItems', function(err, itemList){
		Session.set("items", itemList);
	});
});

Template.suggestionListView.events ( {
	'submit .modal-dialog': function(event) {
		event.preventDefault();
		// console.log(event);

		var id = event.target.id;
		console.log(id);
		var subject = $('#' + id + " #subject").val();
		var message = $('#' + id + " #message").val();
		var image = $('#' + id + " #image").val();
		var link = $('#' + id + " #link").val();
		var display = $('#' + id + " #check").prop("checked");

		// console.log(subject);
		// console.log(message);
		// console.log(image);
		// console.log(link);
		// console.log(display);

		Meteor.call('updateItem', id, subject, message, image, link, display, function(err, success) {
			if (success) {
				alert("Content updated! ;)");
			} else {
				alert("Failed to update content ):");
			}
		});
	}
});