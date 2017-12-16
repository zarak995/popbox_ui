import { Component, OnInit, Injectable } from '@angular/core';
import { User } from './models/user';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { LoginService } from './api/component/login/login.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService]
})

export class AppComponent implements OnInit {
  title = 'app';
  constructor(private loginService: LoginService) { }
  ngOnInit() {
  }
}
