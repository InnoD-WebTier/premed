Meteor.subscribe("users");
Meteor.subscribe('organizations');

Template.orgs.events({
  'click .section-item-title': function(event, template) {
    var list_item = template.$(event.target).parent();
    var desc_body = list_item.children('.section-item-body');
    var exp_arrow = list_item.find('.fa-angle-right');
    // desc_body.is(':visible') ? desc_body.slideUp() : desc_body.slideDown();
    if (list_item.hasClass('expanded')) {
      list_item.removeClass('expanded');
      exp_arrow.removeClass('rotated');
      desc_body.slideUp();
    } else {
      list_item.addClass('expanded');
      exp_arrow.addClass('rotated');
      desc_body.slideDown();
    }
  }
});

Template.orgs.helpers({
  clubs: function() {
    collection = []
    allowedValues = ["Global Abroad Organizations", "Health Related Clubs", "Decals", "Pre-Health Fraternities & Sororities", "Non-Health-Related Clubs", "Tutoring & Teaching", "Mentoring", "Science & Society"];

    for (i=0; i < allowedValues.length; i++) {
      section = {};
      section['orgs'] = [];
      section['category'] = allowedValues[i];
      collection.push(section);
    }

    list = Organizations.find().fetch();

    for (i=0; i < list.length; i++) {
      item = list[i];
      categoryItem = item.category;
      for (j=0; j < collection.length; j++) {
        section = collection[j];
        if (categoryItem === section.category) {
          collection[j].orgs.push(item);
        }
      }
    }
    return collection;
  },
});
