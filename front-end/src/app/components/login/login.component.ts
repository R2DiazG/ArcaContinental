import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public usuario:any={};
  constructor(
    private _serviceLogin:LoginService,
    private _router: Router
  ) { }
  ngOnInit() {
  }

  login() {
    // console.log("this.usuario:")
    // console.log(this.usuario);
    this._serviceLogin.login(this.usuario)
    .then((response: any) => {
      console.log(response);
      if(response === undefined){
        console.log("ERROR AL INICIAR SESION");
        return;
      }
      this._serviceLogin.login(this.usuario,true)
      .then((responseToken: any) => {
        localStorage.setItem('identity_usr',JSON.stringify(response.usuario));
        localStorage.setItem('token',responseToken.token);
        localStorage.setItem('id_rol',response.usuario.id_rol);
        /* console.log("LOCAL STORAGE SIN FORMATO");
        console.log(localStorage.getItem('identity_usr'));
        console.log("LOCAL STORAGE CON FORMATO");
        console.log(JSON.parse(localStorage.getItem('identity_usr')?? '{}'));
        console.log("RESPUESTA DEL SERVIDOR");
        console.log(response);
        console.log(localStorage.getItem('token')); */
        /* console.log("ID ROL",response.usuario.id_rol); */
        if(response.usuario.id_rol === 1){
          this._router.navigate(['/admin/lista']);
        }else if(response.usuario.id_rol === 2){
          this._router.navigate(['/empleado/lista']);
        }else if(response.usuario.id_rol === 3){
          this._router.navigate(['/guardia/qr']);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    })
    .catch((error: any) => {
      console.log(error);
      console.log("ERROR EN EL LOGIN");
    });
  }
}
