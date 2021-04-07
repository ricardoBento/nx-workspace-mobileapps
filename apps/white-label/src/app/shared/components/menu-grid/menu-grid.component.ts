/* eslint-disable @angular-eslint/component-selector */
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
// import { AuthService } from 'src/app/services/auth.service';
import { MenuContainerComponent } from '../fan-menu/menu-container.component';
import { SlideInOutAnimation } from './animation';

@Component({
  selector: 'menu-grid',
  templateUrl: './menu-grid.component.html',
  styleUrls: ['./menu-grid.component.scss'],
  animations: [SlideInOutAnimation],
})
export class MenuGridComponent {
  public options = {
    defaultPosition: 'bottomRight',
    showIcons: true,
    onlyIcons: true,
    defaultOpen: false,
    spinable: false,
    buttonOpacity: 1,
    offset: -50,
    buttonWidth: 140,
    buttonCrossImgSize: 40,
    angle: 33,
    radius: 135,
    buttonBackgroundColor: 'var(--brand-menu-backgound)',
    buttonFontColor: 'var(--brand-menu-font)',
    wingIconSize: 30,
    wingFontColor: 'var(--brand-menu-font)',
  };
  public startAngles = {
    topLeft: 0,
    topRight: 0,
    bottomRight: 205,
    bottomLeft: 0,
  };
  public wings = [
    {
      title: 'Our Products',
      color: 'var(--brand-menu-backgound)',
      icon: {
        name: 'assets/custom-icons/ios-custom-glass.svg',
        color: 'var(--brand-menu-font)',
      },
      route: 'our-products',
    },
    {
      title: 'News Feed',
      color: 'var(--brand-menu-backgound)',
      icon: {
        name: 'assets/custom-icons/ios-custom-paper.svg',
        color: 'var(--brand-menu-font)',
      },
      route: 'news',
    },
    {
      title: 'Our Brand',
      color: 'var(--brand-menu-backgound)',
      icon: {
        name: 'assets/custom-icons/ios-custom-horn.svg',
        color: 'var(--brand-menu-font)',
      },
      route: 'our-brand',
    },
    {
      title: 'Game',
      color: 'var(--brand-menu-backgound)',
      icon: {
        name: 'assets/custom-icons/ios-custom-crown.svg',
        color: 'var(--brand-menu-font)',
      },
      route: 'game',
    },
    {
      title: 'Logout',
      color: 'var(--brand-menu-backgound)',
      icon: {
        name: 'assets/custom-icons/ios-icon-logout.svg',
        color: 'var(--brand-menu-font)',
      },
      route: 'logout',
    },
  ];
  animationState = 'out';

  @ViewChild(MenuContainerComponent, { static: true })
  menuContainerComponent: MenuContainerComponent;

  constructor(
    private router: Router,
    public alertController: AlertController,
    public toastController: ToastController,
    // private auth: AuthService,
    private navController: NavController
  ) {}
  async logoutAlert() {
    const toast = await this.toastController.create({
      header: 'Are you sure want to logout?',
      position: 'middle',
      buttons: [
        {
          side: 'end',
          text: 'Yes',
          handler: () => {
            // this.auth.logout();
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
  toggleSlideBg() {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }
  async appRoute($event) {
    if ($event.route === 'logout') {
      this.logoutAlert();
    } else {
      this.router.navigateByUrl($event.route).then(() => {
        if (this.menuContainerComponent.menuState) {
          this.menuContainerComponent.toggleMenu();
        }
      });
    }
  }
}
