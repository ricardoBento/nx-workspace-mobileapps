import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppGuard implements CanActivate {
  public userStatusData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  constructor(
    private router: Router,
    private tokenService: TokenStorageService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.tokenService.getAsObservable('token').pipe(
      take(1),
      map((auth) => {
        return !!auth;
      }),
      tap((loggedIn) => {
        // loggedIn evaluates true/false - if we find token/key on storage.
        if (!loggedIn) {
          const isLoggedIn: any = {
            isLoggedIn: loggedIn,
          };
          this.router.navigateByUrl('/login');
          this.userStatusData.next(isLoggedIn);
          return;
        }
        if (loggedIn) {
          const isLoggedIn: any = {
            isLoggedIn: loggedIn,
          };
          return this.userStatusData.next(isLoggedIn);
        }
      })
    );
  }
}
