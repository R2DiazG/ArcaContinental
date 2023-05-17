import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { Animations } from 'src/app/animations/animations';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-preregistro',
  templateUrl: './preregistro.component.html',
  styleUrls: ['./preregistro.component.css']
})
export class PreregistroComponent {
  public token: string | null;
  nombre: string = '';
  correo: string = '';
  public url:string;

  constructor(
    private http: HttpClient,
    private _serviceUsers:UsersService,
    private _auth:AuthService,
    private _router: Router) {
    this.token = this._auth.getToken();
    this.url=GLOBAL.url;
  }

  guardarUsuario() {
    // Obtiene el nombre del usuario creador del local storage
    const nombreUsuarioCreador = localStorage.getItem('identity_usr');
    const usuarioCreador = nombreUsuarioCreador !== null ? JSON.parse(nombreUsuarioCreador).usuario : ''; 
    console.log(usuarioCreador);
    // Llama a la función para obtener el último ID de usuario
    this._serviceUsers.getUltimoId()
      .then((ultimoId: any) => {
        // Obtiene el ID del último usuario creado
        const idUltimoUsuario = parseInt(JSON.parse(ultimoId.ultimoId));
        console.log(idUltimoUsuario);
        // Crea el objeto de usuario con los datos necesarios
        const nuevoUsuario = {
          id: idUltimoUsuario + 1, // Incrementa el ID del último usuario
          usuario: this.correo.split('@')[0], // Utiliza el string antes del '@' como nombre de usuario
          password: '123',
          id_rol: 4, // Rol de invitado
          activo: true,
          creado_por: nombreUsuarioCreador
        };
        // Verifica que el token esté disponible
        if (this.token !== null) {
          this._serviceUsers.createUser(nuevoUsuario, this.token)
            .then(response => {
              console.log(response);
              this.enviarCorreo();
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  enviarCorreo() {
    const usuario = this.correo.substring(0, this.correo.indexOf('@'));
    const contraseña = '123';
    const mensaje = `Estimado(a) ${this.nombre},\n\n` +
                    `Su usuario es "${usuario}" y su contraseña es "${contraseña}".\n` +
                    `Puede ingresar al sitio en http://localhost:4200/login.\n\n` +
                    `Saludos,\nNo reply`;

    const correoData = {
      to: this.correo,
      subject: 'Información de acceso',
      message: mensaje
    };

    // Envía la solicitud POST para enviar el correo
    this.http.post('URL POR PONER', correoData)
      .subscribe(response => {
        console.log('Correo enviado correctamente.');
      }, error => {
        console.log('Error al enviar el correo:', error);
      });

    // Restablece los campos del formulario
    this.nombre = '';
    this.correo = '';
  }
}