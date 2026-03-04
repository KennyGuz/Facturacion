import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MesasService } from '../../services/mesas.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mesas',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './mesas.html',
  styleUrl: './mesas.css',
})
export class Mesas {
  mesasService = inject(MesasService);

  mesaswithdata = this.mesasService.mesas;

  searchForm = new FormGroup({
    search: new FormControl(''),
    activo: new FormControl(''),
    limit: new FormControl(10),
  });

  onSearch() {
    const { search, activo, limit } = this.searchForm.value;
    const activoFilter = activo === '' ? undefined : activo === 'true';
    this.mesasService.getMesas(activoFilter, search || '', 1, limit || 10);
  }


  prevPage(page?: number) {
    const currPage = page ?? 1;
    if (currPage > 1) {
      this.changePage(currPage - 1);
    }
  }

  nextPage(page?: number, pages?: number) {
    const currPage = page ?? 1;
    const currPages = pages ?? 1;
    if (currPage < currPages) {
      this.changePage(currPage + 1);
    }
  }

  private changePage(page: number) {
    const { search, activo, limit } = this.searchForm.value;
    const activoFilter = activo === '' ? undefined : activo === 'true';
    this.mesasService.getMesas(activoFilter, search || '', page, limit || 10);
  }

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
