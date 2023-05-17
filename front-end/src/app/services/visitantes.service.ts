import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VisitantesService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  getVisitantes() {
    return this.http.get(this.url + 'visitantes')
      .toPromise()
      .then(res => {
        if (res) {
          console.log(res);
          return JSON.parse(JSON.stringify(res));
        }
        return null;
      });
  }

  getVisitantesAdmin(token: string) {
    let headers: HttpHeaders = new HttpHeaders({
      "Authorization": token
    });
    let options = { headers: headers};
    return this.http.get(this.url + 'visitantesAdmin', options)
      .toPromise()
      .then(res => {
        if (res) {
          console.log("AQUIIII VISITANTES SERVICE");
          console.log(res);
          console.log(JSON.parse(JSON.stringify(res)))
          return JSON.parse(JSON.stringify(res));
        }
        return null;
      });
  }

  save(visitante:any, token:string) {
    let headers: HttpHeaders = new HttpHeaders({
      "Authorization": token
    });
    let options = {headers: headers};
    return this.http.post(this.url + 'visitantes', visitante, options)
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

  /* getVisitantes() {
    return this.http.get<any>(this.url + 'visitantes')
      .subscribe(data => {
        console.log(data);
        //return data;
      });
  } */
}
