import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {environment} from '../../../environments/environment.prod';
import 'rxjs/add/operator/map'
@Injectable()
export class LoginService {

  constructor(private http:Http) { }
  verifyId: String ='';
  
  authenticate(credentials: any) {
    return this.http.options(environment.host + environment.loginRoute,{
      method:'POST',
      body:credentials,
    })
      .map(res => res.json());
  }
}
