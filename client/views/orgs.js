Meteor.subscribe("users");

Template.orgs.events({
    "change #category-select": function (event, template) {
        var org = $(event.currentTarget).val();
        console.log("org : " + org);
        // additional code to do what you want with the category
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
    return [
      {
        category: 'DeCals',
        clubs: [
          {
            name: 'AAPI Community Health Issues DeCal',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam explicabo ex doloremque, enim perferendis praesentium eos voluptates impedit suscipit quis corrupti quaerat laborum reprehenderit, rem inventore odit eum eveniet veniam quo nesciunt, ratione corporis similique ipsa.',
            website: 'lol.com'
          },
          {
            name: 'Critical Understanding of Global Health DeCal',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam explicabo ex doloremque, enim perferendis praesentium eos voluptates impe    dit suscipit quis corrupti quaerat laborum reprehenderit, rem inventore odit eum eveniet veniam quo nesciunt, ratione corporis similique ipsa.',
            website: 'lol.com'
          }
        ]
      },
      {
        category: 'Global Abroad Organizations',
        clubs: [
          {
            name: 'Berkeley Alliance for Global Health',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam explicabo ex doloremque, enim perferendis praesentium eos voluptates impedit suscipit quis corrupti quaerat laborum reprehenderit, rem inventore odit eum eveniet veniam quo nesciunt, ratione corporis similique ipsa.',
            website: 'lol.com'
          },
          {
            name: 'Engineering World Health',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam explicabo ex doloremque, enim perferendis praesentium eos voluptates impedit suscipit quis corrupti quaerat laborum reprehenderit, rem inventore odit eum eveniet veniam quo nesciunt, ratione corporis similique ipsa.',
            website: 'lol.com'
          },
          {
            name: 'Foundation for International Medical Relief for Children',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam explicabo ex doloremque, enim perferendis praesentium eos voluptates impedit suscipit quis corrupti quaerat laborum reprehenderit, rem inventore odit eum eveniet veniam quo nesciunt, ratione corporis similique ipsa.',
            website: 'lol.com'
          }
        ]
      },
      {
        category: 'Health Related Clubs',
        clubs: [
          {
            name: 'Active Minds',
            description: ''
          },
          {
            name: 'American Medical Student Association (AMSA) Premedical Chapter',
            description: ''
          },
          {
            name: "American Medical Woman's Association (AMWA)",
            description: ''
          }
        ]
      },
      {
        category: 'Pre-Health Fraternities & Sororities',
        clubs: [
          {
            name: 'PhiDE',
            description: '',
            website: ''
          },
          {
            name: 'Phi Chi',
            description: '',
          },
          {
            name: 'KGD',
          },
          {
            name: 'Sigma Mu Delta',
          }
        ]
      }
    ]
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
