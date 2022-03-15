const axios = require('axios')
const HttpError = require("../models/http-error");

const apiKey = '62561cc7b07ed1b5fb99f0295fd48252';

async function getCoordsForAddress(address) {
    // Forward Geocoding API Endpoint
    const params = {
        access_key: apiKey,
        query: encodeURIComponent(address),
        limit: 1
    }
    let response;
    try {
      response = await axios.get('http://api.positionstack.com/v1/forward', {params})
    }catch (e) {
        throw e;
    }



    if(response.data.data.length > 0) {
        const data = response.data.data[0];
        return {
            lat: data.latitude,
            lng: data.longitude
        };

    }else{
        throw new HttpError('Could find coordinates', 422);
    }
}

module.exports = getCoordsForAddress;