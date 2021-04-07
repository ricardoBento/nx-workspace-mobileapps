import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title = 'Home';
  back_button = false;
  //
  constructor(private router: Router) {}
  ourProducts() {
    this.router.navigateByUrl('our-products');
  }
  ourBrand() {
    this.router.navigateByUrl('our-brand');
  }
  newsFeed() {
    this.router.navigateByUrl('news');
  }
  ourGame() {
    this.router.navigateByUrl('game');
  }
}
