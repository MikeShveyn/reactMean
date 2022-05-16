import React, {useEffect, useState} from "react";
import PostList from "../components/PostList";
import {useHttpClient} from "../../shared/hoooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import AdminPostItem from "../components/AdminPostItem";
import Select from "../../shared/components/FormElements/Select/Select";




const AllPosts = props => {
    const [filter, setFilter] = useState("none");
    const [titleSearch, setTitleSearch] = useState("");
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPosts, setLoadedPosts] = useState([]);
    const [loadedAdminPost, setLoadedAdminPost] = useState();


    const inputChangeHandler = (event) => {
        setTitleSearch(event.target.value);
    }

    const FilterType = [
        { id: 1, label: "Select Category", value: "none" },
        { id: 2, label: "Sport", value: "sport" },
        { id: 3, label: "Politics", value: "politics" },
        { id: 4, label: "Economics", value: "economics" },
        { id: 5, label: "Culture", value: "culture" },
    ];


    const handleFilter = (value) => {
        setFilter(value);
    };


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

        <div className="filters">
            <Select items={FilterType} onChange={handleFilter} />
            <input
                id="title"
                type='text'
                onInput={inputChangeHandler}/>
        </div>


        {!isLoading && !loadedPosts &&
            <h2>No users posts available</h2>
        }
        {!isLoading && loadedPosts &&
             <PostList items={loadedPosts.filter((p)=>{
                 if(filter !== 'none' && titleSearch) {
                     return p.category === filter && p.title.includes(titleSearch);
                 }else if(filter !== 'none' && !titleSearch) {
                     return p.category === filter;
                 }else if(filter === 'none' && titleSearch) {
                     return p.title.includes(titleSearch);
                 }
                 else{
                     return p;
                 }
             })}/>
        }
    </React.Fragment>



}

export default AllPosts;