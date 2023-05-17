import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(
    private _auth:AuthService,
    private _router:Router
    ) { }

  canActivate() {
    if(this._auth.getIdentity()) {
      return true;
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }
}
