/// <reference types="angular" />

import * as angular from 'angular';

declare module 'angular' {
  export namespace jwt {

    interface JwtToken {
      iss?: string;
      sub?: string;
      aud?: string;
      exp?: number;
      nbf?: number;
      iat?: number;
      jti?: string;
      unique_name?: string;
    }

    interface IJwtHelper {
      decodeToken(token: string): JwtToken;
      getTokenExpirationDate(token: any): Date;
      isTokenExpired(token: any, offsetSeconds?: number): boolean;
    }

    interface IJwtInterceptor {
      tokenGetter(...params: any[]): string;
    }

    interface IAuthManagerServiceProvider {
      authenticate(): void;
      unauthenticate(): void;
      isAuthenticated(): void;// ad-hoc type
      checkAuthOnRefresh(): void;
      redirectWhenUnauthenticated(): void;
    }
  }
}
