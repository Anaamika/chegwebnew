<!-- ABOUT THE PROJECT -->
# Cheggout
Cheggout is a web application for the bank customers to
compare the price of various products, search the coupon and offers from different
stores like Amazon, Flipkart. It allows the user to get the reward points for the
successful purchase which can be redeemed as cash back or gift cards.

### Built With
This section listing major frameworks/languages that we used to built this project

* [Anguar](https://angular.io)
* [Bootstrap](https://getbootstrap.com)
* [Typescript](https://www.typescriptlang.org)
* [Material](https://material.angular.io/)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites


* node 10.x
```sh
sudo apt install nodejs
```
* npm 6.x
```sh
sudo apt install npm
```
* Angular CLI
```sh
npm install -g @angular/cli
```

### Installation

1. cd projectName
2. Install NPM packages
```sh
npm install
```
3. start server
```sh
npm start
```
4. for build production
```sh
ng build --prod
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
 
### Generate a new module
```sh
ng generate module modules/category --routing=true
```
### Generate a new component

```sh
ng generate component modules/home/components/categories-carousel --skipImport=true
```
--skipImport=true because we are importing and exporting components in index.ts file

### Generate a new directive

```sh
ng generate directive shared/directives/observe-visibility --skipImport=true
```

### Generate a new service

```sh
ng g service core/services/storage
```
### Generate a new pipe

```sh
ng generate pipe shared/pipe/trim --skipImport=true
```
### Generate a new web worker

```sh
ng g web-worker core/webworker/footer-web-worker
```
## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

<!-- LICENSE -->
## License

2022 @ MResult

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
* [animate.css](https://animate.style/)
* [ngx-loading-bar](https://aitboudad.github.io/ngx-loading-bar/)
* [crypto-js](https://www.npmjs.com/package/crypto-js)
* [GSAP](https://greensock.com/get-started/)
* [lottie-web](https://www.npmjs.com/package/lottie-web)
* [jwt-decode](https://www.npmjs.com/package/jwt-decode)
* [ng-recaptcha](https://www.npmjs.com/package/ng-recaptcha)
* [ngx-owl-carousel-o](https://www.npmjs.com/package/ngx-owl-carousel-o)
* [ngx-pagination](https://www.npmjs.com/package/ngx-pagination)
* [sweetalert2](https://www.npmjs.com/package/sweetalert2)
