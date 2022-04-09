import React, {useEffect, useState} from "react";
import PostList from "../components/PostList";
import {useHttpClient} from "../../shared/hoooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import AdminPostItem from "../components/AdminPostItem";


const AllPosts = props => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPosts, setLoadedPosts] = useState();
    const [loadedAdminPost, setLoadedAdminPost] = useState();


    useEffect(() => {
        const fetchAdminPost = async () => {
            try {
                const data = await sendRequest(`http://localhost:5000/api/admin/post`);
                setLoadedAdminPost(data.posts[0])
            }catch (e) {

            }

        }
        fetchAdminPost();
    }, [sendRequest])

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


    return <React.Fragment>
        {isLoading && <div className="center">
            <LoadingSpinner/>
        </div>}

        {!isLoading && loadedAdminPost &&
        <AdminPostItem
            id={loadedAdminPost?.id}
            title={loadedAdminPost?.title}
            description={loadedAdminPost?.description}
            image={loadedAdminPost?.image}/>
        }

        {!isLoading && !loadedPosts &&
            <h2>No users posts available</h2>
        }
        {!isLoading && loadedPosts &&
             <PostList items={loadedPosts}/>
        }
    </React.Fragment>



}

export default AllPosts;