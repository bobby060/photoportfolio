// components/signin.js
"use client"
import React from 'react';
import { useEffect } from "react";
import '@aws-amplify/ui-react/styles.css';
import '../css/auth_css.css';
import { Authenticator, useAuthenticator, View } from '@aws-amplify/ui-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignIn() {
    const { route } = useAuthenticator((context) => [context.route]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/';

    useEffect(() => {
        if (route === 'authenticated') {
            router.push(from);
        }
    }, [route, router, from]);

    return (
        <View className="auth-wrapper">
            <Authenticator className="pt-3">
            </Authenticator>

            <p className="fw-lighter m-2">An account allows you to download images. </p>
            <p className="fw-lighter m-2">Right now, that is all it does! </p>
            <p className="fw-lighter m-2">Public account creation is currently disabled, so please reach out if you would like an account</p>
        </View>
    );
}