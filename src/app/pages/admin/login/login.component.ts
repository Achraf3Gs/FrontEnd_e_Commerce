import { HttpClient } from '@angular/common/http';
import { Component, inject, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthUserService } from '../../../services/auth-user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: any = {
    email: '',
    password: '',
  };

  router = inject(Router);
  authuserService = inject(AuthUserService);

  onlogin() {
    if (this.loginObj.username !== '' && this.loginObj.password !== '') {
      console.log('user to log in login', this.loginObj);
      this.authuserService.login(this.loginObj);
    } else {
      alert('wrong credential');
      console.log(this.loginObj.username, '&', this.loginObj.password);
    }
  }
}
