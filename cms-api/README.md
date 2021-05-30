
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://www.typijs.com">
    <img src="https://raw.githubusercontent.com/typijs/typijs.github.io/main/assets/imgs/typijs-logo-with-text.png" alt="Logo">
  </a>

  <h3 align="center">TypiJS API Package</h3>

  <p align="center">
    The API package is part of TypiJS Framework
    <br />
    <a href="https://www.typijs.com"><strong>Explore the framework »</strong></a>
    <br />
    <br />
    <a href="https://github.com/typijs/typijs/issues">Report Bug</a>
    ·
    <a href="https://github.com/typijs/typijs/issues">Request Feature</a>
  </p>
</p>


<!-- ABOUT THE PROJECT -->
## TypiJS

The Angular CMS Framework for building fully-featured SPA sites powered by NodeJS and MongoDB with TypeScript. 

It includes 4 packages:
* `@typijs/core` - provides the decorators, injection tokens, base classes to create content type
* `@typijs/modules` - provides the plugged-in module such as Page tree, Block tree, Media..
* `@typijs/portal` - provide the UI layout to access editor, admin
* `@typijs/api` - provide the apis to manipulate the content data which stored in MongoDB

### Built With

Build on top modern stacks with TypeScript

* [Angular](https://angular.io)
* [ExpressJS](https://expressjs.com)
* [NodeJS](https://nodejs.org)
* [MongoDB](https://www.mongodb.com)

## TypiJS API

This package `@typijs/api` provides the apis to manipulate the content data which stored in MongoDB

### Built with

* ExpressJS - The NodeJS framework
* Mongoose - The MongoDB ODM

### Features

* Api to create/update/delete/publish content data (page, block, media)
* Api to manipulate data such as site definition, user, language
* Built-in authentication and authorize
* Upload and store Media/File support multi provider (Local and Cloud)
* The mechanism cache support multi cache provider
* The clear log incase exception
* Decorators to validate request, cache, authorize

<!-- GETTING STARTED -->
## Getting Started

To start the site build with TypiJS, following theses steps

### Prerequisites

* Node 10.x or higher
* Express 4.x or higher
* Typescript 4.1.5
* MongoDB latest

### Quick start

1. Clone the repo
   ```sh
   git clone https://github.com/typijs/typijs-starter.git
   cd typijs-starter
   ```
2. Under `server` folder run script
    ```sh
    npm install
    npm run dev
    ```
3. Under `client` folder run script
    ```sh
    npm install
    npm start
    ```
4. Navigate to http://localhost:4200/typijs/register to create admin user
5. See how setup site at video https://www.youtube.com/watch?v=PBKFrZ5Qq1Y
    
<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Email: contact@typijs.com

Project Link: [https://github.com/typijs/typijs](https://github.com/typijs/typijs)

