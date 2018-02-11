import { Component, OnInit, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoginService } from '../login/login.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { interval } from 'rxjs/observable/interval';
import { setInterval, setTimeout } from 'timers';
import { ChatService } from '../chat/chat.service';
@Component({
  selector: 'app-rightnav',
  templateUrl: './rightnav.component.html',
  styleUrls: ['./rightnav.component.css']
})
export class RightnavComponent implements OnInit {

  constructor(private http: Http, private loginService: LoginService, private chatService: ChatService, private router: Router) { }
  token = window.localStorage.getItem('token');
  id = window.localStorage.getItem('id');
  isShowChangepassword = false;
  newPassword: String = "";
  oldPassword: String = "";
  loggedInUser: User;
  headers: Headers = new Headers({ 'content-type': 'application/json', 'authorization': this.token });
  isProfileSet: Boolean = false;
  updateProfileForm: FormGroup;
  changePasswordForm: FormGroup;
  ngOnInit() {
    if (this.loginService.isUserLoggedin()) {
      setTimeout(() => {
        this.validateUpdateForm();
      }, 3000)

      this.getData();
      //this.getOwnChats();
      this.validateChangePasswordForm();
      this.confirmPasswordChange();
    } else {
      this.router.navigate(['']);
    }
  }

  confirmingPassword(c: AbstractControl): { invalid: boolean } {
    if (c.get('nPass').value !== c.get('cPass').value) {
      return { invalid: true }
    }
  }

  saveNewPassword() {
    let data = {
      password: this.changePasswordForm.get('opass').value,
      newPassword: this.changePasswordForm.get('pass').value
    }
    this.chatService.changePassword(this.headers, this.id, data)
      .map(res => res.json())
      .subscribe(data => {
        alert(data);
      })
    this.oldPassword = "";
    this.newPassword = "";
    this.showClosePassword();
  }

  async getData() {
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
        };
      });
  }

  /*getOwnChats() {
    this.chatService.getOwnChats()
      .map(res => res.json())
      .subscribe(data => console.log(data))
  }*/

  onShowReportChanged() {
    this.loggedInUser.isShowReported = !this.loggedInUser.isShowReported;
    this.saveUpdateProfile();
  }

  showPassword() {
    let updateFrmPass = document.getElementById('pass');
    let updateFrmCPass = document.getElementById('cpass');
    let updateFrmOPass = document.getElementById('opass');
    if (updateFrmPass.attributes.getNamedItem('type').value === 'password') {
      updateFrmPass.attributes.getNamedItem('type').value = 'text';
      updateFrmCPass.attributes.getNamedItem('type').value = 'text';
      updateFrmOPass.attributes.getNamedItem('type').value = 'text';
      return;
    }
    updateFrmOPass.attributes.getNamedItem('type').value = 'password';
    updateFrmPass.attributes.getNamedItem('type').value = "password";
    updateFrmCPass.attributes.getNamedItem('type').value = 'password';
  }

  showClosePassword() {
    this.isShowChangepassword = !this.isShowChangepassword;
  }

  saveUpdateProfile() {
    if (this.updateProfileForm.get('email').value == this.loggedInUser.email
      && this.updateProfileForm.get('occupation').value == this.loggedInUser.phone
      && this.updateProfileForm.get('phone').value == this.loggedInUser.phone) {
      alert("No updates were saved");
    }
    else if (this.updateProfileForm.get('email').value !== this.loggedInUser.email
      || this.updateProfileForm.get('occupation').value !== this.loggedInUser.phone
      || this.updateProfileForm.get('phone').value !== this.loggedInUser.phone) {
      this.loggedInUser.email = this.updateProfileForm.get('email').value;
      this.loggedInUser.phone = this.updateProfileForm.get('phone').value;
      this.loggedInUser.occupation = this.updateProfileForm.get('occupation').value;
      this.chatService.updateProfile(this.headers, this.id, this.loggedInUser)
        .map(res => res.json())
        .subscribe(data => {
          if (data.code == "11000") {
            alert("Please use a different email or phone");
            return
          }
          alert("Profile has been updated");
        })
      this.getData();
    }
  }


  validateUpdateForm() {
    this.updateProfileForm = new FormGroup({
      'email': new FormControl(this.loggedInUser.email, [Validators.pattern('[^ @]*@[^ @]*')]),
      'phone': new FormControl(this.loggedInUser.phone, [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^[+][0-9]+$/i)]),
      'occupation': new FormControl(this.loggedInUser.occupation, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z a-zA-Z]+$/i)]),
    })
  }

  validateChangePasswordForm() {
    if (this.loggedInUser.email !== null) {
      this.isProfileSet = true;
    }
    this.changePasswordForm = new FormGroup({
      'opass': new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)]),
      'pass': new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)]),
      'cpass': new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)])
    })
  }

  confirmPasswordChange() {
    this.changePasswordForm.get('cpass').valueChanges.subscribe(change => {
      if (this.changePasswordForm.get('pass').value !== change) {
        this.changePasswordForm.controls['cpass'].setErrors({ 'incorrect': true });
      }
    })
  }

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('id');
    this.router.navigate(['']);
  }
}
