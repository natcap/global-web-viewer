# Project was created using the Create React App setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

# Deployment
This project uses a Docker container and nginx server to build and deploy
the web application via Google Cloud Run.

## Deployment Scripts
Although this project is set up to run continuous deployment through
Google Cloud Build on changes to the `main` branch, you can deploy via
the command line locally. You will need to have Google Cloud command line
utitilies set up and have permissions to a Google Cloud project.

### deploy.sh
One step script to build the docker container and deploy to Google Cloud Run.

### cloud-run-cleanup.sh
One step script to tear down and remove the Google Cloud Run service.
