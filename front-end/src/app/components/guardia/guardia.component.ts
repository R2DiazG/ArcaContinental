import { Component, HostBinding, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Animations } from 'src/app/animations/animations';

@Component({
  selector: 'app-guardia',
  templateUrl: './guardia.component.html',
  styleUrls: ['./guardia.component.css'],
  animations:[Animations]
})
export class GuardiaComponent implements CanActivate, OnInit {
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
    if (id_rol === '3') {
      // Si el id_rol es 1, es guardia
      return true;
    } else if (id_rol === '1') {
      // Si el id_rol es 1, es administrador
      return true;
    } else {
      // Si el id_rol es cualquier otro, no es guardia.
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
    if (id_rol === '3') {
      // Si el id_rol es 3, es guardia
      
    } else if (id_rol === '1') {
      // Si el id_rol es 1, es administrador
    } else {
      // Si el id_rol es cualquier otro, no es guardia.
      this._router.navigate(['/home']);
    }
  }
  logout() {
    this._auth.logOut();
    this._router.navigate(['/login']);
  }
}
