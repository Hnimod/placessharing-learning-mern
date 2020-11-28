import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import SideDrawer from './SideDrawer';
import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';

const MainNavigation = (props) => {
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  const openSideDrawerHandler = () => {
    setIsSideDrawerOpen(true);
  };

  const closeSideDrawerHandler = () => {
    setIsSideDrawerOpen(false);
  };

  return (
    <React.Fragment>
      {isSideDrawerOpen && <Backdrop onClick={closeSideDrawerHandler} />}
      <SideDrawer show={isSideDrawerOpen}>
        <nav
          className="main-navigation__drawer-nav"
          onClick={(event) => {
            if (event.target.localName === 'a') closeSideDrawerHandler();
          }}
        >
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openSideDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
