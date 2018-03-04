import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { LoginService } from './login.service';
import { LoginComponent } from './login.component';
import { AppComponent } from '../../app.component';
@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  providers: [LoginService]
})
export class LoginModule { }
