/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { fadeAnimation, simpleFadein, SlideInOutAnimation } from './animation';
@Component({
  selector: 'ion-fan',
  templateUrl: './ion-fan.component.html',
  styleUrls: ['./ion-fan.component.scss'],
  animations: [SlideInOutAnimation, fadeAnimation, simpleFadein],
})
export class IonFanComponent {
  classToggled = false;
  animationState: any = 'out';
  document;
  fab_active: any = false;
  public active: any = false;
  constructor(
    private router: Router,
    public toastController: ToastController,
    private auth: AuthService
  ) {}
  activateFanMenu() {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve(this.toogleMenu());
      }, 250);
      // reject(console.error('promise rejected'));
    });
  }
  toogleMenu() {
    this.active = !this.active;
    this.fab_active = !this.fab_active;
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
    return 'success';
  }
  navigate(route) {
    if (route) {
      this.activateFanMenu().then((res) => {
        if (res === 'success') {
          this.router.navigateByUrl(route);
        }
      });
    }
    if (route === 'logout') {
      this.logoutAlert();
    }
  }
  async logoutAlert() {
    const toast = await this.toastController.create({
      header: 'Are you sure want to logout?',
      position: 'middle',
      buttons: [
        {
          side: 'end',
          text: 'Yes',
          handler: () => {
            this.auth.logout();
          },
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }
}
