const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

exports.getMyChats = catchAsync(async (req, res, next) => {
  let chats = await Chat.find({ participants: { $in: [req.user._id] } });

  await Chat.populate(chats, {
    path: 'participants',
    select: 'firstName lastName image',
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
  console.log('req.body :>> ', req.body);

  let alreadyChat = await Chat.findOne({
    $and: [
      {
        participants: { $in: [req.user._id] },
      },
      {
        participants: { $in: [req.body.receiver] },
      },
    ],
  });

  if (alreadyChat)
    return next(new AppError(`Chat Already exists between users`, 400));

  // * Check if receiver is a user
  const receiver = await User.findById(req.body.receiver);
  if (!receiver)
    return next(new AppError(`Can't find user with id ${req.body.receiver}`));

  const chat = await Chat.create({
    participants: [req.user._id, req.body.receiver],
  });

  await Chat.populate(chat, {
    path: 'participants',
    select: 'firstName lastName image',
  });
  await Chat.populate(chat, {
    path: 'messages',
    model: Message,
  });

  res.status(201).json({
    status: 'success',
    chat,
  });
});

exports.addNewMessage = catchAsync(async (req, res, next) => {
  const { text, chatId } = req.body;
  // console.log('req.body :>> ', req.body);
  //* find Chat
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

  // * Receiver will the 2nd participant of chat
  chat.participants[0]._id.toString() === req.user._id.toString()
    ? chat.participants[1]
    : chat.participants[0];
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
