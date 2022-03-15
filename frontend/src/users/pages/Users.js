import React from "react";
import UsersList from "../components/UsersList";

const usersData = [
    {
        id : 'u1',
        name : 'Mike',
        image :  'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        places: 3
    },
    {
        id : 'u2',
        name : 'Mike',
        image :  'https://images.pexels.com/photos/177809/pexels-photo-177809.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        places: 3
    },
    {
        id : 'u3',
        name : 'Mike',
        image :  'https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        places: 3
    },
]

const Users = () => {

    return <UsersList items={usersData}/>
};

export default Users;
