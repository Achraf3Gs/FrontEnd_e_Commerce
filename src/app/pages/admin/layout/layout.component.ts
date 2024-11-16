import { AuthUserService } from './../../../services/auth-user.service';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  AuthUserService = inject(AuthUserService);
  logOut() {
    this.AuthUserService.logout();
  }
}
