# README #

### What is this repository for? ###

This is our basic stack for infographic creation at Tages-Anzeiger. Feel free to use the public version and develop visualizations with it

## What you need

* NPM
* Gulp

## Setup ##

* Install npm packages

```
npm install
```

## Configuration

To start with a new project, duplicate the `empty` folder in `./content/clone-project` and rename it. Every project has its own `config.json`-File in which you should set the properties (like distributionpath etc.). These files are used in the basic setup:

* app.js (the main Backbone view for your infographic project)
* config.json (some setup things for each project like dist path and so on)
* custom.css (basic css stylings, individually loaded for each project)
* ./data/ (you can add all kind of files here, they will be compiled. datasets, movies, whatever..)
* ./imgs/ (put all your images here
* index.jshtml (we use .jshtml for the template system in backbone, you'll be fine with it, it's basically html)

## Run the local server with Gulp in Console

```
GRAPHIC=projectname gulp
```

As project name please use the folder of your project in `./content/year/..` to run the build. The should now run at <http://localhost:9000> where you can develop and test it.

## Deploy the graphic via Gulp and Console

```
GRAPHIC=projectname ENV=dist gulp build
```

Use the `ENV=dist` variable in the console to create the dist-folder in `builds/` of the repository. This is the one you can now deploy to your server. The Localhost does not run in dist-mode.

## Who do I talk to? ###

* marc.fehr@tages-anzeiger.ch (Twitter: https://twitter.com/mrcfhr)
* kaspar.manz@tages-anzeiger.ch (Twitter: https://twitter.com/xeophin)

Feel free to get in touch with us
<http://www.tages-anzeiger.ch>
