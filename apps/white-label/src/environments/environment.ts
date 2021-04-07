// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // api_url: 'https://edinburghgin.flow-bms.com/',
  api_url: 'https://demo.flow-bms.com/',
  login: 'rest-auth/login/',
  logout: 'rest-auth/logout/',
  register: 'rest-auth/registration/',
  ingredients_url: 'api/v1/ingredients/',
  serve_suggestion_url: 'api/v1/serve-suggestion/',
  categories: 'api/v1/categories/',
  news_url: 'api/v1/news/',
  registration_url: 'rest-auth/registration/',
  category_modules: 'api/v1/catagory-modules/',
  game_leaderboard: 'api/v1/leaderboard/',
  game_post_score: 'api/v1/user-score/',
  serves: 'api/v1/serves/',
  pass_reset_url: 'rest-auth/password/reset/',
  regions_url: 'api/v1/regions/',
  user_venue_url: 'api/v1/create-user-venue/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
