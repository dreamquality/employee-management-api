# Employee Management CRM - Postman Test Collection

This directory contains a comprehensive Postman collection for testing the Employee Management CRM API. The collection includes automated tests for all API endpoints with proper authentication, validation, and error handling.

## 📁 Files

- **Employee-Management-CRM.postman_collection.json** - The main Postman collection with all API requests and tests
- **Employee-Management-CRM.postman_environment.json** - Environment variables template for local testing
- **README.md** - This file

## 🚀 Getting Started

### Prerequisites

- [Postman](https://www.postman.com/downloads/) installed on your machine
- The Employee Management CRM API running locally on `http://localhost:3000`
- PostgreSQL database set up and running

### Installation

1. **Import the Collection**
   - Open Postman
   - Click on "Import" button in the top left
   - Select `Employee-Management-CRM.postman_collection.json`
   - The collection will be imported with all requests and tests

2. **Import the Environment**
   - Click on "Import" button again
   - Select `Employee-Management-CRM.postman_environment.json`
   - The environment will be imported with default variables

3. **Configure Environment Variables**
   - Click on "Environments" in the left sidebar
   - Select "Employee Management CRM - Local"
   - Update the following variables:
     - `baseUrl`: API base URL (default: `http://localhost:3000`)
     - `secretWord`: Your SECRET_WORD from .env file (required for admin registration)
   - Save the environment

4. **Select the Environment**
   - In the top right corner of Postman, select "Employee Management CRM - Local" from the environment dropdown

## 📋 Collection Structure

The collection is organized into the following folders:

### 1. Authentication (5 requests)
- **Register Employee** - Create a new employee account
- **Register Admin** - Create a new admin account (requires secretWord)
- **Login Employee** - Authenticate as employee
- **Login Admin** - Authenticate as admin
- **Login with Invalid Credentials** - Test error handling

### 2. Users (9 requests)
- **Get Current User Profile** - Get authenticated user's profile
- **Get All Users (Admin)** - List all users with pagination and sorting
- **Get User by ID** - Get specific user details
- **Create Employee (Admin)** - Admin creates new employee
- **Update User Profile (Employee)** - Employee updates own profile
- **Update User Profile (Admin)** - Admin updates any user
- **Delete Employee (Admin)** - Admin deletes employee
- **Search Users by Name** - Search users with filters

### 3. Projects (11 requests)
- **Get All Projects** - List all projects with pagination
- **Get Active Projects Only** - Filter active projects
- **Search Projects by Name** - Search projects
- **Create Project (Admin)** - Admin creates new project
- **Get Project by ID** - Get project details
- **Update Project (Admin)** - Admin updates project
- **Assign Employees to Project (Admin)** - Bulk assign employees
- **Add Single Employee to Project (Admin)** - Add one employee
- **Remove Employee from Project (Admin)** - Remove employee assignment
- **Delete Project (Admin)** - Admin deletes project

### 4. Notifications (3 requests)
- **Get All Notifications** - List user's notifications with pagination
- **Filter Notifications by Type** - Filter by notification type
- **Mark Notification as Read** - Mark notification as read

### 5. Error Handling Tests (4 requests)
- **Unauthorized Access - No Token** - Test 401 error
- **Forbidden - Employee Access to Admin Endpoint** - Test 403 error
- **Not Found - Invalid User ID** - Test 404 error
- **Bad Request - Invalid Data** - Test 400 error with validation

## 🔑 Authentication Flow

The collection uses JWT Bearer token authentication. Follow this order for first-time setup:

1. Run **Register Employee** request - Creates an employee account and saves employeeId
2. Run **Register Admin** request - Creates an admin account and saves adminUserId
3. Run **Login Employee** request - Gets JWT token and saves it as `employeeToken`
4. Run **Login Admin** request - Gets JWT token and saves it as `adminToken`

All subsequent requests will automatically use the appropriate token from the environment variables.

## 🧪 Running Tests

### Run Entire Collection

1. Click on the collection name "Employee Management CRM API"
2. Click "Run" button
3. Select the environment "Employee Management CRM - Local"
4. Click "Run Employee Management CRM API"
5. View test results in the runner

### Run Individual Folders

You can run specific test folders:
- Right-click on any folder (e.g., "Authentication", "Users", "Projects")
- Select "Run folder"
- Configure runner settings and click "Run"

### Run Single Request

1. Select any request from the collection
2. Ensure the correct environment is selected
3. Click "Send"
4. View response and test results in the bottom panel

## ✅ Automated Tests

Each request includes automated tests that verify:

- **Status Codes** - Correct HTTP status (200, 201, 400, 401, 403, 404)
- **Response Structure** - Presence of required fields
- **Data Validation** - Correct data types and values
- **Authentication** - Token management and authorization
- **Error Handling** - Appropriate error messages

Tests automatically save important values (IDs, tokens) to environment variables for use in subsequent requests.

## 🔄 Test Execution Order

For best results, run requests in this order:

1. **Authentication folder** - Set up accounts and get tokens
2. **Users folder** - Test user CRUD operations
3. **Projects folder** - Test project management
4. **Notifications folder** - Test notification system
5. **Error Handling Tests folder** - Verify error responses

## 📊 Environment Variables

The collection uses these environment variables (auto-populated during test runs):

| Variable | Description | Set By |
|----------|-------------|--------|
| `baseUrl` | API base URL | Manual |
| `secretWord` | Admin registration secret | Manual |
| `employeeToken` | Employee JWT token | Login Employee |
| `adminToken` | Admin JWT token | Login Admin |
| `employeeId` | Created employee ID | Register Employee |
| `adminUserId` | Created admin user ID | Register Admin |
| `newEmployeeId` | ID of employee created by admin | Create Employee |
| `projectId` | Created project ID | Create Project |
| `notificationId` | Sample notification ID | Get All Notifications |

## 🐛 Troubleshooting

### Connection Refused
- Ensure the API server is running on `http://localhost:3000`
- Check that PostgreSQL database is running
- Verify DATABASE_URL in .env file

### 401 Unauthorized
- Run the login requests first to get valid tokens
- Check that tokens are saved in environment variables
- Tokens may have expired - re-run login requests

### 403 Forbidden
- Ensure you're using admin token for admin-only endpoints
- Check user role in the database

### 404 Not Found
- Verify the resource ID exists
- Run prerequisite requests to create necessary data

### 400 Bad Request
- Check request body format and required fields
- Verify data validation rules (email format, password length, etc.)

## 🔐 Security Notes

- The `secretWord` variable is marked as secret in the environment
- JWT tokens are stored as secret variables
- Never commit environment files with real credentials to version control
- Rotate the `SECRET_WORD` and `JWT_SECRET` in production

## 📝 Additional Resources

- [API Documentation](http://localhost:3000/api-docs) - Swagger/OpenAPI docs
- [Project README](../README.md) - Main project documentation
- [Postman Learning Center](https://learning.postman.com/) - Postman documentation

## 🤝 Contributing

When adding new API endpoints:

1. Add the request to the appropriate folder
2. Include test scripts to validate responses
3. Update this README with the new endpoint
4. Ensure proper authentication is configured
5. Test the entire collection to verify no breaking changes

## 📄 License

This Postman collection is part of the Employee Management CRM project and follows the same MIT license.
