Router.route('/', function() {
	this.render('landing');
});

Router.route('/advising', function() {
	this.render('advising');
});

Router.route('/orgs', function() {
	this.render('orgs');
});

Router.route('/resources', function() {
	this.render('resources');
});

Router.route('/contribute', function() {
	this.render('contribute');
});

Router.route('/opportunities', function() {
	this.render('suggestionListView');
});

Router.route('/about', function() {
	this.render('about');
});

Router.route('/mcat', function() {
  this.render('mcat');
});

Router.route('/admin', function() {
  this.render('admin');
});

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});
