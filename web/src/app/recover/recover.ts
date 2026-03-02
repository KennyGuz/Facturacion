import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '../models';

@Component({
  selector: 'app-recover',
  imports: [ReactiveFormsModule],
  templateUrl: './recover.html',
  styleUrl: './recover.css',
})
export class Recover {
  private route = inject(ActivatedRoute);
  apiUrl = 'http://localhost:42069/api/validateResetToken/';
  errorMessage = signal<string | null>(null);
  formErrors = signal<Record<string, string[]>>({});
  message = signal<string | null>(null);


  constructor() {
  }
  queryParams = toSignal(this.route.queryParamMap);

  private http = inject(HttpClient);

  recoverForm = new FormGroup({
    password: new FormControl(""),
    passwordConfirmation: new FormControl(""),
  })

  recoverPassword() {
    const formValues = this.recoverForm.value;
    if (formValues.password !== formValues.passwordConfirmation) {
      this.errorMessage.set("Las contraseñas no coinciden");
      return;
    }

    const token = this.queryParams()?.get('token');
    if (!token) {
      this.errorMessage.set("Token no encontrado");
      return;
    }

    this.http.post<ApiResponse<any>>(`${this.apiUrl}${token}`,
      formValues)
      .subscribe({
        next: (result: ApiResponse<any>) => {
          this.errorMessage.set(null);
          this.formErrors.set({});
          this.message.set(result.message);

        },
        error: (error) => {
          console.log(error.error);
          this.errorMessage.set(`${error.error.message}`);
          this.formErrors.set(error.error.errors ?? {});
        }
      })
  }



}
