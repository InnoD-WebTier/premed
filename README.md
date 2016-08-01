#### Introduction
Repository for the Premed at Berkeley. Built by Innovative Design Web Development Tier during Fall 2015, Spring 2016. You can find their website at <http://innovativedesign.club>

#### Application
The current application is build on MeteorJS, using MongoDB on the backend. The `.meteor` folder contains information on the current Meteor distribution and the list of packages being used, along with their specific versions. OrionJS is used as a CMS and all routing is done through the iron:router package. The application is divided between the client and the server. The server handles collections, which is how Meteor creates new database tables, while the client handles the app logic. All the views for pages and their associated Javascript can be found in `./client/views`. Stylesheets can be found in the stylesheets directory inside the client directory, while lib contains app routing.

Public contains resources that are okay for users to access. In our case, we store images used in the application here.

#### Adding Routes
The routes.js file can be found in `./client/lib/routes.js`. The application uses the iron:router package. The general structure of a routing call is outlined in the file, and should be fairly straightforward. 

#### Hosting
Currently, the site is hosting through Heroku. Since Heroku does not support Meteor applications yet, we use the buildpack <https://github.com/jordansissel/heroku-buildpack-meteor.git>. For more information on how to deploy to Heroku, we recommend reading <http://justmeteor.com/blog/deploy-to-production-on-heroku/>.

#### Debugging help
If the application is failing, you can always try running heroku restart -a appname. The name of your app is what shows up in the Heroku dashboard, if you log in. Problems may also be caused by packages being out of date. You can update to the latest version of Meteor, but you may need to find a new buildpack to use in the case that the current one does not support all the required dependencies of the latest version of Meteor. 
