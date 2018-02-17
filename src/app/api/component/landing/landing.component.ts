import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoginService } from '../login/login.service';
import { LandingService } from '../landing/landing.service';
import { User } from '../../../models/user';
import { Post } from '../../../models/Post';
import { Avatar } from "../../../models/Avatar";
import { Chat } from "../../../models/Chat";
import { Router } from '@angular/router';
import { map } from 'rxjs/operator/map';
import { forEach } from '@angular/router/src/utils/collection';
import { log } from 'util';
import { element } from 'protractor';
import * as moment from 'moment';
import { DatePipe } from '@angular/common/src/pipes';
import { from } from 'rxjs/observable/from';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  token: String = window.localStorage.getItem('token');
  constructor(private http: Http, private loginService: LoginService, private landingService: LandingService, private router: Router) { }
  loggedInUser: User;
  headers: Headers = new Headers({ 'content-type': 'application/json', 'authorization': this.token });

  ngOnInit() {
    if (this.token == null) {
      this.router.navigate(['/login']);
    }
  }

  getData() {
    this.landingService.getUserCurrentUserData()
      .map(res => res.json())
      .subscribe(data => {
        if (data === null || data._id === "") {
          console.log(data);
          console.log('Something is wrong');

        }
      })
  }

  logout() {
    this.router.navigate(['/login']);
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('id');

  }
}