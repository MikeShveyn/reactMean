import React from "react";
import PlaceList from "../components/PlaceList";
import {useParams} from "react-router-dom";


export const dummyPlaces = [
    {
        id : 'p1',
        title : 'Wellington',
        description : 'Wellington is at the south-western tip of the North Island on Cook Strait, separating the North and South Islands.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/City_Lights_%2833522578970%29.jpg/1024px-City_Lights_%2833522578970%29.jpg?1646766503738',
        address: 'New Zealand',
        location: {
            lat:-41.2521043,
            lng: 174.4740796
        },
        creator: 'u1'
    },
    {
        id : 'p2',
        title : 'Wellington',
        description : 'Wellington is at the south-western tip of the North Island on Cook Strait, separating the North and South Islands.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Cable_Car%2C_Wellington%2C_New_Zealand.JPG',
        address: 'New Zealand',
        location: {
            lat:-41.2521043,
            lng: 174.4740796
        },
        creator: 'u2'
    }
]


const UserPlaces = props => {
    const userId = useParams().userId;
    const filteredPlaced = dummyPlaces.filter(place => {
        return place.creator === userId;
    });
    return <PlaceList items={filteredPlaced}/>

}

export default UserPlaces;