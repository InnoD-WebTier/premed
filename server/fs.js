/* Initialize CollectionFS Stores */

// Filesystem Adapter
var imageStore = new FS.Store.FileSystem("images-fs", {
  path: process.env.PWD + "/public/img/uploads",
  maxTries: 1
});

// Initialize the Store
Images = new FS.Collection("images", {
  stores: [imageStore],
  filter: {
    'maxSize': 5120000,
    'allow': {
      'contentTypes': ['image/*']
    }                           
  }
});

// Permissions for CollectionFS store
Images.allow({
  'insert' : function() {
    return true;
  },
  'update' : function() {
    return true;
  },
  'remove' : function() {
    return true;
  },
  'download' : function() {
    return true;
  }
});

