import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { User } from '../../models/user';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  newuser: User;
  constructor(private router: Router, private regForm: FormBuilder, private registerService: RegisterService) { }
  
  ngOnInit() {
    this.validateregisterForm();
    this.confirmPasswordChange();
  }

  addNewUser() {
    this.confirmPasswordChange();
    if (this.registerForm.valid && this.registerForm.get('pass').value === this.registerForm.get('cpass').value) {
      this.newuser = new User();
      this.newuser.email = this.registerForm.get('email').value;
      this.newuser.password = this.registerForm.get('pass').value;
      this.newuser.gender = this.registerForm.get('gender').value;
      this.newuser.phone = this.registerForm.get('phone').value;
      this.newuser.dateOfBirth = this.registerForm.get('dob').value;
      
      this.registerService.registerNewUser(this.newuser)
        .subscribe(
        data => {
          if (data.status == 'success') {
            this.registerService.verifyId = data.userId;
            this.router.navigate(['/verify']);
            this.registerForm.clearValidators();
          } else {
            alert(data.message);
          }
        },
        err => { },
        () => { console.log("Request Complete") })
    }
  }

  validateregisterForm() {
    this.registerForm = this.regForm.group({
      email: ['', [Validators.required, Validators.pattern('[^ @]*@[^ @]*')]],
      pass: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)]],
      cpass: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)]],
      gender: ['', [Validators.required, this.forbiddenValueValidator(/--Select Gender--/i)]],
      dob: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^[+][0-9]+$/i)]]
    })
  }

  forbiddenValueValidator(value: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = value.test(control.value);
      return forbidden ? { 'forbidden': { value: control.value } } : null;
    };
  }

  confirmPasswordChange() {
    this.registerForm.get('cpass').valueChanges.subscribe(change => {
      if (this.registerForm.get('pass').value !== change) {
        this.registerForm.controls['cpass'].setErrors({ 'incorrect': true });
      }
    })
  }

  showPassword() {
    let regPass = document.getElementById('pass');
    let regCPass = document.getElementById('cpass');
    if (regPass.attributes.getNamedItem('type').value === 'password') {
      regPass.attributes.getNamedItem('type').value = 'text';
      regCPass.attributes.getNamedItem('type').value = 'text';
      return;
    }
    regPass.attributes.getNamedItem('type').value = "password";
    regCPass.attributes.getNamedItem('type').value = 'password';
  }
}