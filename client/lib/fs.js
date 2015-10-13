var imageStore = new FS.Store.FileSystem("images-fs");

Images = new FS.Collection("images", {
  stores: [imageStore],
  filter: {
    'maxSize': 5120000,
    'allow': {
      'contentTypes': ['image/*']
    },
    'onInvalid': function(msg) {
      alert(msg);
    }
  }
});

