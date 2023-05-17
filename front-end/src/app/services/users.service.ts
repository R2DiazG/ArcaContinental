import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  getUsers(token: string) {
    let headers: HttpHeaders = new HttpHeaders({
      "Authorization": token
    });
    let options = { headers: headers};
    return this.http.get(this.url + 'usuarios', options)
      .toPromise()
      .then(res => {
        if (res) {
          console.log("AQUIIII USERS SERVICE");
          console.log(res);
          console.log(JSON.parse(JSON.stringify(res)))
          return JSON.parse(JSON.stringify(res));
        }
        return null;
      });
  }

  createUser(user: any, token: string) {
    let headers: HttpHeaders = new HttpHeaders({
      "Authorization": token
    });
    let options = {headers: headers};
    return this.http.post(this.url + 'users', user, options)
      .toPromise()
      .then(res => {
        if (res) {
          console.log("AQUIIII");
          console.log(res);
          console.log(JSON.parse(JSON.stringify(res)))
          return JSON.parse(JSON.stringify(res));
        }
        return null;
      });
    }

  updateUser(user: any, token: string) {
    let headers: HttpHeaders = new HttpHeaders({
      "Authorization": token
    });
    let options = {headers: headers};
    return this.http.put(this.url + 'usuariosM', user, options)
      .toPromise()
      .then(res => {
        console.log(res + "!!!!!!!!!!!!!!!!!!!!!!!!!!")
        if (res) {
          console.log("AQUIIII");
          console.log(res);
          console.log(JSON.parse(JSON.stringify(res)))
          return JSON.parse(JSON.stringify(res));
        }
        return null;
      });
    }

  deleteUser(user: string, token: string) {
    let headers: HttpHeaders = new HttpHeaders({
      "Authorization": token
    });
    let options = {headers: headers};
    console.log(token + " " + user + "!!!!!!!!!!!!!!!!!!!!!!!!!!")
    // Retornamos la petición http con la url concatenada con el id del usuario a eliminar y las opciones
    return this.http.delete(this.url + 'usuariosD/' + user, options)    
      .toPromise()
      .then(res => {
        if (res) {
          console.log("AQUIIII");
          console.log(res);
          console.log(JSON.parse(JSON.stringify(res)))
          return JSON.parse(JSON.stringify(res));
        }
        return null;
      });
    }
}