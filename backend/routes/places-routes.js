const express = require('express');
const {check} = require('express-validator')

const placesControllers = require('../controllers/places-controller');
const router = express.Router();



// Order matters !!!

router.get('/user/:uid', placesControllers.getPlacesByUserId)

router.get('/:placeId', placesControllers.getPlaceById)


router.post('/',
    [
      check('title')
          .not()
          .isEmpty(),
        check('description')
            .isLength({min: 5}),
        check('address')
            .not()
            .isEmpty()

    ],
    placesControllers.createPlace)

router.patch('/:placeId',
    check('title')
        .not()
        .isEmpty(),
    check('description')
        .isLength({min: 5}),
    placesControllers.updatePlace)


router.delete('/:placeId', placesControllers.deletePlace)

module.exports = router;