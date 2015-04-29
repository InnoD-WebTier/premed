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
<<<<<<< HEAD

Template.suggestionListView.events ( {
	'submit .modal-dialog': function(event) {
		event.preventDefault();
		// console.log(event);

		var id = event.target.name;
		console.log(id);
		var subject = $('#'+id+" .subject").val();
		console.log(subject);

		// var subject = $('#subject').val();
		// var message = $('#message').val();
		// var image = $('#image').val();
		// var link = $('#link').val();
		// var display = $('#display').attr('checked');;
		// console.log(subject);

		Meteor.call('setItems', function(err, success) {
			if (success) {
				alert("Content updated! ;)");
			} else {
				alert("Failed to update content ):");
			}
		});
	}
});
=======
>>>>>>> 622152a4c76981c9c6c66087e01c0479e8fcb998
