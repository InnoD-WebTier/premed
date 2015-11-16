Meteor.subscribe("users");

Template.admin.helpers({
  users: function() {
    return Meteor.users.find();
  }
});

Template.registerHelper('is_admin', function() {
  return Meteor.user() && (
         Meteor.users.findOne( { _id: Meteor.userId() }).admin || 
         Meteor.users.find( { admin: true } ).count() === 0);
});

Template.admin.events({
  "click .set-admin": function () {
    Meteor.call('setAdmin', this._id, true, function (err, success) {
      if(!success) {
        alert("Failed to set admin");
      }
    });
  },
  "click .unset-admin": function () {
    Meteor.call('setAdmin', this._id, false, function (err, success) {
      if(!success) {
        alert("Failed to set admin");
      }
    });
  }
});

