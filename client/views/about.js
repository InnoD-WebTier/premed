Meteor.subscribe("about");

Template.about.helpers({
    people: [
        {
            name: 'Ruhi Nath',
            email: 'rnath@berkeley.edu',
            photo: '/img/about/ruhi.png',
            position: 'Co-Founder'
        },
        {
            name: 'Sally Jeon',
            email: 'shjeon27@berkeley.edu',
            photo: '/img/about/sally.png',
            position: 'Co-Founder'
        },
        {
            name: 'Samantha Wong',
            email: 'swong9@berkeley.edu',
            photo: '/img/about/samantha.png',
            position: 'Intern'
        },
        {
            name: 'Karishma Patel',
            email: 'kpatel@berkeley.edu',
            photo: '/img/about/karishma.png',
            position: 'Intern'
        },
        {
            name: 'Zahra Abadin',
            email: 'zahra.abadin@berkeley.edu',
            photo: '/img/about/zahra.png',
            position: 'Intern'
        },
        {
            name: 'Pallavi Chadha',
            email: 'pchadha96@berkeley.edu',
            photo: '/img/about/pallavi.png',
            position: 'Intern'
        },
        {
            name: 'Tina Pai',
            email: 'tinapai@berkeley.edu',
            photo: '/img/about/tina.png',
            position: 'Intern'
        }
    ],

    aboutText: function() {
        list = About.find().fetch();
        return list[0];
    },
});

