import { LandingComponent } from './pages/website/landing/landing.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/admin/login/login.component';
import { LayoutComponent } from './pages/admin/layout/layout.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { authGuard } from './guard/auth.guard';
import { RegistrationComponent } from './pages/admin/registration/registration.component';
import { SocialLoginCallbackComponent } from './services/social-login-callback-component/social-login-callback-component.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login/oauth2/code/:provider',
    component: SocialLoginCallbackComponent,
  },
  { path: 'login/oauth2/code/github', component: SocialLoginCallbackComponent },
  {
    path: 'shop',
    component: LandingComponent,
  },
  { path: 'registration', component: RegistrationComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [authGuard], // Protecting all child routes
    children: [
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
    ],
  },
];
