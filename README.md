
https://github.com/AdmitHub/meteor-buildpack-horse

#### Introduction
Repository for the Premed at Berkeley. Built by Innovative Design Web Development Tier during Fall 2015, Spring 2016. You can find their website at <http://innovativedesign.club>

#### Application
The current website is built on Meteor, a somewhat new full stack JavaScript framework, which uses MongoDB on the backend. Let's do a quick overview. The `.meteor` folder contains information on the current version of Meteor that's being used (1.4 at the time of writing this) and the list of packages being used. Any packages with the prefix orionjs are used in managing the admin panel of the site, which can be reached by going to the `/admin` route. All files handling the CSS and HTML for the site can be found in the `client` folder, underneath `client/stylesheets` and `client/views` respectively. The `client/lib` folder handles router, which is done through the iron:router package. Public contains resources that are okay for users to access. In our case, we store images used in the application here.

#### Adding Routes
The routes.js file can be found in `./client/lib/routes.js`. The application uses the iron:router package. The general structure of a routing call is outlined in the file, and should be fairly straightforward.

#### Adding Packages
The developer community publishes packages to a site called Atmosphere.js (you see how they like to be funny with the names of their things yet?). You can simply go browse for a package then follow the instructions on the page to add it to your project. Usually, this is as simple as copy and pasting the package name into the package file in `.meteor`. Make sure you have all the dependencies for the project there as well.

#### Hosting
Currently, the site is hosting through Heroku. Since Heroku does not support Meteor applications yet, we use the buildpack <https://github.com/jordansissel/heroku-buildpack-meteor.git>. For more information on how to deploy to Heroku, we recommend reading <http://justmeteor.com/blog/deploy-to-production-on-heroku/>.

#### Debugging help
If the application is failing, you can always try running heroku restart -a appname. The name of your app is what shows up in the Heroku dashboard, if you log in. Problems may also be caused by packages being out of date. You can update to the latest version of Meteor, but you may need to find a new buildpack to use in the case that the current one does not support all the required dependencies of the latest version of Meteor.
