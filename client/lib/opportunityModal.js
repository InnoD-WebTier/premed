Meteor.subscribe("items");

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
    return this.mode == 'add';
  },

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

  },

  "click #opportunitySubmit" : function(event, template) {
    var form = template.$("form[name='opportunitiesForm']");
    if (this.mode == 'add') {
      addNewOpportunity(event, template, form);
    }
    else if (this.mode == 'new') {
      editOpportunity(event, template, form);
    }
  }

  

});

// Create a new opportunity
function addNewOpportunity(event, template, form) {
  var category, title, date, desc, links, mm, dd, yyyy, hh, ii;
  
  // are we adding opportunities with content?
  if (Session.get('modalType') == 'content') {
    category = template.$("input[name='category']").val();
    title = template.$("input[name='title']").val();
    mm = template.$("input[name='month']").val();
    dd = template.$("input[name='day']").val();
    yyyy = template.$("input[name='year']").val();
    hh = template.$("input[name='hour']").val();
    ii = template.$("input[name='minutes']").val();
    desc = template.$(".md-input").val();
    links = getLinkFields(template);

    Meteor.call('insertOpportunity', category, title, date, desc, links);

    console.log(Meteor.call('getAllOpportunities'));

  }
  // Or adding resource links?
  else if (Session.get('modalType') == 'link') {

  }

}

// Edit existing
function editOpportunity(event, template, form) {

}

// return list of link objects
function getLinkFields(template) {
  var linkTitles = template.$(".linkTitle");
  var linkURL = template.$(".linkURL");
  var links = [];
  
  linkTitles.each(function(index) {
    links.push({
      'linkTitle' : $(this).val()
    });
  });

  linkURL.each(function(index) {
    links[index].linkURL = $(this).val()
  });

  return links;
}

