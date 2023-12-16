// components/signin.js
import { useEffect } from "react";

import  '../css/auth_css.css';
import { Authenticator, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { useNavigate, useLocation } from 'react-router';

export default function SignIn() {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || '/';
  useEffect(() => {
    if (route === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);

  return (
    <View className="auth-wrapper">
      <Authenticator className="pt-3 ">

      </Authenticator>

      <p className="fw-lighter m-2">An account allows you to download images. </p>
      <p className="fw-lighter m-2">Right now, that is all it does! </p>
      <p className="fw-lighter m-2">Public account creation is currently disabled, so please reach out if you would like an account</p>
    </View>
  );
}