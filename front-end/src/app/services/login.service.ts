import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url: string;

  constructor(
    private _http:HttpClient
    ) {
    this.url = GLOBAL.url;
    }

  login(usuario:any,getToken?:boolean): any {
    if (getToken) {
      usuario.token = getToken;
    }
    let headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json"
    });
    
    let options = { headers: headers};
    return this._http.post(this.url + 'login', usuario, options).toPromise()
      .then(res => {
        if (res) {
          return JSON.parse(JSON.stringify(res));
        }
        return null;
      })
      .catch(err => {
        console.log(err);
        // Borramos el token y la identidad del usuario
        localStorage.removeItem('token');
        localStorage.removeItem('identity_usr');
      });
  }
}
