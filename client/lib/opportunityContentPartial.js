Template.opportunityContentPartial.onRendered(function() {

  this.$('#editContent').markdown({
    'autofocus': false,
    'savable': false
  });

});


Template.opportunityContentPartial.onDestroyed(function() {
  $('.md-editor').remove();
});
