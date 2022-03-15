import React, {useCallback, useState} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./users/pages/Auth";
import {AuthContext} from "./shared/context/auth-context";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  },[])

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  },[])


  let routes;

  if(isLoggedIn) {
    routes  = (
        <Switch>>
          <Route path="/" exact={true}>
            <Users/>
          </Route>

          <Route path="/:userId/places">
            <UserPlaces/>
          </Route>

          <Route path="/places/new" exact={true}>
            <NewPlace/>
          </Route>

          <Route path="/places/:placeId" exact={true}>
            <UpdatePlace/>
          </Route>

          <Redirect to='/'/>
        </Switch>
    );
  }else{
    routes = (
        <Switch>>
          <Route path="/" exact={true}>
            <Users/>
          </Route>

          <Route path="/:userId/places">
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
    isLoggedIn,
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
