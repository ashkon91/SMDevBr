# Streamrunner Dev

Automating the details of stream production

----
### Structure

As of now, only the React front-end and Express API server are set up. React lives in the `client` directory, Express in `server`

----
### Setting up for development

* Clone this repository
* Navigate to the `client` and `server` directories and `npm install` separately in each
* Run `npm start` in `server` to start the Express.js API **without Firebase access** on localhost:3001, and in `client` to run the webpack dev server on :8080/streamrunner. 
* To start the Express API with Firebase access, I will need to grant you credentials- afterwards, start the API from the root folder by running `npm run-script api`. You will need to place the JSON file with credentials in the directory above your root.

----
###### Questions? webermn15@gmail.com