import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getIdentity() {
    const identity_usr = localStorage.getItem('identity_usr');
    if (identity_usr) {
      let identity = JSON.parse(identity_usr);
      if (identity) {
        return identity;
      } else {
        return null;
      }
    }
  }

  getToken() {
    let token = localStorage.getItem('token');
    if (token) {
      return token;
    }else {
      return null;
    }
  }

  logOut() {
    localStorage.removeItem('identity_usr');
    localStorage.clear();
  }
}
