# Issues that were resolved

# Issue 1: Frontend – Backend Connection Failure

During the execution of the application Habit Tracker, the frontend was unable to communicate with the backend API, displaying a connection error (ERR_CONNECTION_REFUSED).

# Issue 2: Backend Startup Failure

The backend server failed to start due to an incompatibility between the ES Modules configuration in package.json and the use of CommonJS syntax (require) in the server code.

When running the command:

node server.js

the following error was displayed:

ReferenceError: require is not defined in ES module scope

This occurred because the package.json file contained:

"type": "module"

The issue was resolved by removing this configuration from package.json.

# Issue 3: Missing Backend Dependencies

During backend execution, it was identified that several required project dependencies were missing, including:

Express
CORS
MySQL2
dotenv
bcrypt
jsonwebtoken

These packages were installed using the following commands:

-npm install express cors mysql2 dotenv
-npm install bcrypt jsonwebtoken

and were added to the project's package.json configuration.

# Issue 4: Database Connection Failure

After successfully starting both the frontend and backend applications, an error occurred during user registration.

Testing revealed a failure to connect to the MySQL database (ECONNREFUSED on port 3306),
confirming that the integration testing process successfully validated frontend-backend 
communication and identified the final point of failure within the system architecture.


