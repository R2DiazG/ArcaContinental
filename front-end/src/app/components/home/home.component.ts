/* import { HttpClient } from '@angular/common/http'; */
import { Component, OnInit } from '@angular/core';
import { VisitantesService } from 'src/app/services/visitantes.service';
import { GLOBAL } from 'src/app/services/global';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Animations } from 'src/app/animations/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations:[Animations]
})
export class HomeComponent implements OnInit {
  public visitantes:any = [];
  public url:string;
  public fotografia_seleccionada:any={};
  public ver_mas:boolean=false;
  public foto_actual:number=0;
  //public direccion:string;
  public show_thumbs:boolean=false;
  /* private url: string; */

  constructor(
    private _serviceVisitantes:VisitantesService,
    private _route:ActivatedRoute,
    private _router:Router
    /* private _serviceVisitantes:VisitantesService,
    private http: HttpClient
    ) {
      this.url = 'http://localhost:8010/api/';
    }

  ngOnInit() {
    this.http.get(this.url + 'visitantes')
      .subscribe(data => {
        console.log(data);
        this.visitantes = data;
      });
  } */
  ) {
    this.url=GLOBAL.url;
  }
  ngOnInit() {
    this.getVisitantes();
  }

  getVisitantes() {
    this._serviceVisitantes.getVisitantes()
    .then(response => {
      this.visitantes = response.visitantes;
      console.log(this.visitantes);
    })
    .catch(error => {
      console.log(error);
    })
  }

  /* getVisitantes() {
    this._serviceVisitantes.getVisitantes()
    .subscribe((response: any) => {
      this.visitantes = response;
      console.log(this.visitantes);
    })
  } */

}
