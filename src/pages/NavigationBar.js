import {React, useState} from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router, Route, Link, withRouter, Redirect } from "react-router-dom";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBIcon,
} from 'mdb-react-ui-kit';
import '../css/index.css'
// import AnchorLink from 'react-anchor-link-smooth-scroll'
// **** ROUTES *****//
// Add routes here


export default function NavigationBar(){

    const [showNav, setShowNav] = useState(false);

    return (
        <MDBNavbar expand='lg' light bgColor='light'>
          <MDBContainer fluid>
            <MDBNavbarBrand href='#'>Robert Norwood</MDBNavbarBrand>
            <MDBNavbarToggler
              type='button'
              aria-expanded='false'
              aria-label='Toggle navigation'
              onClick={() => setShowNav(!showNav)}
            >
              {/*<MDBIcon icon='bars' fas />*/}
                <i class="fas fa-bars text-dark m-2 "></i>
            </MDBNavbarToggler>
            <MDBCollapse navbar show={showNav}>
              <MDBNavbarNav>
                <MDBNavbarItem>
                  <MDBNavbarLink active aria-current='page' href='#'>
                    Home
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='#'>Features</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='#'>Pricing</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink disabled href='#' tabIndex={-1} aria-disabled='true'>
                    Disabled
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
    // <Router>

    )
}
