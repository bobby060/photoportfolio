import {React, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Link} from 'react-router-dom';
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
import { useAuthenticator } from '@aws-amplify/ui-react';
import '../css/index.css'
// import AnchorLink from 'react-anchor-link-smooth-scroll'
// **** ROUTES *****//
// Add routes here


export default function NavigationBar(){

    const [showNav, setShowNav] = useState(false);
    const user_item = useAuthenticator((context) => [context.user]);
    const authStatus = useAuthenticator(context => [context.authStatus]);

    function SignInWrapper() {
      if (authStatus.authStatus != 'authenticated') {
        return (
        <Link to={`/signin`}>
        <MDBNavbarLink   tabIndex={-1} aria-disabled='true'>
          Sign In</MDBNavbarLink>
        </Link>);
      }
      return (<MDBNavbarLink disabled href='/' tabIndex={-1} aria-disabled='true'>
                  {user_item.user.username}
                </MDBNavbarLink>);
    }

    function EditLinkWrapper(){
      if (authStatus.authStatus != 'authenticated') {
        return;
      }
      return (<MDBNavbarItem>
                  <Link to={`/editalbum`}>
                    <MDBNavbarLink>Edit Album</MDBNavbarLink>
                  </Link>
                </MDBNavbarItem>);
    }
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
                  <Link to={`/home`}>
                    <MDBNavbarLink active>
                      Home
                    </MDBNavbarLink>
                  </Link>
                </MDBNavbarItem>
                <EditLinkWrapper/>
                <MDBNavbarItem>
                  <Link to={`/about`}>
                    <MDBNavbarLink aria-disabled='true'>About Me</MDBNavbarLink>
                  </Link>                  
                </MDBNavbarItem>
                <MDBNavbarItem className = "ms-auto">
                  <SignInWrapper/>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
    // <Router>

    )
}
