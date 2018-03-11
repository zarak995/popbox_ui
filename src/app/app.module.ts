import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component';
import { LandingComponent } from './component/landing/landing.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ProfileComponent } from './component/profile/profile.component';
import { HeaderComponent } from './component/header/header.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { LoginService } from './component/login/login.service';
import { LoginModule } from '../app/component/login/login.module';
import { VerificationComponent } from './component/verification/verification.component'
import { VerificationModule } from './component/verification/verification.module';
import { RegisterModule } from './component/register/register.module';
import { LandingModule } from './component/landing/landing.module';
import { ViewchatComponent } from './component/viewchat/viewchat.component';
import { ViewchatModule } from './component/viewchat/viewchat.module';
import { ChatService } from './component/chat.service';
import { AvatarService } from './component/avatar.service';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HeaderComponent,
    VerificationComponent,
    ViewchatComponent,
  ],
  imports: [
    ViewchatModule,
    LandingModule,
    RegisterModule,
    VerificationModule,
    LoginModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'landing', component: LandingComponent },
      { path: 'login', component: LoginComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'verify', component: VerificationComponent },
      { path: 'post', component: ViewchatComponent }
    ], { useHash: true })
  ],
  providers: [FormBuilder, ChatService, AvatarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
