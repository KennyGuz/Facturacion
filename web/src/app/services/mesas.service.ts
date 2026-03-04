import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { EMPTY, Observable, catchError, map, of } from 'rxjs';
import { ApiResponse } from '../models';
import { Mesa, MesasData } from '../models/mesas.model';



@Injectable({ providedIn: 'root' })
export class MesasService {
  private http = inject(HttpClient);
  apiUrl = 'http://localhost:42069/api';

  constructor() {
    this.getMesas();
  }

  private state = signal<MesasData>({
    mesas: [],
    pagination: { page: 1, total: 0, limit: 10, pages: 0 }
  });

  readonly mesas = computed(() => this.state());

  getMesas(activo?: boolean, search?: string, page = 1, limit = 10) {
    console.log(activo, search, page, limit);
    const params = new HttpParams({
      fromObject: {
        activo: activo?.toString() ?? 'all',
        search: search ?? '',
        page: page?.toString(),
        limit: limit?.toString()
      }
    });

    return this.http.get<ApiResponse<MesasData>>(`${this.apiUrl}/mesas`, {
      params,
      withCredentials: true
    }).subscribe(result => {
      this.state.set({
        mesas: result.data!.mesas,
        pagination: result.data!.pagination
      });
    });
  }



  createMesa(numeroMesa?: number) {
    console.log(numeroMesa);
    return this.http.post<ApiResponse<Mesa>>(`${this.apiUrl}/mesa`, { numeroMesa }, {
      withCredentials: true
    });
  }

  inactivateMesa(id: number) {
    return this.http.delete<ApiResponse<Mesa>>(`${this.apiUrl}/mesa/${id}`, {
      withCredentials: true
    });
  }

  asignarMesa(id: number, estaOcupada: boolean) {
    return this.http.put<ApiResponse<Mesa>>(`${this.apiUrl}/mesa/${id}`, { estaOcupada }, {
      withCredentials: true
    });
  }


}
