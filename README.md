# Jo The Pyro &middot; [![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](http://perso.crans.org/besson/LICENSE.html) [![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)


Play as Jo The Pyro in his quest to rid the evil forest of mutant plant life!
Use Jo's powerful flamethrower to burn his enemies to ash and dust. Be careful
though, using Jo's flamethrower for too long will deplete his fuel and leave
him defenseless.

This is a a web remake of a project I did in high school.

## Developing

### Built With
Jo The Pyro was developed using modern / ES6 JavaScript combined with the Phaser 3
game library. It uses the Parcel library for compiling & building.

The repo used this handy [template](https://github.com/ourcade/phaser3-parcel-template) by ourcade.

### Prerequisites
To work with the repo you will need [Node.js](https://nodejs.org/en/), [npm](https://www.npmjs.com/),
and [Parcel](https://parceljs.org/) installed. I personally installed Node and npm from the nodejs website and then used npm from the command line to install Parcel:
```
npm install -g parcel-bundler
```

### Getting Started
Clone the repo:
```
git clone https://github.com/bdon-htb/jothepyro-js.git
```
Install any dependencies:
```
cd jothepyro-js
npm install
```
To run a development server:
```
npm run start
```
Then open your browser of choice (I suggest in private browsing), and
navigate to localhost:8100 play.

To create a production build:
```
npm run build
```
Where production files will be placed in the `dist` folder.

## Preview Images
![Screenshot of Main Menu](https://github.com/bdon-htb/jothepyro-js/blob/main/preview_images/main_menu.png)

![Gameplay Screenshot](https://github.com/bdon-htb/jothepyro-js/blob/main/preview_images/gameplay.png)

![Game Over Screenshot](https://github.com/bdon-htb/jothepyro-js/blob/main/preview_images/game_over.png)

## Licensing
Jo The Pyro is licensed under the GPL License which you can find [here](https://github.com/bdon-htb/jothepyro-js/blob/main/LICENSE)
