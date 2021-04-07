import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';
import { NotificationsService } from './notifications.service';
@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenStorageService,
    public toastController: ToastController,
    private storage: Storage,
    private router: Router,
    private notificationsService: NotificationsService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.tokenService.getAsObservable('token')) {
      return this.tokenService.getAsObservable('token').pipe(
        mergeMap((token) => {
          const clonedReq = this.addToken(request, token);
          return next.handle(clonedReq);
        }),
        catchError((response: HttpErrorResponse) => {
          this.errorHandler(response);
          return throwError(response);
        })
      );
    }
  }
  private addToken(request: HttpRequest<any>, token: any) {
    if (token) {
      let clone: HttpRequest<any>;
      clone = request.clone({
        setHeaders: {
          Authorization: `Token ${token}`,
        },
      });
      return clone;
    }
    return request;
  }
  private async errorHandler(response: HttpErrorResponse) {
    if (
      response.status === 403 &&
      response instanceof HttpErrorResponse &&
      response.error.detail === "the user currently doesn't have a venue."
    ) {
      this.router.navigateByUrl('venue');
    }
    if (response.status === 401 && response instanceof HttpErrorResponse) {
      return this.storage.get('token').then((responseToken) => {
        if (responseToken) {
          this.storage.clear().then(() => {
            this.router.navigateByUrl('login');
          });
        }
      });
    }
  }
}
