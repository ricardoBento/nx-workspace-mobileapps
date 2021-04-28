# NxWorkspaceMobileapps

## http://selendroid.io/setup.html

## Requirements

Android SDK must be installed and the ANDROID_SDK_ROOT environment variable must be pointing to the Android SDK location. Also, the emulator image must be present. You can specify your own sdk image string in the config. If you do not specify it uses the default sdk image string of `system-images;android-29;google_apis;x86_64`.

An [example karma config](./example/karma.conf.js) is in this repo.

## Android Hybrid App Requirements

This launcher uses appium to launch the app with the `android.intent.action.VIEW` action and passes the karma server URL in as a data uri. However, before passing the URL in the launcher swaps in the android loopback IP instead of localhost (Android emulators can't reach host machine using `localhost` but can reach the host machine using `10.0.2.2`).

You must make sure your Android manifest has an entry to handle the `10.0.2.2` karma URI. To do so add the following to the AndroidManifest.xml under the existing `<intent-filter>`:

```xml
<intent-filter android:label="@string/app_name">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="http"
      android:host="10.0.2.2"
      android:port="9876"
      android:pathPrefix="/" />
</intent-filter>
```

You can see the [test app manifest](./example/android-test-app/app/src/main/AndroidManifest.xml) as an example.


- https://ionicframework.com/docs/cli/configuration
- to build the flow app phonegap/cordova add we need to cd in apps/flowapp directory and run the cordova command inside, cordova build android etc.
- To run Appium tests, we need Desktop version installed to use the element inspector.
- Also, we need to run it as Admin, on windows power shell.
- To run Cypress for the flow app, we need one terminal running the development server on 'apps/flowapp' directory and another on 'apps/flowapp-e2e' running 'npx cypress open'.

This project was generated using [Nx](https://nx.dev).

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

There are also many [community plugins](https://nx.dev/nx-community) you could add.

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@nx-workspace-mobileapps/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## ☁ Nx Cloud

### Computation Memoization in the Cloud

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
