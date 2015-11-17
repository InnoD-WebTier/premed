Template.opportunityModal.onCreated(function() {
  Session.set('modalType', 'content');
  Session.set('linkNum', 1);
});

Template.opportunityModal.helpers({
  'contentType' : function() {
    return Session.get('modalType') == 'content';
  },

  'linkType' : function() {
    return Session.get('modalType') == 'link';
  },
  'linkNum' : function() {
    var n = Session.get('linkNum');
    var arr = new Array(n);
    for (var i=0; i < n; i++) {
      arr[i] = i;
    }
    return arr;
  },
  'editing' : function() {
    return this.mode == 'edit';
  },
  'adding' : function() {
    return this.mode == 'new';
  }
});


Template.opportunityModal.events({
  "click input[name='category']" : function(event, template) {
    var type = template.$(event.target).data('type');
    Session.set('modalType', type);
  },

  "click .addText" :  function(event, template) {
    var currNum = Session.get('linkNum');
    Session.set('linkNum', currNum+1);
  },

  "click .fa-times" : function(event, template) {
    var urlField = template.$(event.target).prev();
    var nameField = $(urlField).prev();
    urlField.remove();
    nameField.remove();
    template.$(event.target).remove();

  }
  

});
