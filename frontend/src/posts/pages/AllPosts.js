import React, {useEffect, useState} from "react";
import PostList from "../components/PostList";
import {useHttpClient} from "../../shared/hoooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";


const AllPosts = props => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPosts, setLoadedPosts] = useState();

    useEffect(() => {
        const fetchPosts= async () => {
            try {
                const data = await sendRequest(`http://localhost:5000/api/posts`);
                setLoadedPosts(data.posts)
            }catch (e) {

            }

        }
        fetchPosts();
    }, [sendRequest])

    const deleteHandler = (deletedId) => {

    }



    return <React.Fragment>
        {isLoading && <div className="center">
            <LoadingSpinner/>
        </div>}
        {!isLoading && !loadedPosts &&
            <h2>No posts available</h2>
        }
        {!isLoading && loadedPosts &&
        <PostList items={loadedPosts} onDelete={deleteHandler}/>}
    </React.Fragment>



}

export default AllPosts;