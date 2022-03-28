import React, {useEffect, useState} from "react";
import PostList from "../components/PostList";
import {useHistory, useParams} from "react-router-dom";
import {useHttpClient} from "../../shared/hoooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/Error/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";


const UserPosts = props => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPosts, setLoadedPosts] = useState();
    const userId = useParams().userId;
    const history = useHistory();

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const data = await sendRequest(`http://localhost:5000/api/posts/user/${userId}`);
                setLoadedPosts(data.posts)
            }catch (e) {
                history.push('/');
            }

        }
        fetchPlaces();
    }, [sendRequest, userId])

    const deleteHandler = (deletedId) => {
        setLoadedPosts(prevP => prevP.filter(post => post.id !== deletedId))
    }

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading && <div className="center">
            <LoadingSpinner/>
        </div>}
        {!isLoading && loadedPosts &&
        <PostList items={loadedPosts} onDelete={deleteHandler}/>}
    </React.Fragment>



}

export default UserPosts;