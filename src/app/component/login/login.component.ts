import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup, Validator, ReactiveFormsModule } from '@angular/forms'
import { LoginService } from './login.service';
import { Observable } from 'rxjs/Rx';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private loginFrm: FormBuilder, private loginService: LoginService) { }
  loginForm: FormGroup;

  ngOnInit() {
    window.localStorage.removeItem('accesstoken');
    window.localStorage.removeItem('accesstoken_pcs1');
    this.validateLoginFields();
  }

  authenticate() {
    let username = this.loginForm.get('username').value;
    let password = this.loginForm.get('password').value;
    let credentials = {
      username: username,
      password: password
    }
    this.loginService.authenticate(credentials)
      .subscribe(
      data => {
        if (data.status == 'verifywithcode') {
          this.loginService.verifyId = data.userId;
          this.router.navigate(['/verify']);
        } else if (data.status == 'success'
          && data.token != null
          && data.user != null) {
          window.localStorage.setItem('accesstoken', data.token);
          window.localStorage.setItem('accesstoken_pcs1', data.user);
          this.router.navigate(['/landing']);
        } else if (data.status == 'failed') {
          alert(data.message);
        }
      },
      err => { console.log(err); },
      () => { console.log('request complete') });
  }

  validateLoginFields() {
    this.loginForm = this.loginFrm.group({
      username: ['', [Validators.required, Validators.pattern('[^ @]*@[^ @]*')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)]],
    });
  }

  showPassword() {
    let password = document.getElementById("password");
    if (password.getAttribute('type') == 'password') {
      password.setAttribute('type', 'text');
      return;
    }
    password.setAttribute('type', 'password');
  }
}