import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor(private router: Router, private storage: Storage) {}
  async getFromPromise(key): Promise<any> {
    return await this.storage.ready().then(() => {
      return this.storage.get(key).then(
        (data) => {
          return data;
        },
        (error) => console.error(error)
      );
    });
  }
  getAsObservable(key): Observable<any> {
    return from(this.getFromPromise(key));
  }
  async saveStorage(key, value) {
    return await this.storage.set(key, value);
  }
  async removeStorage(key) {
    return await this.storage.remove(key);
  }
}
