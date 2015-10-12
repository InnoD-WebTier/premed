/* Initialize CollectionFS Stores */

var imageStore = new FS.Store.FileSystem("images-fs", {
  // TODO: awkward pathing, needs to be changed
  path: "../../../../../public/img",
  maxTries: 1
});

// TODO: Better Settings, filters
Images = new FS.Collection("images", {
  stores: [imageStore],
  filter: {
    'maxSize': 5120000,
    'allow': {
      'contentTypes': ['image/*']
    }                           
  }
});

// TODO: Implement better permissions
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

