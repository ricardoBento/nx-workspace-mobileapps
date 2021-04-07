import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NotificationsService } from './notifications.service';
import { HeadersService } from './headers.service';
import { Region } from '../interfaces/region.interface';

declare let $: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public regions: any;
  public regionsData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage,
    private loadingService: NotificationsService,
    private headers: HeadersService
  ) {}
  logout(): Observable<any> {
    this.loadingService.loadingPresent();
    if (this.storage.get('token')) {
      this.http
        .get(environment.api_url + environment.logout)
        .subscribe((data) => {
          this.router
            .navigateByUrl('login')
            .then(() => this.loadingService.loadingDismiss());
        });
      return;
    } else {
      this.router.navigateByUrl('login');
      return;
    }
  }
  appLogin(loginForm): Observable<any> {
    const body = {
      email: loginForm.value.email,
      password: loginForm.value.password,
    };
    return this.http.post('https://demo.flow-bms.com/rest-auth/login/', body, {
      headers: this.headers.jsonHeader(),
    });
  }
  register(onRegisterForm): Observable<any> {
    const body = {
      username: onRegisterForm.value.username,
      first_name: onRegisterForm.value.first_name,
      last_name: onRegisterForm.value.last_name,
      email: onRegisterForm.value.email,
      access_code: onRegisterForm.value.access_code,
      password1: onRegisterForm.value.password1,
      password2: onRegisterForm.value.password2,
    };
    return this.http.post(environment.api_url + environment.register, body, {
      headers: this.headers.jsonHeader(),
    });
  }
  passReset(passResetFrom): Observable<any> {
    const body: any = {
      email: passResetFrom.value.email,
    };
    return this.http.post(
      environment.api_url + environment.pass_reset_url,
      JSON.stringify(body),
      { headers: this.headers.jsonHeader() }
    );
  }
  loadRegions() {
    return this.http
      .get(environment.api_url + environment.regions_url, {
        headers: this.headers.jsonHeader(),
      })
      .subscribe(
        (regions: any) => {
          if (regions) {
            this.regionsData.next(regions);
          } else {
            const error_message = ['No data from loadREgions()'];
            this.handleError(error_message);
            this.regionsData.next(error_message);
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
  }
  registerVenue(venueForm: Region) {
    const body: Region = {
      name: venueForm.name,
      region: venueForm.region,
      post_code: venueForm.post_code,
    };
    return this.http.post(
      environment.api_url + environment.user_venue_url,
      JSON.stringify(body),
      { headers: this.headers.jsonHeader() }
    );
  }
  handleError(error) {
    return throwError(error);
  }
}
