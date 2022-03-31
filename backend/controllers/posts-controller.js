const { v4: uuidv4 } = require('uuid'); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const {validationResult} = require('express-validator')
const getCoordinates = require('../utils/location')
const HttpError = require("../models/http-error");
const Post = require('../models/post')
const {use} = require("express/lib/router");
const User = require('../models/user');
const mongoose = require("mongoose");


const getAllPosts = async (req, res, next) => {
    let posts;

    try {
        posts = await Post.find({});
    }catch (e) {
        const error = new HttpError(
            "Could not fetch posts", 500
        )
        return next(error)
    }

    res.json({posts : posts.map(post => post.toObject({getters: true}))});
}

const getPostById = async (req, res, next) => {
    const postId = req.params.postId;
    let post;

    try {
        post = await Post.findById(postId);
    }catch (e) {
        const error = new HttpError(
            "Could not fetch posts", 500
        )
        return next(error)
    }

    if (!post) {
        return next(
            new HttpError("Couldn't  find post for the provided post id", 404)
        )
    }

    res.json({post : post.toObject({getters: true})});
}


const getPostByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithPost;
    try{
        userWithPost = await User.findById(userId).populate('posts')
    }catch (e) {
        const error = new HttpError(
            "Could not fetch posts ", 500
        )
        return next(error)
    }


    if(!userWithPost || userWithPost.posts.length === 0) {
        return next(
            new HttpError("Couldn't  find post for the provided user id", 404)
        )
    }

    res.json({posts : userWithPost.posts.map(post => post.toObject({getters: true}))});
}

const createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        next(new HttpError(`Invalid inputs `, 422))
    }

    const {title, description, address, category} = req.body;

    let location
    try{
      location  = await getCoordinates(address);
    }catch (e) {
        return next(e)
    }


    let user;
    try {
        user = await User.findById(req.userData.userId);
    }catch (e) {
        const error = new HttpError(
            'Creating post failed',
            500
        );
        return next(error);
    }

    if(!user) {
        const error = new HttpError(
            'Could not find user , creator with provided id',
            500
        );
        return next(error);
    }

    const newPost = new Post({
        title,
        description,
        address,
        category,
        location,
        image : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/City_Lights_%2833522578970%29.jpg/1024px-City_Lights_%2833522578970%29.jpg?1646766503738',
        creator : {id: req.userData.userId, name: user.name, image: user.image}

    })

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newPost.save({session : sess});
        user.posts.push(newPost);
        await user.save({session: sess,  validateModifiedOnly: true})
        await sess.commitTransaction();
    }catch (e) {
        const error = new HttpError(
            'Creating post failed',
            500
        );
        return next(error);

    }


    res.status(201).json({post: newPost})
};

const updatePost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        next(new HttpError(`Invalid inputs `, 422))
    }

    const {title, description} = req.body;
    const postId = req.params.postId;

    let post;
    try {
        post = await Post.findById(postId);
    }catch (e) {
        const error = new HttpError(
            "Could not fetch posts", 500
        )
        return next(error)
    }

    if(post.creator.id.toString() !== req.userData.userId) {
        const error = new HttpError(
            "You have no permissions to update the post", 401
        )
        return next(error)
    }

    post.title = title;
    post.description = description;
    
    try{
        await post.save()
    }catch (e) {
        const error = new HttpError(
            'Updating post failed',
            500
        );
        return next(error);
    }

    
    res.status(200).json({post: post.toObject({getters : true})})
}

const deletePost = async (req, res, next) => {
    const postId = req.params.postId;

    let post;
    try {
        post = await Post.findById(postId).populate({path: "creator",
                                                populate: {path: "id"}});
    }catch (e) {
        const error = new HttpError(
            "Could not fetch posts", 500
        )
        return next(error)
    }

    if(!post) {
        const error = new HttpError(
            "Could not find posts ", 404
        )
        return next(error)
    }


    let user;
    try {
        user = await User.findById(req.userData.userId);
    }catch (e) {
        const error = new HttpError(
            'Creating post failed',
            500
        );
        return next(error);
    }

    if(!user) {
        const error = new HttpError(
            'Could not find user , creator with provided id',
            500
        );
        return next(error);
    }

    if(!user.isAdmin && post.creator.id.id.toString() !== req.userData.userId) {
        const error = new HttpError(
            "You have no permissions to delete the post", 401
        )
        return next(error)
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await post.remove({session: sess});
        post.creator.id.posts.pull(post);
        await post.creator.id.save({session: sess,  validateModifiedOnly: true})
        await sess.commitTransaction();
    }catch (e) {
       console.log(e)
        const error = new HttpError(
            "Could not delete post", 500
        )
        return next(error)
    }

    res.status(200).json({message: 'Post was successful deleted'})
}

exports.getAllPosts = getAllPosts;
exports.getPostById = getPostById;
exports.getPostByUserId = getPostByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost= deletePost;
