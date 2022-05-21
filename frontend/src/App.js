import React, {useCallback, useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import Users from "./users/pages/Users";
import NewPost from "./posts/pages/NewPost";
import UserPosts from "./posts/pages/UserPosts";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UpdatePost from "./posts/pages/UpdatePost";
import Auth from "./users/pages/Auth";
import {AuthContext} from "./shared/context/auth-context";
import {useAuth} from "./shared/hoooks/auth-hook";
import AllPosts from "./posts/pages/AllPosts";
import Profile from "./users/pages/Profile";
import NewAdminPost from "./posts/pages/NewAdminPost";
import UpdateAdminPost from "./posts/pages/UpdateAdminPost";
import UpdateUser from "./users/pages/UpdateUser";
import Review from "./users/pages/Review";
import ReactWeather, { useOpenWeather } from 'react-open-weather';




const App = () => {
    const {token, login, logout, userId, isAdmin} = useAuth()
    const {rate, setRate} = useState([]);
    let routes;

    if (token && !isAdmin) {
        routes = (
            <Switch>
                <Route path="/" exact={true}>
                    <AllPosts/>
                </Route>

                <Route path="/users/:userId">
                    <Profile/>
                </Route>

                <Route path="/:userId/posts">
                    <UserPosts/>
                </Route>

                <Route path="/update/:userId">
                    <UpdateUser/>
                </Route>

                <Route path="/posts/new" exact={true}>
                    <NewPost/>
                </Route>

                <Route path="/posts/:postId" exact={true}>
                    <UpdatePost/>
                </Route>

                <Route path="/review" exact={true}>
                    <Review/>
                </Route>

                <Redirect to='/'/>
            </Switch>
        );
    }else if(token && isAdmin) {
        routes = (
            <Switch>
                <Route path="/" exact={true}>
                    <AllPosts/>
                </Route>

                <Route path="/users" exact={true}>
                    <Users/>
                </Route>

                <Route path="/users/:userId">
                    <Profile/>
                </Route>

                <Route path="/:userId/posts">
                    <UserPosts/>
                </Route>

                <Route path="/posts/new" exact={true}>
                    <NewAdminPost/>
                </Route>

                <Route path="/posts/:postId" exact={true}>
                    <UpdateAdminPost/>
                </Route>

                <Route path="/review" exact={true}>
                    <Review/>
                </Route>

                <Redirect to='/'/>
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact={true}>
                    <AllPosts/>
                </Route>

                <Route path="/:userId/posts">
                    <UserPosts/>
                </Route>

                <Route path="/auth" exact={true}>
                    <Auth/>
                </Route>

                <Route path="/review" exact={true}>
                    <Review/>
                </Route>

                <Redirect to='/auth'/>
            </Switch>
        );
    }


    const { data, isLoading, errorMessage } = useOpenWeather({
        key: '2cfd91ccaa7cba171f67648224f8fd26',
        lat: '48.137154',
        lon: '11.576124',
        lang: 'en',
        unit: 'metric', // values are (metric, standard, imperial)
    });


    useEffect(() => {
        const fetchC= async () => {
            try {
              const response = await fetch('https://openexchangerates.org/api/latest.json?app_id=ec1c9d5fc17047b68458a1cd69427894', {
                  method: 'GET'
              });
              const data = await response.json();

              const dataArray = Object.entries(data.rates);
              setRate(dataArray)
              console.log(rate)
            }catch (e) {

            }

        }
        fetchC();
    }, [setRate])

    return <AuthContext.Provider value={{
        isLoggedIn: !!token,
        token: token,
        userId,
        isAdmin,
        login,
        logout
    }}>
        <Router>
            <MainNavigation/>
            <main>{routes}</main>
            <footer>
                <ReactWeather
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                    data={data}
                    lang="en"
                    locationLabel="Munich"
                    unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
                />
            </footer>



            <div className={"apiNews"} >

            </div>

        </Router>
    </AuthContext.Provider>

};

export default App;
