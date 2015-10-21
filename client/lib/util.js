/* Collection of common utility functions for views
 */

// Displays result of content insert
insertMsg = function(err, success) {
  if (success) {
    alert("You've added content ;)!");
  } else {
    alert("Failed to add content :(");
  }
};
