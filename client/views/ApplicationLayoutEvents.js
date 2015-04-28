Template.ApplicationLayout.events({
	'click a#pull': function(event) {
		console.log("test1");
        $('ul').slideToggle();
	}
})
