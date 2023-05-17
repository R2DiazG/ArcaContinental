import { Component, HostBinding, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Animations } from 'src/app/animations/animations';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
  animations:[Animations]
})
export class EmpleadoComponent implements CanActivate, OnInit {
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
    if (id_rol === '2') {
      // Si el id_rol es 1, es empleado
      return true;
    } else if (id_rol === '1') {
      // Si el id_rol es 1, es administrador
      return true;
    } else {
      // Si el id_rol es cualquier otro, no es empleado.
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
    if (id_rol === '2') {
      // Si el id_rol es 1, es empleado
      
    } else if (id_rol === '1') {
      // Si el id_rol es 1, es administrador
      
    } else {
      // Si el id_rol es cualquier otro, no es empleado.
      this._router.navigate(['/home']);
    }
  }
  logout() {
    this._auth.logOut();
    this._router.navigate(['/login']);
  }
}
