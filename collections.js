Opportunities = new orion.collection('opportunities', {
	singularName: 'opportunity',
	pluralName: 'opportunities',
	link: {
		title: 'Opportunities'
	},
	tabular: {
		columns: [
			{
				data: "title",
				title: "Opportunity Name"
			},{
				data: "author",
				title: "Post Author"
			},{
				data: "description",
				title: "Opportunity Description"
			},{
				data: "category",
				title: "Opportunity Type"
			},{
				data: "link",
				title: "Website link"
			},
			orion.attributeColumn('createdAt', 'time', 'Submitted')
		]
	}
});

Opportunities.attachSchema(new SimpleSchema ({
	title: {
		type: String,
		optional: false,
		label: "Opportunitiy Name"
	},
	author: {
		type: String,
		optional: false,
		label: "Author"
	},
	description: orion.attribute('summernote', { label: "Description" }),
	category: {
		type: String,
		label: "Opportunity Type",
		allowedValues: ["Current Clinical Opportunities", "Clinical Resources"]
	},
	link: {
		type: String,
		label: "Website Link",
		optional: true
	},
	time: orion.attribute('createdAt')
}));

Opportunities.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

Organizations = new orion.collection('organizations', {
	singularName: 'organization',
	pluralName: 'organizations',
	link: {
		title: 'Organizations'
	},
	tabular: {
		columns: [
			{
				data: "title",
				title: "Org Name"
			},{
				data: "author",
				title: "Post Author"
			},{
				data: "description",
				title: "Org Description"
			},{
				data: "category",
				title: "Org Type"
			},{
				data: "link",
				title: "Website link"
			},
			orion.attributeColumn('createdAt', 'time', 'Submitted')
		]
	}
});

Organizations.attachSchema(new SimpleSchema ({
	title: {
		type: String,
		optional: false,
		label: "Org Name"
	},
	author: {
		type: String,
		optional: false,
		label: "Post Author"
	},
	description: orion.attribute('summernote', { label: "Org Description" }),
	category: {
		type: String,
		label: "Org Type",
		allowedValues: ["Global Abroad Organizations", "Health Related Clubs", "Decals", "Pre-Health Fraternities & Sororities", "Non-Health-Related Clubs", "Tutoring & Teaching", "Mentoring", "Science & Society"]
	},
	link: {
		type: String,
		label: "Website link",
		optional: true
	},
	time: orion.attribute('createdAt')
}));

Opportunities.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

// Officers = new orion.collection('officer', {
//   singularName: 'officer',
//   pluralName: 'officers',
//   link: {
//     title: 'Officers'
//   },
//   tabular: {
//     columns: [
//       { data: "name", title: "Full Name" },
//       { data: "position", title: "Position" },
//       { data: "email", title: "Email" },
//       orion.attributeColumn('image', 'image', 'Image'),
//     ]
//   }
// });

// Officers.attachSchema(new SimpleSchema({
// 	name: {
// 		type: String,
// 	},
// 	position: {
// 		type: String,
// 	},
// 	email: {
// 		type: String,
// 	},
// 	image: orion.attribute('image', {
// 	  label: 'Image',
// 	}),
// 	time: orion.attribute('createdAt')
// }));

// Officers.allow({
//   update: function(userId, post) { return ownsDocument(userId, post); },
//   remove: function(userId, post) { return ownsDocument(userId, post); },
// });


About = new orion.collection('about', {
	singularName: 'about',
	pluralName: 'about',
	link: {
		title: 'About Text'
	},
	tabular: {
		columns: [
			{
				data: "text",
				title: "About Text"
			},
			orion.attributeColumn('createdAt', 'time', 'Submitted')
		]
	}
});

About.attachSchema(new SimpleSchema ({
	text: orion.attribute('summernote', { label: "Description" }),
	time: orion.attribute('createdAt')
}));

About.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});


