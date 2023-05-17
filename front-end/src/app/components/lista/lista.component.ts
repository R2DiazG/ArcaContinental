import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { VisitantesService } from 'src/app/services/visitantes.service';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { Animations } from 'src/app/animations/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
  animations:[Animations]
})
export class ListaComponent implements OnInit {
  public token: string | null;
  public visitantes:any = [];
  public url:string;

  constructor(
    private _serviceVisitantes:VisitantesService,
    private _auth:AuthService,
    private _router: Router
  ) {
    this.token = this._auth.getToken();
    this.url=GLOBAL.url;
  }

  ngOnInit() {
    this.getVisitantesAdmin();
  }
  getVisitantesAdmin() {
    console.log(this.token);
    if (this.token !== null) {
      this._serviceVisitantes.getVisitantesAdmin(this.token)
        .then(response => {
          this.visitantes = response.visitantes;
          console.log("RESPUESTA DEL SERVIDOR");
          console.log(response);
          console.log("VALORES");
          console.log(this.visitantes);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
}
