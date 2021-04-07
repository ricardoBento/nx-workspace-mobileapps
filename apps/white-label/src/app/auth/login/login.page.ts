/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage;
  non_field_errors;
  email_errors;
  message;
  constructor(
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private storage: Storage,
    private router: Router
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }
  ionViewWillEnter() {}
  ngOnInit() {}
  onSubmit() {
    const logged_user = this.loginForm.value.email;
    if (this.loginForm.valid) {
      return this.auth.appLogin(this.loginForm).subscribe(
        (token) => {
          if (token) {
            this.storage.set('token', token['key']).then(() => {
              this.storage.set('loggedUser', logged_user);
              this.router.navigateByUrl('home');
            });
          } else {
            this.router.navigateByUrl('login');
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
    } else {
      Object.keys(this.loginForm.controls).forEach((field) => {
        const control = this.loginForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  handleError(error: HttpErrorResponse) {
    this.non_field_errors = '';
    this.email_errors = '';
    if (error.status === 400 && error.error.non_field_errors) {
      this.non_field_errors = error.error.non_field_errors;
    }
    if (error.status === 400 && error.error.email) {
      this.email_errors = error.error.email;
    }
  }
  register() {
    this.router.navigateByUrl('register');
  }
  passReset() {
    this.router.navigateByUrl('pass-reset');
  }
}
