import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiResponse } from '../../models';

@Component({
  selector: 'app-loginform',
  imports: [ReactiveFormsModule],
  templateUrl: './loginform.html',
  styleUrl: './loginform.css',
})
export class Loginform {
  authService = inject(AuthService);
  errorMessage = signal<string | null>(null);
  constructor(private router: Router) { }

  loginForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  })

  iniciarSesion() {

    this.authService.login(this.loginForm.value.email!, this.loginForm.value.password!)
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
