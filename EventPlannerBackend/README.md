# EventPlannerBackend

This is the backend server for the EventPlanner project. To use this server, you need to have MySQL installed and added to your system's PATH.

Please make sure MySQL is installed before proceeding.

## Server

To start the backend server once everything is set up, run the following command:

```bash
npm start 
```
Alternatively, you can execute the start-backend.ps1 script, which will also take care of initializing the SQL database.

Once the server is running, the frontend can fetch the data.

## Running unit tests

The backend tests are written using Supertest and Jest. A separate MySQL database named event_management_tests is required to run the tests. 
Running the sart-backend.ps1 will ask if the test-database should be initiated.
If the user agrees to do so, the test database will be initiated as well.

To run the unit tests, execute the following command:

```bash
npm test
```
