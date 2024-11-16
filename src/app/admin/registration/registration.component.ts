import { Component, inject } from '@angular/core';
import { AuthUserService } from '../../services/auth-user.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  RegisterObj: any = {
    name: '',
    address: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
    role: '',
  };

  authuserService = inject(AuthUserService);
  registerUser() {
    console.log('this.RegisterObj :', this.RegisterObj);
    this.authuserService.register(this.RegisterObj);
  }
}
