import { Component, Input, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MenuContainerComponent } from '../fan-menu/menu-container.component';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  @Input('title') title: string;
  @Input('back_button') back_button: boolean;
  @Input('back_to') back_to_url: boolean;
  constructor(private navCtrl: NavController) {}
  back(url) {
    if (url) {
      this.navCtrl.navigateBack(url);
    }
  }
}
