import { Injectable } from '@angular/core';
import {
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private isLoading = false;
  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}
  async loadingPresent() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: 'loading...',
        showBackdrop: true,
      })
      .then((a) => {
        return a.present().then(() => {
          if (!this.isLoading) {
            return a.dismiss();
          }
        });
      });
  }
  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => {});
  }
  async toastError(message) {
    const toast = await this.toastController.create({
      message: JSON.stringify(message),
      position: 'middle',
      duration: 3000,
    });
    toast.present();
  }
}
