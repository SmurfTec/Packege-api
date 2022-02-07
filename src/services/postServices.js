const Post = require('../models/Post');
const AppError = require('../helpers/appError');

class PostServices {
  //*

  static async GetAll() {
    const posts = await Post.find();
    return { posts };
  }

  //*
  static async GetMyPosts(userId) {
    const posts = await Post.find({ user: userId });
    return { posts };
  }

  //*
  static async GetSingle(Id, next) {
    const post = await Post.findById(Id);
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
