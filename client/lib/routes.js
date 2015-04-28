Router.route('/', function() {
	this.render('index');
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