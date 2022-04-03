const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const Post = require('../models/Post');
const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

exports.getMyChats = catchAsync(async (req, res, next) => {
  let chats = await Chat.find({ participants: { $in: [req.user._id] } });

  await Chat.populate(chats, {
    path: 'participants',
    select: 'fullName image',
  });
  await Chat.populate(chats, {
    path: 'messages',
    model: Message,
  });

  res.status(200).json({
    status: 'success',
    length: chats.length,
    chats,
  });
});

exports.getAllChats = catchAsync(async (req, res, next) => {
  const chats = await Chat.find();

  res.status(200).json({
    status: 'success',
    chats,
  });
});

exports.addNewChat = catchAsync(async (req, res, next) => {
  const { text, post } = req.body;
  const sender = req.user._id;

  //  Check post
  const postt = await Post.findById(post);
  if (!postt) return next(new AppError(`Can't find Post with id ${receiver}`));

  const receiver = postt.user;
  //  Check if receiver is a user
  const receiverr = await User.findById(receiver);
  if (!receiverr)
    return next(new AppError(`Can't find user with id ${receiver}`));

  // check chat is already created
  let chat = await Chat.findOne({
    $and: [
      {
        participants: { $in: [sender] },
      },
      {
        participants: { $in: [receiver] },
      },
    ],
  });
  //create first msg
  const newMessage = await Message.create({
    text,
    sender,
    post,
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [sender, receiver],
    });
  }

  // push new Message to existing chat
  chat.messages = [...chat.messages, newMessage._id];

  await chat.save();

  await Chat.populate(chat, {
    path: 'participants',
    select: 'fullName image',
  });
  await Chat.populate(chat, {
    path: 'messages',
    model: Message,
  });

  return res.status(200).json({
    status: 'success',
    chat,
  });
});

exports.addNewMessage = catchAsync(async (req, res, next) => {
  const { text, chatId } = req.body;

  // console.log('text :>> ', text);
  // console.log('chatId :>> ', chatId);

  // * find Chat
  let chat = await Chat.findById(chatId);
  if (!chat) return next(new AppError(`Can't find chat for id ${chatId}`, 404));

  //* create new Message
  const newMessage = await Message.create({
    text,
    sender: req.user._id,
  });

  //* push new Message to existing chat
  chat.messages = [...chat.messages, newMessage._id];
  await chat.save();

  await Chat.populate(chat, {
    path: 'participants',
    select: 'firstName email',
  });
  await Chat.populate(chat, {
    path: 'messages',
  });
  await Message.populate(newMessage, {
    path: 'sender',
  });

  res.status(201).json({
    status: 'success',
    chat,
  });
});

exports.getChat = catchAsync(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat)
    return next(new AppError(`Can't find chat for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    chat,
  });
});

exports.deleteChat = catchAsync(async (req, res, next) => {
  //* only reciever can delete chat
  const chat = await Chat.findByIdAndDelete(req.params.id);

  if (!chat)
    return next(new AppError(`Can't find chat for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    chat,
  });
});

exports.updateChat = catchAsync(async (req, res, next) => {
  const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!chat)
    return next(new AppError(`Can't find chat for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    chat,
  });
});
