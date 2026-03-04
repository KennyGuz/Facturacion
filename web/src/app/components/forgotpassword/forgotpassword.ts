import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiResponse } from '../../models';

@Component({
  selector: 'app-forgotpassword',
  imports: [ReactiveFormsModule],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css',
})
export class Forgotpassword {
 apiUrl = 'http://localhost:42069/api/resetpassword';
  errorMessage= signal<string | null>(null);
  formErrors = signal<Record<string, string[]>>({});
  message = signal<string | null>(null);

  constructor() { }
  private http = inject(HttpClient);

  forgotpasswordForm = new FormGroup({
    email: new FormControl(""),
  })

  sendRecoveryEmail() {
    this.http.post<ApiResponse<any>>(this.apiUrl, this.forgotpasswordForm.value, {
    })
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
