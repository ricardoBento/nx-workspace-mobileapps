import { Injectable } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
@Injectable({
  providedIn: 'root',
})
export class ScreenOrientationService {
  constructor(private screenOrientation: ScreenOrientation) {}
  lockScreenPortrait() {
    this.screenOrientation.lock(
      this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
    );
  }
}
