// Subscribe to relevant Collections
Meteor.subscribe("opportunities");

Template.opportunities.events({
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
  },

  'click .modal-btn' : function(event, template) {
    var modalType = template.$(event.target).data('modal-template');
    var category = template.$(event.target).data('category');
    var opts = {};

    if (modalType == 'opportunityModal') {
      opts.mode = template.$(event.target).data('mode');
      opts.category = category;
    }

    Modal.show(modalType, opts);
  },

});

Template.opportunities.helpers({
  opportunities: function() {
    collection = []
    allowedValues = ["Current Clinical Opportunities", "Clinical Resources"];

    for (i=0; i < allowedValues.length; i++) {
      section = {};
      section['opportunities'] = [];
      section['category'] = allowedValues[i];
      collection.push(section);
    }

    list = Opportunities.find().fetch();

    for (i=0; i < list.length; i++) {
      item = list[i];
      categoryItem = item.category;
      for (j=0; j < collection.length; j++) {
        section = collection[j];
        if (categoryItem === section.category) {
          collection[j].opportunities.push(item);
        }
      }
    }
    return collection;
  },
});
