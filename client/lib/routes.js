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

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});