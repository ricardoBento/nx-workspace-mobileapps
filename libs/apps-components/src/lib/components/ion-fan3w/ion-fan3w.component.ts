import { NotificationsService } from './../../../services/notifications.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { fadeAnimation, simpleFadein, SlideInOutAnimation } from './animation';

@Component({
  selector: 'app-ion-fan3w',
  templateUrl: './ion-fan3w.component.html',
  styleUrls: ['./ion-fan3w.component.scss'],
  animations: [SlideInOutAnimation, fadeAnimation, simpleFadein]
})
export class IonFan3wComponent implements OnInit {
  classToggled = false;
  animationState: any = 'out';
  document;
  fab_active: any = false;
  public active: any = false;
  wings = [
    {
      name: 'our-brand',
      icon: 'ios-custom-horn',
    },
    {
      name: 'news',
      icon: 'ios-custom-paper',
    },
    {
      name: 'logout',
      icon: 'log-out-icon',
    }
  ]

  constructor(
    private router: Router,
    public toastController: ToastController,
    private auth: AuthService,
    private notfications: NotificationsService
  ) { }

  ngOnInit() {
  }
  activateFanMenu() {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve(this.toogleMenu());
      }, 250);
    });
  }
  toogleMenu() {
    this.active = !this.active;
    this.fab_active = !this.fab_active;
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
    return 'success';
  }
  navigate(route) {
    if (route !== 'logout') {
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
    this.activateFanMenu();
    const toast = await this.toastController.create({
      header: 'Are you sure want to logout?',
      position: 'middle',
      buttons: [
        {
          side: 'end',
          text: 'Yes',
          handler: () => {
            this.auth.logout();
            this.router.navigateByUrl('login');
          },
        },
        {
          text: 'No',
          role: 'cancel',
        }
      ]
    });
    toast.present();
  }
}
