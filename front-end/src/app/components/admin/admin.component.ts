import { Component, HostBinding, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Animations } from 'src/app/animations/animations';
const VISUALIZER_URL = 'http://127.0.0.1:5500/html/index.html?id_token=m4AKPGYRvOCRBG9HIqesFiiG3XpJIErhSiKWWYzFq18d5QmLxR5ysiO05EJuH9Qg'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations:[Animations]
})
export class AdminComponent implements CanActivate, OnInit {
  public identity:any;
  @HostBinding('@anim-admin') animAdmin: any;
  constructor(
    private _auth:AuthService,
    private _router:Router
    ) { 
      this.identity=this._auth.getIdentity();
    }
  canActivate() {
    let id_rol = localStorage.getItem('id_rol');
    if (id_rol === '1') {
      // Si el id_rol es 1, es administrador
      return true;
    } else {
      // Si el id_rol es 2, es visitante
      this._router.navigate(['/home']);
      return false;
    }
  }
  ngOnInit() {
    this.verifyIdRol();
  }

  verifyIdRol() {
    // Extraer el id_rol del localstorage
    let id_rol = localStorage.getItem('id_rol');
    if (id_rol === '1') {
      // Si el id_rol es 1, es administrador
      
    } else {
      // Si el id_rol es 2, es visitante
      this._router.navigate(['/home']);
    }
  }
  logout() {
    this._auth.logOut();
    this._router.navigate(['/login']);
  }
  redirigirASistemaExterno() {
    //redirigir a la pagina de inicio de sesion
    window.location.href = VISUALIZER_URL;

  }
}
