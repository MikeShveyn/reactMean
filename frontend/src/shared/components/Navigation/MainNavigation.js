import React, {useState} from "react";
import MainHeader from "./MainHeader";
import {Link} from "react-router-dom";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop/Backdrop";

import './MainNavigation.css';


const MainNavigation = props => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const openDrawer = () => {
        setDrawerIsOpen(true);
    }

    const closeDrawer = () => {
        setDrawerIsOpen(false);
    }


    return (
        <React.Fragment>
            {drawerIsOpen && <Backdrop onClick={closeDrawer}/>}
       <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
                <nav className='main-navigation-drawer-nav'>
                    <NavLinks/>
                </nav>
            </SideDrawer>
            <MainHeader>
                <button className="main-navigation-menu-btn"
                        onClick={openDrawer}>
                    <span/>
                    <span/>
                    <span/>
                </button>
                <h1 className="main-navigation-title">
                    <Link to="/">Posts</Link>
                </h1>
                <nav className="main-navigation-header-nav">
                    <NavLinks/>
                </nav>
            </MainHeader>
        </React.Fragment>

        )


}

export default MainNavigation;