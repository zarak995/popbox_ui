import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Http, Headers } from '@angular/http';

@Injectable()
export class LandingService {

  constructor(private http: Http) { }
  headers = new Headers({
    'content-type': 'application/json',
    'authorization': window.localStorage.getItem('accesstoken')
  });  

  
}
