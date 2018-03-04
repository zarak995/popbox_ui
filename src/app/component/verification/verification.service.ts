import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http'
import { environment } from '../../../environments/environment.prod';
import { from } from 'rxjs/observable/from';
@Injectable()
export class VerificationService {
  constructor(private http: Http) { }
  verifyUser(data) {
    return this.http.options(environment.host + environment.loginRoute + environment.userVerification, {
      method: 'POST',
      body: data
    }).map(res => res.json());
  }

  resendVercodeAsEmail(data) {
    return this.http.options(environment.host + environment.resendToEmail, {
      method: 'POST',
      body: data
    }).map(res => res.json());
  }

  resendVercodeAsSMS(data) {
    return this.http.options(environment.host + environment.resendToSMS, {
      method: 'POST',
      body: data
    }).map(res => res.json());
  }
}