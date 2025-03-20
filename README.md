# Patient Management Application

This application allows managing patients using Electron, Express, and SQL Server. If SQL Server is unavailable, data is stored in `.DBF` files.

## Features

- Search for patients by last name or phone number.
- Create new patients if they do not exist.
- Store data in SQL Server or `.DBF` files in case of connection failure.
- Interface developed with Electron.
- Backend using Express.

## Requirements

- Node.js installed.
- SQL Server (optional if using a SQL database).

## Installation

1. Clone the repository:
   ```sh
   git clone <REPOSITORY_URL>
   cd db-patients-desktop-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

1. Start the Express server:
   ```sh
   node server.js
   ```
2. Start the Electron application:
   ```sh
   npm start
   ```

## Project Structure

```
/db-patients
│-- index.html         # User interface
│-- index.js           # Electron entry point
│-- package.json       # Dependency configuration
│-- package-lock.json  # Version lock
│-- renderer.js        # Frontend logic in Electron
│-- server.js          # Backend with Express
│-- styles.css         # CSS styles
```

## Contributing

If you want to contribute, fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT license.
