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

Router.route('/academics', function() {
	this.render('academics');
}, {
	onAfterAction: function() {
		return setTitle('Academics');
	}
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
		return setTitle('Clubs');
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

Router.route('/calendar', function() {
	this.render('calendar');
});

Router.configure({
	layoutTemplate: 'ApplicationLayout',
	notFoundTemplate: '404'
});

// Allows clicking on sublink from a different page
Router.onAfterAction(function() {
    var self = this;
    $(window).scrollTop(0);
    if (this.params.hash) {
        Tracker.afterFlush(function() {
            if (typeof $("#" + self.params.hash).offset() !== "undefined") {
            	var elem = $("#" + self.params.hash);
            	var elemHeight = elem.height();
                $(document).scrollTop(elem.offset().top - elemHeight - 20);
            }
        });
    }
});

this.setTitle = function(title) {
  document.title = title;
};
