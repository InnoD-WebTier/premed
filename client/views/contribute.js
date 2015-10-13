var insertMsg = function(err, success) {
  if (success) {
    alert("You've added content ;)!");
  } else {
    alert("Failed to add content :(");
  }
};

Template.contribute.events({

  'change #imageUploader': function(event, template) {
      var file = event.target.files[0];
      if (file) {
        template.uploadedImage = file;
        template.$("#image").val(file.name).prop("disabled", true);
      }
    },

	'submit #suggestion-form': function(event, template) {
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
          // TODO: awkward naming convention by collectionFS, need to change
          image = "/img/uploads/" + fileObj.collectionName + "-" +  fileObj._id + "-" + image;
          Meteor.call('insertSuggestion', name, email, subject,
                      message,link, image, insertMsg); 
        }
      });
    } else {
      Meteor.call('insertSuggestion', name, email, subject, 
                message, link, image, insertMsg);
    }
  }
})
