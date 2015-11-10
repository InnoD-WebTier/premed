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
  }
});

Template.opportunities.helpers({
  opportunities: function() {
    return [
      {
        category: 'Current Clinical Opportunities',
        opportunities: [
          {
            name: 'American Bone Health',
            due_date: 'April 30, 2015',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam explicabo ex doloremque, enim perferendis praesentium eos voluptates impedit suscipit quis corrupti quaerat laborum reprehenderit, rem inventore odit eum eveniet veniam quo nesciunt, ratione corporis similique ipsa.',
            website: 'lol.com'
          },
        ]
      },
      {
        category: 'Clinical Resources',
        subcategories: [
          {
            name: 'Cal Career Center'
          }
        ]
      }
    ]
  },
});