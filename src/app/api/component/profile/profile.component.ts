import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoginService } from '../login/login.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  token = window.localStorage.getItem('token');
  id = window.localStorage.getItem('id');
  constructor(private http: Http, private loginService: LoginService, private router: Router) {

  }
  loggedInUser: User;
  headers: Headers = new Headers({ 'content-type': 'application/json', 'authorization': this.token });
  ngOnInit() {
    if (this.loginService.isUserLoggedin()) {
      this.getData();
    } else {
      this.router.navigate(['']);
    }
  }

  getData() {
    this.loggedInUser = new User();
    this.http.options('http://localhost:3000/users/' + this.id, {
      method: 'GET',
      headers: this.headers
    }).map(res => res.json())
      .subscribe(data => {
        this.loggedInUser = {
          id: data._id, name: data.name,
          password: data.password, email: data.email, date_of_birth: data.date_of_birth,
          occupation: data.occupation, gender: data.gender
        }; console.log(this.loggedInUser);
      });
  }

  updateProfile() {

  }

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('id');
    this.router.navigate(['']);
  }
}
