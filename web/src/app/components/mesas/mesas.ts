import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MesasService } from '../../services/mesas.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mesas',
  imports: [RouterLink],
  templateUrl: './mesas.html',
  styleUrl: './mesas.css',
})
export class Mesas {
  mesasService = inject(MesasService);

  mesaswithdata = this.mesasService.mesas;

  inactivateMesa(id: number) {
    this.mesasService.inactivateMesa(id).subscribe({
      next: () => {
        this.mesasService.getMesas();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
    this.mesasService.getMesas();
  }

  asignarMesa(id: number, estaOcupada: boolean) {
    this.mesasService.asignarMesa(id, estaOcupada).subscribe({
      next: () => {
        this.mesasService.getMesas();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  searchMesa(search?: string, activo?: boolean) {
    this.mesasService.getMesas(activo, search)
  }
}
