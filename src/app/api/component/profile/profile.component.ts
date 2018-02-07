import { Component, OnInit, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoginService } from '../login/login.service';
import { ProfileService } from '../profile/profile.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  constructor(private http: Http, private loginService: LoginService, private profileService: ProfileService, private router: Router) { }
  token = window.localStorage.getItem('token');
  id = window.localStorage.getItem('id');
  isShowChangepassword = false;
  changeFormPass: FormGroup;
  newPassword: String = "";
  oldPassword: String = "";
  loggedInUser: User;
  headers: Headers = new Headers({ 'content-type': 'application/json', 'authorization': this.token });
  ngOnInit() {
    if (this.loginService.isUserLoggedin()) {
      this.getData();
      this.getOwnChats();
      //this.validateFields();
    } else {
      this.router.navigate(['']);
    }
  }

  validateFields( @Inject(FormBuilder) fb: FormBuilder) {
    this.changeFormPass = fb.group({
      oPass: ['', Validators.required, Validators.pattern(''), Validators.min(6)],
      /*nPass: ['', Validators.required, Validators.min(6)],
      cPass: ['', Validators.required, Validators.min(6)]*/
    })
  }

  confirmingPassword(c: AbstractControl): { invalid: boolean } {
    if (c.get('nPass').value !== c.get('cPass').value) {
      return { invalid: true }
    }
  }

  saveNewPassword() {
    let data = {
      password: this.oldPassword,
      newPassword: this.newPassword
    }
    this.profileService.changePassword(data)
      .map(res => res.json())
      .subscribe(data => {
        alert(data);
      })
    this.oldPassword = "";
    this.newPassword = "";
    this.showClosePassword();
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
          password: data.password, email: data.email, dateOfBirth: data.dateOfBirth,
          occupation: data.occupation, gender: data.gender, phone: data.phone, isShowReported: data.isShowReported
        }; console.log(this.loggedInUser);
      });
  }

  getOwnChats() {
    this.profileService.getOwnChats()
      .map(res => res.json())
      .subscribe(data => console.log(data))
  }

  onShowReportChanged() {
    alert(this.loggedInUser.isShowReported);
    this.loggedInUser.isShowReported = !this.loggedInUser.isShowReported;
    this.saveUpdateProfile();
  }

  showClosePassword() {
    this.isShowChangepassword = !this.isShowChangepassword;
  }

  saveUpdateProfile() {
    alert(JSON.stringify(this.loggedInUser));
    this.profileService.updateProfile(this.loggedInUser)
      .map(res => res.json())
      .subscribe(data => {
        /*if (data.status !== null && data.status !== '200') {
          alert(" There was an error please try again later")
        }else{
          alert("Profile has been updated");
        }*/
        if (data.code == "11000") {
          alert("Please use a different email or phone");
        }
        alert(data);
      })
    this.getData();
  }

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('id');
    this.router.navigate(['']);
  }
}
