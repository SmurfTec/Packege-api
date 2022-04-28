const Post = require('../models/Post');
const AppError = require('../helpers/appError');

class PostServices {
  //*
  static async GetAll(query) {
    const { isDeliveryRequest } = query;
    let queryData = Post.find();
    if (isDeliveryRequest) queryData.find({ isDeliveryRequest });
    let posts = await queryData;

    const date = new Date();
    console.log('date :>> ', date);
    posts = posts.filter((post) => {
      // const d = new Date(post.deliveryDate);
      // return d >= date;
      return post.deliveryDate >= date;
    });

    return { posts };
  }

  //*
  static async GetMyPosts(userId, query) {
    const { isDeliveryRequest } = query;
    let queryData = Post.find({ user: userId }).populate({
      path: 'user',
      select: 'firstName lastName fullName',
    });

    if (isDeliveryRequest)
      queryData.find({ 'user._id': userId, isDeliveryRequest });

    const posts = await queryData;
    return { posts };
  }

  //*
  static async GetSingle(Id, next) {
    const post = await Post.findById(Id).populate({
      path: 'user',
      select: 'firstName lastName fullName',
    });
    if (!post) return next(new AppError(`No Post found against id ${Id}`, 404));
    return { post };
  }

  //*
  static async Create(body, userId) {
    const post = await Post.create({ ...body, user: userId });
    return { post };
  }

  //*
  static async Update(Id, userId, body, next) {
    const post = await Post.findOneAndUpdate(
      { _id: Id, user: userId },
      {
        ...body,
      },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!post) return next(new AppError(`No Post found against id ${Id}`, 404));

    return { post };
  }

  //*
  static async Delete(Id, userId, next) {
    const post = await Post.findOneAndDelete({
      _id: Id,
      user: userId,
    });
    if (!post) return next(new AppError(`No Post found against id ${Id}`, 404));
    return { post };
  }
}

module.exports = PostServices;
