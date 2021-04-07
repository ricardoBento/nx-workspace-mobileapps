/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Region } from '../../interfaces/region.interface';
@Component({
  selector: 'app-venue',
  templateUrl: './venue.page.html',
  styleUrls: ['./venue.page.scss'],
})
export class VenuePage implements OnInit {
  title = 'Venue';
  back_button = true;
  back_to = 'register';
  //
  non_field_errors;
  venue_name_error;
  region_error;
  post_code_error;
  venueForm: FormGroup;
  regions: Region[] = [];
  constructor(
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.venueForm = formBuilder.group({
      name: [
        '',
        Validators.compose([Validators.minLength(1), Validators.required]),
      ],
      region: [
        '',
        Validators.compose([Validators.minLength(1), Validators.required]),
      ],
      post_code: [
        '',
        Validators.compose([Validators.minLength(1), Validators.required]),
      ],
    });
  }
  ngOnInit() {}
  ionViewWillEnter() {
    this.auth.loadRegions();
    this.auth.regionsData.subscribe((regions) => {
      this.regions = regions;
    });
  }
  onSubmit() {
    if (this.venueForm.valid) {
      this.auth.registerVenue(this.venueForm.value).subscribe(
        (response: Region) => {
          if (response != null) {
            this.router.navigateByUrl('home');
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
    } else {
      Object.keys(this.venueForm.controls).forEach((field) => {
        const control = this.venueForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  handleError(error: HttpErrorResponse) {
    this.non_field_errors = '';
    this.venue_name_error = '';
    this.region_error = '';
    this.post_code_error = '';
    if (error.status === 400 && error.error.non_field_errors) {
      this.non_field_errors = error.error.non_field_errors;
    }
    if (error.status === 400 && error.error.region) {
      this.region_error = error.error.region;
    }
    if (error.status === 400 && error.error.name) {
      this.venue_name_error = error.error.name;
    } else {
      return throwError(error);
    }
  }
}
