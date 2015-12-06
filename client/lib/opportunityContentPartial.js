Template.opportunityContentPartial.onRendered(function() {

  var editor = this.$('#editContent').markdown({
    'autofocus': false,
    'savable': false
  });

});


Template.opportunityContentPartial.onDestroyed(function() {
  $('.md-editor').remove();
});
