# README #

### What is this repository for? ###

This is our basic stack for infographic creation at Tages-Anzeiger. Feel free to use the public version and develop visualizations with it

## What you need

- NPM
- Gulp

## Setup ##

* Install npm packages

```
npm install
```

## Configuration

Every project has its own `config.json`-File in which you should set the properties (like distributionpath etc.)

## Run the local server with Gulp in Console

```
GRAPHIC=projectname gulp
```

As project name please use the folder of your project in `./content/year/..` to run the build. The should now run at <http://localhost:9000> where you can develop and test it.

## Deploy the graphic via Gulp and Console

```
GRAPHIC=visualisierungsname ENV=dist gulp build
```

Use the `ENV=dist` variable in the console to create the dist-folder in `builds/` of the repository. This is the one you can now deploy to your server. The Localhost does not run in dist-mode.

## Who do I talk to? ###

* marc.fehr@tages-anzeiger.ch
* kaspar.manz@tages-anzeiger.ch

Feel free to get in touch with us
<http://www.tages-anzeiger.ch>
