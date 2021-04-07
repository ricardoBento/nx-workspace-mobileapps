/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class HeadersService {
  json = new HttpHeaders().set('Content-Type', 'application/json');
  formData = new HttpHeaders().set('Content-Type', 'multipart/form-data');
  url = new HttpHeaders().set(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  constructor() {}
  jsonHeader() {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }
  formDataHeader() {
    return new HttpHeaders().set('Content-Type', 'multipart/form-data');
  }
  urlEncodedHeader() {
    return new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
  }
}
