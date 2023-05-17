import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { VisitantesService } from 'src/app/services/visitantes.service';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';
import { GLOBAL } from 'src/app/services/global';


@Component({
  selector: 'app-nuevo-visitante',
  templateUrl: './nuevo-visitante.component.html',
  styleUrls: ['./nuevo-visitante.component.css']
})
export class NuevoVisitanteComponent implements OnInit {
  public token: string | null;
  public visitante:any = {};
  public identity:any;
  public url:string;

  constructor(
    private _serviceVisitantes:VisitantesService,
    private _auth:AuthService,
    private _router: Router,
    private _upload:UploadService,
  ) {
    this.token = this._auth.getToken();
    this.identity = this._auth.getIdentity();
    this.url = GLOBAL.url;
    this.visitante.activo = true;
  }

  ngOnInit(): void {
  }

  agregar() {
    this.visitante.usuario_creacion=this.identity.usuario;
    if (this.token !== null) {
    this._serviceVisitantes.save(this.visitante,this.token)
      .then(response => {
        console.log(response);
        if (this.filesToUpload && this.token !== null) {
          this._upload.upload(this.url+'upload-visitante/'+response.visitante.id,this.filesToUpload,this.token)
          .then(visitantes => {
            this._router.navigate(['/admin/lista']);
          })
          .catch(error => {
            this._router.navigate(['/admin/lista']);
            console.log(error);
          });
      } else {
        this._router.navigate(['/admin/lista']);
      }
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  public filesToUpload!: Array<File>;
  public image_selected!: string;
  fileChangeEvent(fileInput: any) {
    /* this.filesToUpload = fileInput.target.files.length>0?<Array<File>>fileInput.target.files:null; */
    this.image_selected = this.filesToUpload?fileInput.target.files[0].name:'';
  }
}
