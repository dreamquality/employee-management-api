# Quick Start Guide - Postman Collection

This is a quick start guide to get you up and running with the Postman collection in 5 minutes.

## Step 1: Import Collection & Environment

1. Open Postman Desktop App or Postman Web
2. Click **Import** button (top left)
3. Drag and drop these two files:
   - `Employee-Management-CRM.postman_collection.json`
   - `Employee-Management-CRM.postman_environment.json`
4. Click **Import**

## Step 2: Configure Environment

1. Click **Environments** in the left sidebar
2. Select **"Employee Management CRM - Local"**
3. Update these variables:
   - `baseUrl`: Keep as `http://localhost:3000` (or change if your API runs elsewhere)
   - `secretWord`: Set to your SECRET_WORD from the `.env` file
4. Click **Save**
5. Select this environment from the dropdown in top-right corner

## Step 3: Start the API Server

Make sure your API server is running:

```bash
# From the repository root
npm run dev
```

The server should start on `http://localhost:3000`

## Step 4: Run the Authentication Requests

These must be run in order to set up test data and get authentication tokens:

1. Open the collection **"Employee Management CRM API"**
2. Expand the **"Authentication"** folder
3. Run these requests in order:
   - ✅ **Register Employee** (creates test employee)
   - ✅ **Register Admin** (creates test admin)
   - ✅ **Login Employee** (gets employee token)
   - ✅ **Login Admin** (gets admin token)

After running these, your environment will have:
- `employeeToken` - JWT for employee requests
- `adminToken` - JWT for admin requests
- `employeeId` - ID of the employee account
- `adminUserId` - ID of the admin account

## Step 5: Test Any Endpoint

Now you can run any request in the collection! Try these:

- **Users** → **Get Current User Profile** (employee access)
- **Users** → **Get All Users (Admin)** (admin access)
- **Projects** → **Create Project (Admin)** (creates a test project)
- **Notifications** → **Get All Notifications** (view notifications)

## Step 6: Run the Full Collection (Optional)

To run all tests at once:

1. Click on the collection name **"Employee Management CRM API"**
2. Click **Run** button on the right
3. Ensure **"Employee Management CRM - Local"** environment is selected
4. Click **Run Employee Management CRM API**
5. Watch all 30 tests execute with results

## What Gets Tested?

Each request includes automated tests that verify:

- ✅ Correct HTTP status codes (200, 201, 400, 401, 403, 404)
- ✅ Response structure (all required fields present)
- ✅ Data validation (correct types and values)
- ✅ Authentication (tokens work correctly)
- ✅ Authorization (role-based access control)
- ✅ Error handling (appropriate error messages)

## Troubleshooting

**Problem: Connection refused**
- Solution: Make sure API server is running on `http://localhost:3000`

**Problem: 401 Unauthorized**
- Solution: Run the login requests to get fresh tokens

**Problem: 403 Forbidden on admin endpoints**
- Solution: Make sure you're using `{{adminToken}}` not `{{employeeToken}}`

**Problem: secretWord error during admin registration**
- Solution: Update `secretWord` in environment to match your `.env` file

## Next Steps

- Read the full [Postman README](README.md) for detailed documentation
- Explore the [API Documentation](http://localhost:3000/api-docs) 
- Add your own custom tests to the requests
- Create additional test scenarios

## Collection Statistics

- **Total Requests**: 30
- **Authentication**: 5 requests
- **Users**: 8 requests  
- **Projects**: 10 requests
- **Notifications**: 3 requests
- **Error Handling**: 4 requests

---

Need help? Check the [main README](README.md) or [project documentation](../README.md).
