'use client';

import { Auth0Provider } from '@auth0/auth0-react';


export function Providers({ children }: any) {
  return (
    <Auth0Provider
      clientId="uEXiWJylfxymCWUwSNl5Z"
      domain="https://auth-wallet-poc.dev.upbond.io"
      authorizationParams={{ redirect_uri: window.location.origin, scope: "openid profile" }}>
      {children}
    </Auth0Provider>
  );
}