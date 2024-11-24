import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LocalStorageUser } from '../shared/intefaces/LocalStorageUser';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { BusyService } from './busy.service';
import { IUserLogin } from '../shared/intefaces/IUserLogin';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { IUserRegister } from '../shared/intefaces/IuserRegister';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  localcalStorageUser: LocalStorageUser = {
    access_Token: '',
    name: '',
    address: '',
    role: '',
    id: 0,
  };
  private token: string | null = null;
  helper = new JwtHelperService();
  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private busyService: BusyService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  UserLoggedIn(): boolean {
    const localData = localStorage.getItem('LocalStorageUser');
    if (localData) {
      const accessToken = JSON.parse(localData).access_Token;
      return !this.jwtHelper.isTokenExpired(accessToken);
    }
    return false;
  }
  login(userLogin: IUserLogin) {
    console.log('user to log in AuthUser', userLogin);
    this.busyService.busy();
    this.http
      .post('http://localhost:8080/api/v1/auth/authenticate', userLogin)
      .pipe(
        tap((res: any) => {
          if (res.access_Token) {
            this.localcalStorageUser.access_Token = res.access_Token;
            this.localcalStorageUser.name = res.name;
            this.localcalStorageUser.address = res.address;
            this.localcalStorageUser.role = res.role;
            this.localcalStorageUser.id = res.id;
            localStorage.setItem(
              'LocalStorageUser',
              JSON.stringify(this.localcalStorageUser)
            );
            this.isUserLoggedIn.next(true); // Update status immediately after token storage
          }
        }),
        finalize(() => this.busyService.idle()) // Ensure finalize happens at end
      )
      .subscribe((res: any) => {
        if (this.isUserLoggedIn.value) {
          this.toastrService.success('Logged in Successfully');
          const attemptedURL = localStorage.getItem('attemptedURL');
          console.log('attemptedURL', attemptedURL);
          if (attemptedURL) {
            this.router.navigateByUrl(attemptedURL);
            localStorage.removeItem('attemptedURL');
          } else {
            this.router.navigate(['products']);
          }
        } else {
          alert('Login failed');
        }
      });
  }
 

  logout(): void {
    const access_Token = this.getAccess_TokenFromLocalStorage();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${access_Token}`
    );

    console.log('Headers:', headers);

    this.http
      .post('http://localhost:8080/api/v1/auth/logout', {}, { headers })
      .subscribe({
        next: (res: any) => {
          if (res) {
            // Remove only specific keys from localStorage

            localStorage.removeItem('LocalStorageUser');
            this.isUserLoggedIn.next(false);
            this.router.navigate(['login']); // Redirect to login page
          } else {
            alert('Logout failed');
          }
        },
        error: (error) => {
          console.error('Logout error:', error);
          alert('Logout failed');
        },
        complete: () => {
          console.log('Logout request completed');
        },
      });
  }

  getAccess_TokenFromLocalStorage(): string {
    const localData = localStorage.getItem('LocalStorageUser');
    if (localData != null) {
      const loggedUserData = JSON.parse(localData);
      console.log('loggedUserData', loggedUserData);
      const access_Token = loggedUserData.access_Token;
      console.log('Retrieved Token:', access_Token);
      return access_Token;
    }
    return ''; // Ensure the function always returns a string
  }

  register(userRegister: IUserRegister) {
    this.http
      .post('http://localhost:8080/api/v1/auth/register', userRegister)
      .subscribe({
        next: (res: any) => {
          console.log('Registration successful:', res);
          this.router.navigate(['login']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error during registration:', error);
          if (error.status === 403) {
            alert('Access denied! Check your backend configuration.');
          }
        },
        complete: () => {
          console.log('Register request completed');
        },
      });
  }
}
