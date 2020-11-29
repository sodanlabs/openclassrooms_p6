# Projet 6 du parcours Développeur Web d'OpenClassrooms

This is the full project for the Web Developer path.

### Prerequisites ###

This folder contains the whole project in itself, the backend as well as the frontend  (as git submodule).

You will need to have Git, Node and `npm` installed locally on your machine.

### Installation ###

Clone this repo. From within the project folder, run `git submodule init` to register the path for the frontend folder and then run `git submodule update ` to upload it.
Once you have downloaded the files from the frontend, you must run `npm install` in the frontend folder.

Using particular dependencies, do not hesitate to install the following packages if you encounter errors:
- `npm install -g @angular/cli@7.0.2`
- `npm install node-sass@4.12.0` 

You can then run the Angular Frontend with `ng serve`. The  Angular Live Development Server should run on `localhost:4200`.

For the backend server, run `npm install` to download dependencies, and `node server` to run it.

The server should run on `localhost` with default port `3000`. If the
server runs on another port for any reason, this is printed to the
console when the server starts, e.g. `Listening on port 3001`.