import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  authService = inject(AuthService);
  constructor(private router: Router) { }
  logout() {
    this.authService.logout().subscribe();
    this.authService.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
