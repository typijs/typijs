# Angular Cms

The cms based on Angular, NodeJs and MongoDB

## Prerequisites
Need to install
* Node.js version 10.9.0 or later
* MongoDB

## Module dependency

```mermaid
    graph TD
    A(cms core)-->B(cms properties)
    B-->C(cms modules)
    C-->D(cms editor)
    D-->E(cms portal)
    E-->Z(cms examples)
    X(cms api)-->Z

```

## How to run in dev mode

### Setup Npm Symlinks

For running examples, we need set up the [symlinks](https://docs.npmjs.com/cli/link.html) between modules as below:

1. Go to `cms-api` folders and run command 
```
    npm link
``` 

2. Go to `cms-server` folder and run commands

```
    npm link @angular-cms/api
```

### Run in Dev Mode

1. Final step, under `cms-server` folder and run command
```
    npm run dev
```

2. Final step, under `cms` folder and run command
```
    npm run dev
```

## Versioning

We are current on Alpha

## Authors

* **Hung Dang Viet** - *Initial work and maintain* - [danghung1202](https://github.com/danghung1202)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Inspiration from Episerver

## Notes



