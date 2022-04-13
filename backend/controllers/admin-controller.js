const {validationResult} = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const AdminPost = require("../models/admin-post");
const mongoose = require("mongoose");


const getAdminPost = async (req, res, next) => {
    let posts;

    try {
        posts = await AdminPost.find({});
    }catch (e) {
        const error = new HttpError(
            "Could not fetch posts", 500
        )
        return next(error)
    }

    res.json({posts : posts.map(post => post.toObject({getters: true}))});
}


const createAdminPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        next(new HttpError(`Invalid inputs `, 422))
    }

    const {title, description} = req.body;

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

    if(!user.isAdmin) {
        const error = new HttpError(
            "You have no permissions to create post", 401
        )
        return next(error)
    }



    const newAdminPost = new AdminPost({
        title,
        description,
        image : 'https://www.n-able.com/wp-content/uploads/2021/04/blog-local_admin_rights.jpeg',
    })

    try{
        AdminPost.deleteMany({}, ()=> {});
        await newAdminPost.save();
    }catch (e) {
        const error = new HttpError(
            'Creating post failed',
            500
        );
        return next(error);

    }

    res.status(201).json({post: newAdminPost})
};

const updateAdminPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        next(new HttpError(`Invalid inputs `, 422))
    }

    const {title, description} = req.body;
    const postId = req.params.postId;

    let adminPost;
    try {
        adminPost = await AdminPost.findById(postId);
    }catch (e) {
        const error = new HttpError(
            "Could not fetch posts", 500
        )
        return next(error)
    }

    let user;
    try {
        user = await User.findById(req.userData.userId);
    }catch (e) {
        const error = new HttpError(
            'Finding post failed',
            500
        );
        return next(error);
    }

    if(!adminPost) {
        const error = new HttpError(
            "Could not find posts ", 404
        )
        return next(error)
    }

    if(!user) {
        const error = new HttpError(
            'Could not find user , creator with provided id',
            500
        );
        return next(error);
    }

    if(!user.isAdmin) {
        const error = new HttpError(
            "You have no permissions to create post", 401
        )
        return next(error)
    }


    adminPost.title = title;
    adminPost.description = description;

    try{
        await adminPost.save()
    }catch (e) {
        const error = new HttpError(
            'Updating post failed',
            500
        );
        return next(error);
    }


    res.status(200).json({post: adminPost.toObject({getters : true})})
}

const deleteAdminPost = async (req, res, next) => {
    const postId = req.params.postId;

    let adminPost;
    try {
        adminPost = await AdminPost.findById(postId);
    }catch (e) {
        const error = new HttpError(
            "Could not fetch posts", 500
        )
        return next(error)
    }

    if(!adminPost) {
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

    if(!user.isAdmin) {
        const error = new HttpError(
            "You have no permissions to delete the post", 401
        )
        return next(error)
    }

    try {
        await adminPost.remove();
    }catch (e) {
        console.log(e)
        const error = new HttpError(
            "Could not delete post", 500
        )
        return next(error)
    }

    res.status(200).json({message: 'Post was successful deleted'})
}

exports.getAdminPost = getAdminPost;
exports.createAdminPost = createAdminPost;
exports.updateAdminPost = updateAdminPost;
exports.deleteAdminPost= deleteAdminPost;