//this file is called manually with: node seed/fbx-seeder.js

let Fbx = require('../models/fbx')
let Category = require('../models/category')
let mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect('localhost:27017/fbxShop')

let fbxs = [
  new Fbx({
    imagePath: 'images/troll.jpg',
    title: 'Troll',
    description: `Troll is a character, developed for 3D-animation course purposes. \
                 The model is texured, rigged and animated.`,
    faces: 5692,
    price: 12,
    rating: 5,
    category: '586eb341ddeaa4257820384a'
  }),
  new Fbx({
    imagePath: 'images/vlad.jpg',
    title: 'Vlad',
    description: `Vlad is a main character from "The Golden Apple" RPG game, developed for 3D-animation course purposes. \
                 The model is texured and rigged.`,
    faces: 6104,
    price: 7,
    rating: 5,
    category: '586eb341ddeaa4257820384a'
  }),
  new Fbx({
    imagePath: 'images/vlad-kuker.jpg',
    title: 'Vlad Kuker',
    description: `Vlad with kuker costume is a main character with special abilities from "The Golden Apple" RPG game, developed for 3D-animation course purposes. \
                  The model is texured and rigged.`,
    faces: 5692,
    price: 7,
    rating: 5,
    category: '586eb341ddeaa4257820384a'
  }),
  new Fbx({
    imagePath: 'images/stone_bridge-type1.jpg',
    title: 'Stone bridge type 1',
    description: `Stone bridge is an environment prop from "The Golden Apple" RPG game, developed for 3D-animation course purposes. \
                 The model is texured.`,
    faces: 989,
    price: 3,
    rating: 3,
    category: '586eb341ddeaa4257820384a'
  }),
  new Fbx({
    imagePath: 'images/stone_bridge-type2.jpg',
    title: 'Stone bridge type 2',
    description: `Stone bridge is an environment prop from "The Golden Apple" RPG game, developed for 3D-animation course purposes. \
                 The model is texured.`,
    faces: 989,
    price: 3,
    rating: 3,
    category: '586eb341ddeaa4257820384a'
  }),
  new Fbx({
    imagePath: 'images/barrel.jpg',
    title: 'Barrel',
    description: `Barrel is a prop from "The Golden Apple" RPG game, developed for 3D-animation course purposes. \
                 The model is texured.`,
    faces: 83,
    price: 1,
    rating: 4,
    category: '586eb341ddeaa4257820384a'
  }),
  new Fbx({
    imagePath: 'images/clown.jpg',
    title: 'Clown',
    description: `Clown is a character, developed for 3D-animation course purposes. \
                 The model is texured, rigged and animated.`,
    faces: 31392,
    price: 12,
    rating: 5,
    category: '586eb341ddeaa4257820384b'
  }),
  new Fbx({
    imagePath: 'images/fender2.jpg',
    title: 'Fender',
    description: `Fender is a character, developed for 3D-animation course purposes. \
                 The model is texured, rigged and animated.`,
    faces: 12529,
    price: 10,
    rating: 4,
    category: '586eb341ddeaa4257820384b'
  }),
  new Fbx({
    imagePath: 'images/bin.jpg',
    title: 'Recycle bin',
    description: `Recycle bin is a character, developed for 3D-animation course purposes. \
                 The model is texured, rigged and animated.`,
    faces: 7898,
    price: 4,
    category: '586eb341ddeaa4257820384b'
  })
]

let done = 0;
for (var index in fbxs) {
  fbxs[index].save(function(err, fbx){
    Category.findOne({_id: fbx.category}, function(err, category){
      category.items.push(fbx)
      category.save(function(err, fbx){
        done++;
        if(done === fbxs.length){
          exit();
        }
      })
    })
  })
}

function exit(){
  mongoose.disconnect();
}