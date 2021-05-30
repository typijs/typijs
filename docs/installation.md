---
layout: default
title: Installation
nav_order: 2
---

# Installation

## Prerequisites
Must install:
* Node.js version 10+ or later
* MongoDB latest
  
Optional:
* MongoDB Compass Community (Optional)
* Visual Studio Code

## Module dependency

```mermaid
    graph TD
    A(cms core)-->B(cms modules)
    B-->C(cms portal)
    C-->Z(cms demo)
    X(cms api)-->Z

```

## How to setup for development

### Setup Npm Symlinks

For running in local, you need set up the [symlinks](https://docs.npmjs.com/cli/link.html) between modules as below:

1. Go to `cms-api` folders and run command 
```
    npm install
    npm link
    npm run build
``` 

2. Go to `cms-server` folder and run commands

```
    npm install
    npm link @typijs/api
```

### Run in Dev Mode

1. Backup the DB: After the MongDb instance running, you can use the example data under the `resources/db/dump/vegefoods_v2` using the MongoDb command `mongorestore` to backup these collections

For example, under the `resources/db` folder, run command line 

```
mongorestore -d vegefoods_v2 dump/vegefoods_v2

``` 
to restore from a dump directory to a local mongod instance running on port 27017:

2. First step, under `cms-server` folder, run the command
```
    npm run dev
```

This command will run script to connect to mongo db, so make sure you have the correct path to your db.
For example, you have the db path like as `C:/MongoDB/data/db`
```
    mongod --dbpath C:/MongoDB/data/db
```

> If you install the MongoDB and run it as the service in Window, you can skip this step

3. Final step, under `cms` folder, run the command sequentially
```
    npm install
    ng build core
    ng build modules
    ng build portal
    npm run dev
```
> Make sure you installed Angular CLI with `--global`

Now you can goto http://localhost:4200 to see the site.

The admin site will be access via url: http://localhost:4200/typijs

**Account: admin/1234qwer!**

### Run Angular Universal (SSR) in Dev mode

```
    npm install
    ng build core
    ng build modules
    ng build portal
    ng build
    ng run cms-demo:server
```
Copy three folders `dist\core`, `dist\modules` and `dist\portal` into `cms\node_modules\@typijs` folder then run this script to start Server Site Render

```
    npm run start:ssr
```

If there is any change these libs `core` or `modules` or `portal` need to run build for each lib again then run 

```
ng run cms-demo:server
```

and start server site again