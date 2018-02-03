import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoginService } from '../login/login.service';
import { ProfileService } from '../profile/profile.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  token = window.localStorage.getItem('token');
  id = window.localStorage.getItem('id');
  constructor(private http: Http, private loginService: LoginService, private profileService: ProfileService, private router: Router) { }
  loggedInUser: User;
  headers: Headers = new Headers({ 'content-type': 'application/json', 'authorization': this.token });
  ngOnInit() {
    if (this.loginService.isUserLoggedin()) {
      this.getData();
      this.getOwnChats();
    } else {
      this.router.navigate(['']);
    }
  }

  getData() {
    this.loggedInUser = new User();
    this.http.options(environment.host + environment.usersRoute + this.id, {
      method: 'GET',
      headers: this.headers
    }).map(res => res.json())
      .subscribe(data => {
        this.loggedInUser = {
          id: data._id, name: data.name,
          password: data.password, email: data.email, date_of_birth: data.date_of_birth,
          occupation: data.occupation, gender: data.gender, phone: data.phone
        }; console.log(this.loggedInUser);
      });
  }

  getOwnChats() {
    this.profileService.getOwnChats()
      .map(res => res.json())
      .subscribe(data => console.log(data))
  }

  saveUpdateProfile() {
    this.profileService.updateProfile(this.loggedInUser)
      .map(res => res.json())
      .subscribe(data => this.loggedInUser = data)
  }

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('id');
    this.router.navigate(['']);
  }
}
