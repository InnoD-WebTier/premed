// check if user is logged in



// check if button is clicked

// function that computes where a button is clicked,
// if clicked, change the view
// {{#if ButtonChecked true}}
//	{{UI.insert()}}

Template.orgs.helpers({
    categories: function(){
        return ["facebook", "news", "tv", "tweets"]
    }
});

Template.orgs.events({
    "change #category-select": function (event, template) {
        var org = $(event.currentTarget).val();
        console.log("org : " + org);
        // additional code to do what you want with the category
    }
});

// Template.orgs.helpers({

// 	'loginCheck #loginCheck': function(event) {
// 	var user = Meteor.userId();
// 	if (user) {
// 		return true;
// 	} else {
// 		return false;
// 		}
// 	},
	
// 	'getClubs #club-list': function(event) {
// 		return Clubs.find();
// 	}
// })

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