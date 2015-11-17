var getOpportunities = function() {
  var all = [
  {
    category: 'Current Clinical Opportunities',
    opportunities: [
      {
        name: 'American Bone Health',
        due_date: 'April 30, 2015',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam explicabo ex doloremque, enim perferendis praesentium eos voluptates impedit suscipit quis corrupti quaerat laborum reprehenderit, rem inventore odit eum eveniet veniam quo nesciunt, ratione corporis similique ipsa.',
        website: 'lol.com'
      }]
    }
  ];
  return all; 

};


Template.opportunities.events({
  'click .section-item-title': function(event, template) {
    var list_item = template.$(event.target).parent();
    var desc_body = list_item.children('.section-item-body');
    // desc_body.is(':visible') ? desc_body.slideUp() : desc_body.slideDown();
    if (list_item.hasClass('expanded')) {
      list_item.removeClass('expanded');
      desc_body.slideUp();
    } else {
      list_item.addClass('expanded');
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
  }

});

Template.opportunities.helpers({
  opportunities: getOpportunities,
});



