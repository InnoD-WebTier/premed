Template.ApplicationLayout.events({
    'click a.anchorLink': function(e) {
        var link = e.target;
        var href = $(link).attr('href');
        var path = window.location.pathname;
        var pathName = path.substr(1);
        var location = pathName.split('/')[0];
        location = location.split('#')[0];

        if (href.split('#')[0].indexOf(location) >= 0 && path !== '/') {
            e.preventDefault();
            var hash = href.split('#')[1];
            var elem = $('#' + hash);

            if (elem && elem.offset() !== 'undefined') {
                console.log("found element")
                var elemHeight = elem.height();
                $('html,body').animate({
                    scrollTop: (elem.offset().top - elemHeight - 20) + 'px'
                }, {
                    duration: 250
                });
            }
        }
    }
})

