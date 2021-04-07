/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Storage } from '@ionic/storage';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  // header settings
  title = 'Register';
  back_button = true;
  back_to = 'login';
  //
  registerForm: FormGroup;
  non_field_errors;
  email_errors;
  user_name_errors;
  access_code_errors;
  password_errors;
  password1_errors;
  password2_errors;
  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private storage: Storage
  ) {
    this.registerForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      access_code: ['', Validators.compose([Validators.required])],
      password1: ['', Validators.compose([Validators.required])],
      password2: ['', Validators.compose([Validators.required])],
    });
  }
  ngOnInit() {}
  ionViewWillEnter() {}
  handleError(error: HttpErrorResponse) {
    this.non_field_errors = '';
    this.email_errors = '';
    this.user_name_errors = '';
    this.access_code_errors = '';
    this.password1_errors = '';
    this.password2_errors = '';
    if (error.status === 400 && error.error.non_field_errors) {
      if (
        error.error.non_field_errors.includes(
          `The two password fields didn't match.`
        )
      ) {
        this.password2_errors = error.error.non_field_errors;
      }
    }
    if (error.status === 400 && error.error.password1) {
      this.password1_errors = error.error.password1;
    }
    if (error.status === 400 && error.error.password2) {
      this.password2_errors = error.error.password2;
    }
    if (error.status === 400 && error.error.email) {
      this.email_errors = error.error.email;
    }
    if (error.status === 400 && error.error.username) {
      this.user_name_errors = error.error.username;
    }
    if (error.status === 400 && error.error.access_code) {
      this.access_code_errors = error.error.access_code;
    } else {
      return throwError(error);
    }
  }
  onSubmit() {
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm).subscribe(
        (token) => {
          if (token) {
            this.storage.set('token', token['key']).then(() => {
              this.router.navigateByUrl('venue');
            });
          } else {
            this.router.navigateByUrl('login');
          }
        },
        (error) => this.handleError(error)
      );
    } else {
      Object.keys(this.registerForm.controls).forEach((field) => {
        const control = this.registerForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
}
