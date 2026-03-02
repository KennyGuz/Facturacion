import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse } from '../models';

@Component({
  selector: 'app-loginform',
  imports: [ReactiveFormsModule],
  templateUrl: './loginform.html',
  styleUrl: './loginform.css',
})
export class Loginform {
  apiUrl = 'http://localhost:42069/api/login';
  errorMessage= signal<string | null>(null);

  constructor(private router: Router) { }
  private http = inject(HttpClient);

  loginForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  })

  iniciarSesion() {
    this.http.post<ApiResponse<any>>(this.apiUrl, this.loginForm.value, {
    })
      .subscribe({
        next: (_result: ApiResponse<any>) => {
          this.errorMessage.set(null);
          this.router.navigate(['/dashboard']);

        },
        error: (error) => {
          console.log(error.error);
          this.errorMessage.set(`${error.error.error}`);
        }
      })
  }
}
