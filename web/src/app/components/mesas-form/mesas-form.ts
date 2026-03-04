import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MesasService } from '../../services/mesas.service';
import { ApiResponse } from '../../models';

@Component({
  selector: 'app-mesas-form',
  imports: [ReactiveFormsModule],
  templateUrl: './mesas-form.html',
  styleUrl: './mesas-form.css',
})
export class MesasForm {
  errorMessage = signal<string | null>(null);
  formErrors = signal<Record<string, string[]>>({});
  message = signal<string | null>(null);

  mesasService = inject(MesasService);
  mesasForm = new FormGroup({
    numeroMesa: new FormControl(0, {nonNullable: true}),
  })

  createNewMesa() {
    console.log(this.mesasForm.value);

    const formData = this.mesasForm.value;

    this.mesasService.createMesa(formData.numeroMesa)
    .subscribe({
        next: (result: ApiResponse<any>) => {
          this.errorMessage.set(null);
          this.formErrors.set({});
          this.message.set(result.message);
          this.mesasService.mesas().mesas.push(result.data!);

        },
        error: (error) => {
          console.log(error.error);
          this.errorMessage.set(`${error.error.message}`);
          this.formErrors.set(error.error.errors ?? {});
        }
      })

  }
}
