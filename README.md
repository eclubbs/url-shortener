## Hubexo – Technical Exercise
We are looking to understand and discuss your understanding and problem solving style— not to test for perfection. Please aim to spend around 2 hours.
Technical Details

  * Language: TypeScript
  * Framework: Any (Express, NestJS, etc.)
  * Deliverable: GitHub repo or ZIP with README including:
     * Setup instructions
     * Example requests/responses
     * Notes on design or future improvements

## The Task
Create a simple URL Shortening Service that:

  1. Accepts a long URL and returns a shortened version
  2. Redirects short links to the original URL
  3. Handles invalid or empty URLs gracefully
  4. Include automated tests

Optional:

  * Save URLs persistently (e.g. file or database)
  * Add expiry time or click tracking
  * Include automated tests



## The Solution

This project is a [Node.js](https://nodejs.org/en/download/current) project using [Express](https://expressjs.com/) and written in [Typescript](https://www.typescriptlang.org/).

It is a simple service with two endpoints. 

```
GET /:key (where key is a six character alphanumeric)

Response:
A 302 Redirect to the saved URL.

```

### GET Examples

```
Request: 

GET http://localhost:3000/hUbX00

Response:

302 Redirect to https://www.hubexo.com/about

```

Request to a non-existent link
```
Request: 

GET http://localhost:3000/N0X1sT

Response:

404 This link cannot be found. Please verify it was entered correctly and try again.

```

Request to an expired link
```
Request: 

GET http://localhost:3000/eXp1RD

Response:

410 This link has expired and is no longer available.

```

```
POST /urls/add

Request: 

{
    "targetUrl":"[A valid URL to be shortened]",
    "expires": "[(Optional) A valid date string to set the expiry time of the generated link]"
}

Response:

{
    "shortenedUrl":"[The shortened URL that will redirec to the supplied targetUrl]",
    "expires": "[The expiry time of the generated link]"
}

```

### POST Examples

Request without expiry date. Expiry defaults to 1 year from link creation (configurable)

```
Request: 

{
    "targetUrl":"https://www.hubexo.com/about"
}

Response:

{
    "shortenedUrl":"http://localhost:3000/es9xhc",
    "expires": "2027-02-23T23:05:01.667Z"
}

```

Request with expiry date
```
Request: 

{
    "targetUrl":"https://www.hubexo.com/about",
    "expires": "2026-02-22T15:38:18.643Z"
}

Response:

{
    "shortenedUrl":"http://localhost:3000/es9xhc",
    "expires": "2026-02-22T15:38:18.643Z"
}

```



The created links are persisted in the `/repos/common/database.json` file. This file also tracks how often and how recently a link has been visited via `visitCount` and `lastVisited` properties.


## Setup

This project builds on the [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript) package.

To setup, first ensure you have an up-to-date version of Node.js and npm installed. Navigate to the root folder of the project in a terminal program of your choice and run the following:

### `npm install`

Once installed you can run the service in development mode via the commands:

### `npm run dev` or `npm run dev:watch`

The latter will use nodemon to automatically reload the server if any code changes are made.

Once the service is running it will be accessible at the address `http://localhost:3000'.
You can test the redirect is working by visiting the pre-created short link: 'http://localhost:3000/RiKa5t'.
Example calls to the service can be found in the included Postman file (`Hubexo CodeTest.postman_collection.json`).


The following additional npm commands are also available:

### `npm run clean-install`

Remove the existing `node_modules/` folder, `package-lock.json`, and reinstall all library modules.

### `npm test`

Run unit-tests with <a href="https://vitest.dev/guide/">vitest</a>.

### `npm run lint`

Check for linting errors.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm run type-check`

Check for typescript errors.

### Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`.


## Future improvements

Moving forward, this service could be improved by the following actions:

* Implementation of SSL.
* Moving persistence into a lightweight database, for improved speed and robustness of access and storage.
* Expanding click tracking into its own database table, capturing user details from request headers to enable the data to be analysed. 
* Adding user authentication to allow users to review their created links, see how they are performing, and delete them or alter the expiry date(s).
* Admin user authentication and new endpoints that aid the easy managing of the data (link editing/deletion, user CRUD).
* Adding Swagger for greater visibility and understanding of the endpoints.





