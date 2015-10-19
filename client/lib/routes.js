Router.route('/', function() {
	this.render('landing');
}, {
	onAfterAction: function() {
		return setTitle('Home');
	}
});

Router.route('/about', function() {
	this.render('about');
}, {
	onAfterAction: function() {
		return setTitle('About');
	}
});

Router.route('/academics',
	{
		name: 'academics'
	},
	function() {
		this.render('academics');
});

Router.route('/advising', function() {
	this.render('advising');
}, {
	onAfterAction: function() {
		return setTitle('Advising');
	}
});

Router.route('/orgs', function() {
	this.render('orgs');
}, {
	onAfterAction: function() {
		return setTitle('Organizations');
	}
});

Router.route('/resources', function() {
	this.render('resources');
}, {
	onAfterAction: function() {
		return setTitle('Resources');
	}
});

Router.route('/contribute', function() {
	this.render('contribute');
}, {
	onAfterAction: function() {
		return setTitle('Contribute');
	}
});

Router.route('/opportunities', function() {
	this.render('suggestionListView');
}, {
	onAfterAction: function() {
		return setTitle('Opportunities');
	}
});

Router.route('/mcat', function() {
  this.render('mcat');
}, {
	onAfterAction: function() {
		return setTitle('Resources');
	}
});

Router.route('/admin', function() {
  this.render('admin');
}, {
	onAfterAction: function() {
		return setTitle('Admin');
	}
});

Router.configure({
	layoutTemplate: 'ApplicationLayout',
	notFoundTemplate: '404'
});

this.setTitle = function(title) {
  document.title = title;
};
