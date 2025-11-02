# Testing Guide - Postman Collection

This guide provides detailed information about testing the Employee Management CRM API using the Postman collection.

## Table of Contents

1. [Test Coverage Overview](#test-coverage-overview)
2. [Running Tests](#running-tests)
3. [Understanding Test Results](#understanding-test-results)
4. [Test Scenarios](#test-scenarios)
5. [Continuous Integration](#continuous-integration)
6. [Troubleshooting Tests](#troubleshooting-tests)

## Test Coverage Overview

The Postman collection provides comprehensive test coverage for all API endpoints:

### Coverage Statistics

- **Total Requests**: 30
- **Requests with Tests**: 30 (100%)
- **Test Scenarios**: 90+ individual assertions
- **API Endpoints Covered**: All available endpoints

### Test Categories

1. **Happy Path Tests** (22 requests)
   - Valid data inputs
   - Successful operations
   - Correct responses

2. **Error Handling Tests** (8 requests)
   - Invalid credentials
   - Missing authentication
   - Authorization failures
   - Validation errors
   - Resource not found

### What Gets Tested

Each request validates:

✅ **HTTP Status Codes**
- 200 OK for successful GET/PUT/PATCH/DELETE
- 201 Created for successful POST
- 400 Bad Request for validation errors
- 401 Unauthorized for missing/invalid tokens
- 403 Forbidden for insufficient permissions
- 404 Not Found for missing resources

✅ **Response Structure**
- Required fields are present
- Optional fields when applicable
- Proper nesting of data

✅ **Data Validation**
- Correct data types (string, number, boolean, array, object)
- Expected values match requests
- IDs are integers
- Dates are properly formatted

✅ **Authentication & Authorization**
- JWT tokens are properly formatted
- Tokens are saved to environment
- Role-based access control works
- Protected endpoints require authentication

✅ **Business Logic**
- Created resources have correct data
- Updates modify the correct fields
- Deletions remove resources
- Searches return filtered results
- Pagination works correctly

## Running Tests

### Option 1: Run Entire Collection

Run all 30 tests in sequence:

1. Click on collection name "Employee Management CRM API"
2. Click **Run** button
3. Configure runner:
   - Select environment: "Employee Management CRM - Local"
   - Keep all requests checked
   - Set delay if needed (e.g., 100ms between requests)
4. Click **Run Employee Management CRM API**

**Expected Result**: All tests should pass if the API is running correctly.

### Option 2: Run by Folder

Run tests for specific functionality:

**Authentication Tests** (5 tests)
```
Right-click "Authentication" folder → Run folder
```
Tests user registration and login flows.

**User Management Tests** (8 tests)
```
Right-click "Users" folder → Run folder
```
Tests CRUD operations for users.

**Project Management Tests** (10 tests)
```
Right-click "Projects" folder → Run folder
```
Tests project creation, updates, and employee assignments.

**Notification Tests** (3 tests)
```
Right-click "Notifications" folder → Run folder
```
Tests notification retrieval and status updates.

**Error Handling Tests** (4 tests)
```
Right-click "Error Handling Tests" folder → Run folder
```
Tests various error scenarios.

### Option 3: Run Individual Requests

Test specific endpoints:

1. Select any request
2. Click **Send**
3. View test results in the **Test Results** tab

## Understanding Test Results

### Test Result Interface

After running tests, you'll see:

```
✓ Status code is 200
✓ Response has user data
✓ Password is not exposed
```

- **Green checkmark (✓)**: Test passed
- **Red X (✗)**: Test failed
- **Number**: Pass/Fail count

### Example Test Output

**Successful Test Run:**
```
Authentication
  ✓ Register Employee (201 Created)
    ✓ Status code is 201
    ✓ Response has userId
    ✓ Response has success message
  ✓ Login Employee (200 OK)
    ✓ Status code is 200
    ✓ Response has token
    ✓ Token is a valid JWT
```

**Failed Test Example:**
```
Users
  ✗ Get All Users (Admin) (401 Unauthorized)
    ✓ Status code is 200  ← FAILED
    Expected 200 but got 401
```

### Reading Test Scripts

Each request has test scripts that look like this:

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has user data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('email');
});
```

## Test Scenarios

### Scenario 1: Complete User Lifecycle

Tests the full lifecycle of a user account:

1. **Register Employee** - Creates account
2. **Login Employee** - Authenticates
3. **Get Current User Profile** - Views profile
4. **Update User Profile** - Modifies data
5. **Get User by ID** - Retrieves updated data
6. **Delete Employee** - Removes account

**Run Order**: Execute requests in sequence

### Scenario 2: Project Management Flow

Tests project creation and employee assignments:

1. **Create Project (Admin)** - Creates new project
2. **Get Project by ID** - Retrieves project
3. **Assign Employees to Project** - Adds team members
4. **Update Project** - Modifies project details
5. **Remove Employee from Project** - Removes team member
6. **Delete Project** - Cleans up

**Run Order**: Execute requests in sequence

### Scenario 3: Authentication & Authorization

Tests security and access control:

1. **Login with Invalid Credentials** - Tests auth failure
2. **Unauthorized Access - No Token** - Tests missing auth
3. **Forbidden - Employee Access to Admin Endpoint** - Tests RBAC
4. **Get All Users (Admin)** - Tests admin access

**Run Order**: Can run in any order

### Scenario 4: Data Validation

Tests input validation:

1. **Bad Request - Invalid Data** - Invalid email/password
2. **Not Found - Invalid User ID** - Non-existent resource
3. **Create Employee (Admin)** - Valid data structure
4. **Update User Profile** - Partial updates

**Run Order**: Can run in any order

## Continuous Integration

### Using Newman CLI

Newman is Postman's CLI tool for running collections in CI/CD:

**Installation:**
```bash
npm install -g newman
```

**Run Collection:**
```bash
newman run postman/Employee-Management-CRM.postman_collection.json \
  -e postman/Employee-Management-CRM.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

**With HTML Report:**
```bash
npm install -g newman-reporter-html
newman run postman/Employee-Management-CRM.postman_collection.json \
  -e postman/Employee-Management-CRM.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export report.html
```

### GitHub Actions Example

Create `.github/workflows/postman-tests.yml`:

```yaml
name: Postman API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: my_database
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Start API server
        run: npm run dev &
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_NAME: my_database
          DB_USER: postgres
          DB_PASSWORD: postgres
          JWT_SECRET: test_secret
          SECRET_WORD: test_secret_word
      
      - name: Wait for API to be ready
        run: |
          sleep 5
          curl --retry 10 --retry-delay 2 http://localhost:3000
      
      - name: Install Newman
        run: npm install -g newman
      
      - name: Run Postman Collection
        run: |
          newman run postman/Employee-Management-CRM.postman_collection.json \
            -e postman/Employee-Management-CRM.postman_environment.json \
            --env-var "secretWord=test_secret_word" \
            --reporters cli,json \
            --reporter-json-export test-results.json
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: postman-test-results
          path: test-results.json
```

## Troubleshooting Tests

### Common Issues and Solutions

#### Issue: All tests fail with connection errors

**Symptom:**
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solution:**
- Verify API server is running: `curl http://localhost:3000`
- Check server logs for errors
- Ensure correct `baseUrl` in environment

#### Issue: 401 Unauthorized errors

**Symptom:**
```
✗ Status code is 200
  Expected 200 but got 401
```

**Solution:**
- Run login requests first to get fresh tokens
- Check token expiration time
- Verify JWT_SECRET in .env matches

#### Issue: Tests pass individually but fail in collection

**Symptom:**
Tests work when run one-by-one but fail in collection runner.

**Solution:**
- Add delays between requests (100-500ms)
- Check for test data conflicts (unique email constraints)
- Run authentication tests first
- Clear database between runs if needed

#### Issue: Random test failures

**Symptom:**
Tests fail intermittently, passing on re-run.

**Solution:**
- Increase request timeout in Postman settings
- Add delays between requests
- Check database connection pool limits
- Verify server resources (CPU, memory)

#### Issue: Environment variables not updating

**Symptom:**
Variables like `employeeId` or tokens are empty.

**Solution:**
- Check test scripts are saving variables:
  ```javascript
  pm.environment.set("variableName", value);
  ```
- Ensure environment is selected in top-right dropdown
- Save environment after changes

### Best Practices for Testing

1. **Always run Authentication folder first**
   - This sets up required tokens and user IDs

2. **Use fresh database for consistent results**
   ```bash
   npm run reset-db:dev
   ```

3. **Run tests in order**
   - Some tests depend on data from previous tests
   - Use collection runner for proper sequencing

4. **Monitor server logs**
   - Watch for errors during test runs
   - Check database connection issues

5. **Keep environment updated**
   - Update `secretWord` to match .env
   - Use different environments for dev/staging/prod

6. **Review failed tests carefully**
   - Check response body for error messages
   - Verify request body format
   - Ensure proper authentication

## Additional Resources

- [Postman Learning Center](https://learning.postman.com/)
- [Writing Tests in Postman](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Newman CLI Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [Project README](../README.md)
- [API Documentation](http://localhost:3000/api-docs)

---

Happy Testing! 🧪
