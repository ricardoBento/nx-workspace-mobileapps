/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppGuard } from './services/app.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AppGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'pass-reset',
    loadChildren: () =>
      import('./auth/pass-reset/pass-reset.module').then(
        (m) => m.PassResetPageModule
      ),
  },
  {
    path: 'venue',
    loadChildren: () =>
      import('./auth/venue/venue.module').then((m) => m.VenuePageModule),
  },
  // {
  //   path: 'our-brand', loadChildren: () => import('./pages/our-brand/our-brand.module').then(m => m.OurBrandPageModule),
  //   canActivate: [AppGuard]
  // },
  // {
  //   path: 'game', loadChildren: () => import('./pages/game/game.module').then(m => m.GamePageModule),
  //   canActivate: [AppGuard]
  // },
  // {
  //   path: 'leaderboard', loadChildren: () => import('./pages/game/leaderboard/leaderboard.module').then(m => m.LeaderboardPageModule),
  //   canActivate: [AppGuard]
  // },
  // {
  //   path: 'news', loadChildren: () => import('./pages/news/news.module').then(m => m.NewsPageModule),
  //   canActivate: [AppGuard]
  // },
  // {
  //   path: 'news-details', loadChildren: () => import('./pages/news/news-details/news-details.module').then(m => m.NewsDetailsPageModule),
  //   canActivate: [AppGuard]
  // },
  // {
  //   path: 'our-products', loadChildren: () => import('./pages/our-products/our-products.module').then(m => m.OurProductsPageModule),
  //   canActivate: [AppGuard]
  // },
  // {
  //   path: 'product-list', loadChildren: () => import('./pages/our-products/product-list/product-list.module').then(m => m.ProductListPageModule),
  //   canActivate: [AppGuard]
  // },
  // {
  //   path: 'serve-upload',
  //   loadChildren: () => import('./pages/our-products/details-tabs/serve-upload/serve-upload.module').then(m => m.ServeUploadPageModule),
  //   canActivate: [AppGuard]
  // },
  // {
  //   path: 'details-tabs',
  //   loadChildren: () => import('./pages/our-products/details-tabs/tabs.module').then(m => m.TabsPageModule),
  //   canActivate: [AppGuard]
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
