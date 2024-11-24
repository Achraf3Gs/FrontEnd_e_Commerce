import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageUser } from '../../shared/intefaces/LocalStorageUser';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-social-login-callback-component',
  standalone: true,
  imports: [],
  templateUrl: './social-login-callback-component.component.html',
  styleUrl: './social-login-callback-component.component.css',
})
export class SocialLoginCallbackComponent implements OnInit {
  isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  localcalStorageUser: any = {
    access_Token: '',
    name: '',
    address: '',
    role: '',
    id: 0,
  };
  provider: string | null = null;
  accessToken: string | null = null;
  name: string | null = null;
  role: string | null = null;
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Capture the query parameters from the URL after the redirect
    this.route.queryParams.subscribe((params) => {
      this.accessToken = params['access_token'];
      this.name = params['name'];
      this.role = params['role'];
      this.id = params['id'];
    });

    // Access the provider param in the URL
    this.provider = this.route.snapshot.paramMap.get('provider');

    if (this.accessToken && this.name && this.role && this.id) {
      // Proceed with processing the login response
      this.captureSocialLoginResponse(
        this.accessToken,
        this.name,
        this.role,
        this.id
      );
    } else {
      alert('Invalid login response');
    }
  }

  captureSocialLoginResponse(
    accessToken: string,
    name: string,
    role: string,
    id: string
  ) {
    // Handle the response, e.g., store user details in localStorage
    this.localcalStorageUser.access_Token = accessToken;
    this.localcalStorageUser.name = name;
    this.localcalStorageUser.role = role;
    this.localcalStorageUser.id = parseInt(id);

    // Store the user details in localStorage
    localStorage.setItem(
      'LocalStorageUser',
      JSON.stringify(this.localcalStorageUser)
    );

    // Update login status
    this.isUserLoggedIn.next(true);

    // Show success notification
    this.toastrService.success('Logged in Successfully via ' + name);
    const attemptedURL = localStorage.getItem('attemptedURL');
    console.log('attemptedURL', attemptedURL);
    if (attemptedURL) {
      this.router.navigateByUrl(attemptedURL);
      localStorage.removeItem('attemptedURL');
    } else {
      this.router.navigate(['products']);
    }
  }
}
