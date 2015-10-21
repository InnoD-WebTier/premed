
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

/*
CollectionFS appends random key to filename
when storing, get this image name string
*/
genImageName = function(image, fileObj) {
  var newName = "/img/uploads/" + fileObj.collectionName 
                + "-" + fileObj._id + "-" + image;
  return newName;
};


