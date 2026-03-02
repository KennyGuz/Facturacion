import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  isAuthencated = false;

  private http = inject(HttpClient);

  constructor() {}

  login() {
    this.isAuthencated = true;
  }

  logout() {
    this.isAuthencated = false;
  }
}
