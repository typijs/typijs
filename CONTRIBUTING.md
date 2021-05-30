# Contributing to TypiJS

🙏 We would ❤️ for you to contribute to TypiJS and help make it even better than it is today!

## Developing

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

> Make sure you installed Angular CLI with `--global`

* Install packages
  ```sh
    npm install
  ```

* Build packages
    ```sh
        ng build core
        ng build modules
        ng build portal
    ```
    Or if you want to build in watch mode, need open three terminal to run these command. You can use multi terminals in Visual Studio Code, see https://code.visualstudio.com/docs/editor/integrated-terminal
    
    1. Open first terminal, run `ng build core --watch` and waiting it finish then go to next step 
    2. Open second terminal, run `ng build module --watch` and waiting it finish then go to next step
    3. Open third terminal, run `ng build portal --watch` and waiting it finish then go to next step


* Run in watch mode
  ```sh
    npm run dev
  ```

Now you can goto http://localhost:4200 to see the site.

The admin site will be access via url: http://localhost:4200/typijs

**Account: admin/1234qwer!**

## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All features or bug fixes **must be tested** by one or more specs (unit-tests).
- All public API methods **must be documented**.

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the Lib changelog**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/angular/angular/commits/master))

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js
