import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './api/component/profile/profile.component';
import { ChatComponent } from './api/component/chat/chat.component';
import { LoginComponent } from './api/component/login/login.component';
import { Routing } from './router';
import { RegisterComponent } from './api/component/register/register.component';
import { LandingComponent } from './api/component/landing/landing.component';
import { HeaderComponent } from './api/component/header/header.component';
import { ChatService } from './api/component/chat/chat.service';
import { RightnavComponent } from './api/component/rightnav/rightnav.component';
import { LeftnavComponent } from './api/component/leftnav/leftnav.component';
import { LoginService } from '../app/api/component/login/login.service';
import{LeftnavService} from './api/component/leftnav/leftnav.service';
import { FooterComponent } from './api/component/footer/footer.component'
import {LandingService} from '../app/api/component/landing/landing.service'
    import { from } from 'rxjs/observable/from';
import { RegisterService } from './api/component/register/register.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    ProfileComponent,
    RegisterComponent,
    LandingComponent,
    HeaderComponent,
    RightnavComponent,
    LeftnavComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    Routing,
    ReactiveFormsModule
  ],
  providers: [ChatService,LandingService,LeftnavService,RegisterService, RegisterComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
