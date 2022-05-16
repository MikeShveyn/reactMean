import React, {useEffect, useState, useContext} from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/Error/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import {useHttpClient} from "../../shared/hoooks/http-hook";
import {AuthContext} from "../../shared/context/auth-context";


const Users = () => {
    const auth = useContext(AuthContext);
    const [titleSearch, setTitleSearch] = useState("");
    const [loadedUsers, setLoadedUsers] = useState([]);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();


    useEffect(()=> {
        const fetchUsers = async () => {
            try {
                const data = await  sendRequest(`http://localhost:5000/api/users`,
                'GET',
                null,
                {Authorization: 'Bearer ' + auth.token});
                setLoadedUsers(data.users.filter(u => u.id !== auth.userId)); //todo haim
            }catch (e) {
            }
        }
       fetchUsers();
    },[sendRequest])


    const inputChangeHandler = (event) => {
        setTitleSearch(event.target.value);
    }


    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading && <div className="center">
            <LoadingSpinner/>
        </div>}

        <div className="filters">
            <input
                id="title"
                type='text'
                onInput={inputChangeHandler}/>
        </div>

        {!isLoading && loadedUsers && <UsersList items={loadedUsers.filter((u => {
            if(titleSearch) {
                return u.name.includes(titleSearch);
            }else{
                return u;
            }
        }))}/>}
    </React.Fragment>

};

export default Users;
