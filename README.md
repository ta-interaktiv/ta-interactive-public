# README #

### What is this repository for? ###

Interaktive Inhalte für die Publikation auf Tagesanzeiger.ch

## Voraussetzungen

- NPM
- Gulp

## Setup ##

* NPM-Packages installieren

```
npm install
```

* update the system: `git submodule init && git submodule update`

* get the newest system commits: `cd system/ && git pull origin master && cd ..`

## Konfiguration

Jede Visualisierung hat ein `config.json`-File, in dem einige Konfigurationseinstellungen vorgenommen werden kann.

((Auflistung der vorhandenen Konfigurationsoptionen))

## Testing

```
GRAPHIC=visualisierungsname gulp
```

Der `Default`-Task in Gulp kompiliert das Projekt lässt einen Server unter <http://localhost:9000> laufen, wo das Projekt getestet werden kann.

## Deployment

```
GRAPHIC=visualisierungsname ENV=dist gulp build
```

Die Daten werden unter `builds/visualisierungsname/dist` abgelegt und können von dort auf den Server kopiert werden.


## Who do I talk to? ###

* ruedi.luethi@tages-anzeiger.ch
* marc.fehr@tages-anzeiger.ch
* kaspar.manz@tages-anzeiger.ch