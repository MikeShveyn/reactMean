import React, {useCallback, useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./users/pages/Auth";
import {AuthContext} from "./shared/context/auth-context";
import {useAuth} from "./shared/hoooks/auth-hook";


const App = () => {
    const {token, login, logout, userId} = useAuth()

    let routes;

    if (token) {
        routes = (
            <Switch>>
                <Route path="/" exact={true}>
                    <Users/>
                </Route>

                <Route path="/:userId/posts">
                    <UserPlaces/>
                </Route>

                <Route path="/posts/new" exact={true}>
                    <NewPlace/>
                </Route>

                <Route path="/posts/:postId" exact={true}>
                    <UpdatePlace/>
                </Route>

                <Redirect to='/'/>
            </Switch>
        );
    } else {
        routes = (
            <Switch>>
                <Route path="/" exact={true}>
                    <Users/>
                </Route>

                <Route path="/:userId/posts">
                    <UserPlaces/>
                </Route>

                <Route path="/auth" exact={true}>
                    <Auth/>
                </Route>

                <Redirect to='/auth'/>
            </Switch>
        );
    }


    return <AuthContext.Provider value={{
        isLoggedIn: !!token,
        token: token,
        userId,
        login,
        logout
    }}>
        <Router>
            <MainNavigation/>
            <main>{routes}</main>
        </Router>
    </AuthContext.Provider>

};

export default App;
