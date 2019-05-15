import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = false;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  constructor(private router: Router) { }

  login() {
    this._userIsAuthenticated = true;
    this.router.navigateByUrl('/places/tabs/discover');
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
