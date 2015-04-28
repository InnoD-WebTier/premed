Template.suggestion.events({
	'submit #suggestion-form': function(event) {
		event.preventDefault();

		var name = $('#name').val();
		var email = $('#email').val();
		var subject = $('#subject').val();
		var message = $('#message').val();
		var image = $('#image').val();
		var link = $('#link').val();

		Meteor.call('insertSuggestion', name, email, subject, message, link, image, function(err, success) {
			if (success) {
				alert("You've added content! ;)");
			} else {
				alert("Failed to add content ):");
			}
		});
	}
})