/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NavController, ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.page.html',
  styleUrls: ['./pass-reset.page.scss'],
})
export class PassResetPage implements OnInit {
  // header settings
  title = 'Reset password';
  back_button = true;
  back_to = 'login';
  //
  passResetForm: FormGroup;
  non_field_errors;
  email_errors;
  constructor(
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private navCtrl: NavController,
    public toastController: ToastController
  ) {
    this.passResetForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
    });
  }
  ngOnInit() {}
  ionViewWillEnter() {}
  handleError(error: HttpErrorResponse) {
    this.non_field_errors = '';
    this.email_errors = '';
    if (error.status === 400 && error.error.non_field_errors) {
      this.non_field_errors = error.error.non_field_errors;
    }
    if (error.status === 400 && error.error.email) {
      this.email_errors = error.error.email;
    } else {
      return throwError(error);
    }
  }
  onSubmit() {
    if (this.passResetForm.valid) {
      this.auth.passReset(this.passResetForm).subscribe(
        (sucess) => {
          console.log(sucess);
          if (sucess) {
            this.toastMessage(sucess).then(() => {
              this.navCtrl.navigateBack('login');
            });
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }
  async toastMessage(message) {
    const toast = await this.toastController.create({
      message: message.detail,
      duration: 2000,
    });
    toast.present();
  }
}
