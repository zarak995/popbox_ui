import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './api/component/login/login.component';
import { LandingComponent } from './api/component/landing/landing.component';

export const Route: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent }
];

export const Routing =RouterModule.forRoot(Route, { useHash: true })
