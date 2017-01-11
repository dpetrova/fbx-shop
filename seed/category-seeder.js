//this file is called manually with: node seed/category-seeder.js

let Category = require('../models/category')
let mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect('localhost:27017/fbxShop')

let categories = [
  new Category({
    title: 'Games',
    description: `Game fbx models - mesh modeling, texturing, rigging and animations.`
  }),
  new Category({
    title: 'Movies',
    description: `Movie fbx models - mesh modeling, texturing, rigging and animations.`
  })
]

let done = 0;
for (var index in categories) {
  categories[index].save(function(err, result){
    done++;
    if(done === categories.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
}
