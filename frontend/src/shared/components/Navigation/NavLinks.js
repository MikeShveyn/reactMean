import React, {useContext} from "react";
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/auth-context";

import './NavLinks.css'

const NavLinks = props => {
    const auth = useContext(AuthContext);


    return <ul className="nav-links">
        <li>
            <NavLink to="/review" exact>CONTACT US</NavLink>
        </li>
        <li>
            <NavLink to="/" exact>ALL POSTS</NavLink>
        </li>
        {auth.isLoggedIn && auth.isAdmin &&
        <li>
            <NavLink to="/users" exact>ALL USERS</NavLink>
        </li>
        }
        {auth.isLoggedIn &&
        <li>
            <NavLink to={`/users/${auth.userId}`}>MY PROFILE</NavLink>
        </li>
        }
        {auth.isLoggedIn &&
        <li>
            <NavLink to={`/${auth.userId}/posts`}>MY POSTS</NavLink>
        </li>
        }
        {auth.isLoggedIn && !auth.isAdmin &&
        <li>
            <NavLink to="/posts/new">ADD POST</NavLink>
        </li>
        }
        {auth.isLoggedIn && auth.isAdmin &&
        <li>
            <NavLink to="/posts/new">ADMIN POST</NavLink>
        </li>
        }
        {auth.isLoggedIn &&
        <li>
            <button onClick={auth.logout}>LOGOUT</button>
        </li>
        }
        {!auth.isLoggedIn &&
        <li>
            <NavLink to="/auth">LOGIN</NavLink>
        </li>
        }
    </ul>
}

export default NavLinks;