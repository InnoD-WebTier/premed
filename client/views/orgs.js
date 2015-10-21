Meteor.subscribe("users");

Template.orgs.onCreated(function(){
	Meteor.call('getClubs', function(err, itemList){
		Session.set("clubs", itemList);
	});

  // template.$('.club-link-exp-body').hide();
});

Template.orgs.events({
    "change #category-select": function (event, template) {
        var org = $(event.currentTarget).val();
        console.log("org : " + org);
        // additional code to do what you want with the category
    },

    // There has to be an easier way to do this

   	"click #renderForm": function(event, template) {
   		template.$(".test").toggle();
   	},

   	"click #first": function(event, template) {
   		template.$(".contents1").toggle();
   	},

   	"click #second": function(event, template) {
   		template.$(".contents2").toggle();
   	},

   	"click #third": function(event, template) {
   		template.$(".contents3").toggle();
   	},

   	"click #fourth": function(event, template) {
   		template.$(".contents4").toggle();
   	},

   	"click #fifth": function(event, template) {
   		template.$(".contents5").toggle();
   	},

   	"click #sixth": function(event, template) {
   		template.$(".contents6").toggle();
   	},

   	"click #seventh": function(event, template) {
   		template.$(".contents7").toggle();
   	},

   	"click #eighth": function(event, template) {
   		template.$(".contents8").toggle();
   	},
    
    "change #imageUploader": function(event, template) {
      var file = event.target.files[0];
      if (file) {
        template.uploadedImage = file;
        template.$("#image").val(file.name).prop("disabled", true);
      }
    },

   	"submit #suggestion-form": function(event, template) {
      event.preventDefault();

      var name = $('#name').val();
      var email = $('#email').val();
      var subject = $('#subject').val();
      var message = $('#message').val();
      var image = $('#image').val();
      var link = $('#link').val();
      

      if (template.uploadedImage) {
        Images.insert(template.uploadedImage, function(err, fileObj) {
          if (!err) {
            image = genImageName(image, fileObj);
            Meteor.call('insertClubSuggestion', name, email, subject,
                        message,link, image, insertMsg); 
            template.uploadedImage = undefined;
          }
        });
      } else {
        Meteor.call('insertClubSuggestion', name, email, subject, 
                  message, link, image, insertMsg);
    }
	},

  'click .section-list-item-title': function(event, template) {
    var list_item = template.$(event.target).parent();
    var desc_body = list_item.children('.section-list-item-body');
    desc_body.is(':visible') ? desc_body.slideUp() : desc_body.slideDown();
  }
});

Template.orgs.helpers({
	'loginCheck #loginCheck': function(event) {
	var user = Meteor.userId();
	if (user) {
		return true;
	} else {
		return false;
		}
	},

	clubs: function() {
		return Session.get("clubs");
	},

	clubCheck: function(string1, string2) {
		if (string1 === string2) {
			return true;
		} else {
			return false;
		}
	},

	'is_Admin': function() {
		return Meteor.user() && Meteor.users.findOne( { _id: Meteor.userId() }).admin;
	}
});
