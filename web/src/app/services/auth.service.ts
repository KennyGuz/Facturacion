import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, catchError, map, of } from 'rxjs';
import { ApiResponse } from '../models';
import { AuthUser } from '../models/auth.model';



@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  apiUrl = 'http://localhost:42069/api';

  currentUser = signal<AuthUser | null>(null);

  checkAuth(): Observable<AuthUser | null> {
    return this.http.get<ApiResponse<AuthUser>>(`${this.apiUrl}/profile`, {
      withCredentials: true
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          this.currentUser.set(response.data);
          return response.data;

        }
        return null;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 429) {
          return EMPTY
        }
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    });
  }

  login(email?: string, password?: string) {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/login`, { email, password })
  }
}
