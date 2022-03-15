const { v4: uuidv4 } = require('uuid'); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const {validationResult} = require('express-validator')
const getCoordinates = require('../utils/location')
const HttpError = require("../models/http-error");
const Place = require('../models/place')
const {use} = require("express/lib/router");


const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;
    let place;

    try {
        place = await Place.findById(placeId);
    }catch (e) {
        const error = new HttpError(
            "Could not fetch places", 500
        )
        return next(error)
    }

    if (!place) {
        return next(
            new HttpError("Couldn't  find place for the provided place id", 404)
        )
    }

    res.json({place : place.toObject({getters: true})});
}


const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try{
        places = await Place.find({creator: userId})
    }catch (e) {
        const error = new HttpError(
            "Could not fetch places ", 500
        )
        return next(error)
    }


    if(!places || places.length === 0) {
        return next(
            new HttpError("Couldn't  find place for the provided user id", 404)
        )
    }

    res.json({places : places.map(place => place.toObject({getters: true}))});
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        next(new HttpError(`Invalid inputs `, 422))
    }

    const {title, description, address, creator} = req.body;

    let location
    try{
      location  = await getCoordinates(address);
    }catch (e) {
        return next(e)
    }

    const newPlace = new Place({
        title,
        description,
        address,
        location,
        image : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/City_Lights_%2833522578970%29.jpg/1024px-City_Lights_%2833522578970%29.jpg?1646766503738',
        creator
    })

    try{
        await newPlace.save();
    }catch (e) {
        const error = new HttpError(
            'Creating place failed',
            500
        );
        return next(error);

    }


    res.status(201).json({place: newPlace})
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        next(new HttpError(`Invalid inputs `, 422))
    }

    const {title, description} = req.body;
    const placeId = req.params.placeId;

    let place;
    try {
        place = await Place.findById(placeId);
    }catch (e) {
        const error = new HttpError(
            "Could not fetch places", 500
        )
        return next(error)
    }
    

    place.title = title;
    place.description = description;
    
    try{
        await place.save()
    }catch (e) {
        const error = new HttpError(
            'Updating place failed',
            500
        );
        return next(error);
    }

    
    res.status(200).json({place: place.toObject({getters : true})})
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;

    let place;
    try {
        place = await Place.findById(placeId);
    }catch (e) {
        const error = new HttpError(
            "Could not fetch places", 500
        )
        return next(error)
    }

    try {
        await place.remove();
    }catch (e) {
        const error = new HttpError(
            "Could not delete places", 500
        )
        return next(error)
    }

    res.status(200).json({message: 'Place was successful deleted'})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
