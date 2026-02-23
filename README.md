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






## Setup

This project builds on the [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript) package.
The following commands are available.


## Available Scripts

### `npm run clean-install`

Remove the existing `node_modules/` folder, `package-lock.json`, and reinstall all library modules.

### `npm run dev` or `npm run dev:watch` (hot reloading)

Run the server in development mode.<br/>

**IMPORTANT** development mode uses `swc` for performance reasons which DOES NOT check for typescript errors. Run `npm run type-check` to check for type errors. NOTE: you should use your IDE to prevent most type errors.

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

## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`.
