Router.route('/', function() {
	this.render('landing');
});

Router.route('/suggestion', function() {
	this.render('suggestion');
});

Router.route('/landing', function() {
	this.render('landing');
});

Router.route('/suggestionListView', function() {
	this.render('suggestionListView');
});

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});