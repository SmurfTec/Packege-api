const mongoose = require('mongoose');
const validator = require('validator');

const postSchema = new mongoose.Schema(
  {
   title:{
     type:String,
     unique:true,
     trim:true,
     required:[true,'must required a title']
   },
   From:{ 
     type:String,
     trim:true,
     required:[true,'must required a title']
  },
  To:{
      type:String,
     trim:true,
     required:[true,'must required a title']
  },
    Description:{
      type:String,
     trim:true,
     required:[true,'must required a title']
  },
  Category:{},
  Weight:{},
  Dimensions:{},
  Breadth:{},
  Height:{},
  Urgent:{
    type: String,
    enum: ['low', 'medium', 'high'],
    required: [true, `Please Provide Role`],
  },
  deliveryDate:{
    type:Date,
    required: [true, `Please Provide Role`],
  },
  paymentType:{
    type: String,
    enum: ['free', 'paid',],
    required: [true, `Please Provide Role`],
  },
  amount:Number,
  negotiate:Boolean


},
  {
    timestamps: true,
  }
);

postSchema.pre(/^find/, function (next) {
  this.sort('-createdAt');
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
