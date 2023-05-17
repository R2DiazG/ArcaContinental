import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { Animations } from 'src/app/animations/animations';

@Component({
  selector: 'app-cruduser',
  templateUrl: './cruduser.component.html',
  styleUrls: ['./cruduser.component.css'],
  animations:[Animations]
})
export class CruduserComponent implements OnInit{
  public token: string | null;
  public usuarios:any = [];
  public url:string;
  public editing = false;
  public filtroRol: number | null = null;
  public nuevoUsuario = {
    id: '',
    usuario: '',
    password: '',
    id_rol: '',
    activo: '',
    usuario_creacion: ''
  };
  currentPage: number = 1;
  usersPerPage: number = 10;
  totalPages: number = 1;
  
  constructor(
    private _serviceUsers:UsersService,
    private _auth:AuthService,
    private _router: Router
  ) {
    this.token = this._auth.getToken();
    this.url=GLOBAL.url;
  }

  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
    if (this.token !== null) {
      this._serviceUsers.getUsers(this.token)
        .then(response => {
          // Filtrar usuarios por rol si se ha seleccionado un valor de filtroRol
          if (this.filtroRol !== 0) {
            this.usuarios = response.usuarios.filter((usuario: { id_rol: { toString: () => number | null; }; }) => usuario.id_rol.toString() === this.filtroRol);
          } else {
            this.usuarios = response.usuarios;
          }
          // Seteamos la lista de usuarios
          this.usuarios = this.usuarios.slice((this.currentPage - 1) * this.usersPerPage, this.currentPage * this.usersPerPage);
          // Calculamos el total de páginas
          this.totalPages = Math.ceil(this.usuarios.length / this.usersPerPage);
          console.log("RESPUESTA DEL SERVIDOR");
          console.log(response);
          console.log("VALORES");
          console.log(this.usuarios);
        })
        .catch(error => {
          console.log(error);
        });
    }
}

  getTotalPages() {
    return this.totalPages;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getUsers();
    }
  }
  // Función para eliminar un usuario
  deleteUser(id:string) {
    console.log(this.token);
    /* this.token = this._auth.getToken(); */
    if (this.token !== null) {
      this._serviceUsers.deleteUser(id,this.token)
        .then(response => {
          console.log("RESPUESTA DEL SERVIDOR");
          console.log(response);
          this.getUsers();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  startEditing() {
    this.editing = true;
  }
  updateUser(id:any) {
    console.log(this.token);
    if (this.token !== null) {
      this._serviceUsers.updateUser(id, this.token)
        .then(response => {
          // actualiza la lista de usuarios después de la actualización
          this.getUsers();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  
  public nuevoUsuarioActivo = false;
  activarCrearUsuario() {
    this.nuevoUsuarioActivo = true;
  }
  cancelarCrearUsuario() {
    this.nuevoUsuarioActivo = false;
    this.nuevoUsuario = {
      id: '',
      usuario: '',
      password: '',
      id_rol: '',
      activo: '',
      usuario_creacion: ''
    };
  }

  guardarUsuario() {
    console.log(this.token);
    if (this.token !== null){
      this._serviceUsers.createUser(this.nuevoUsuario, this.token)
        .then(response => {
          console.log(response);
          this.cancelarCrearUsuario();
          this.getUsers();
        })
        .catch(error => {
          console.log(error);
        });
      }
  }
}
