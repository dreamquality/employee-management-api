# Bug Fixes and Edge Cases - Documentation

This document details all bugs and edge cases found and fixed in the employee-management-crm application.

## Table of Contents
1. [Critical Security & Data Integrity Issues](#critical-security--data-integrity-issues)
2. [Input Validation Issues](#input-validation-issues)
3. [Data Handling Issues](#data-handling-issues)
4. [Missing Features](#missing-features)
5. [Test Coverage](#test-coverage)

---

## Critical Security & Data Integrity Issues

### 1. Email Case Sensitivity Bug
**Severity:** HIGH  
**Impact:** Users could create duplicate accounts with same email in different cases

**Problem:**
```javascript
// Before: email comparison was case-sensitive
const existingUser = await db.User.findOne({ where: { email } });
```

**Solution:**
```javascript
// After: normalize email to lowercase
const normalizedEmail = email.toLowerCase();
const existingUser = await db.User.findOne({ where: { email: normalizedEmail } });
```

**Fixed in:**
- `controllers/authController.js` - register and login
- `controllers/userController.js` - updateProfile and createEmployee

**Test coverage:** `tests/edge-cases.test.js` - Edge Case 1

---

### 2. JWT Token Expiration Handling
**Severity:** MEDIUM  
**Impact:** Generic error messages for expired tokens, poor user experience

**Problem:**
```javascript
// Before: all JWT errors returned same message
catch (err) {
  return res.status(403).json({ error: 'Недействительный токен' });
}
```

**Solution:**
```javascript
// After: specific error handling for different JWT error types
if (err.name === 'TokenExpiredError') {
  return res.status(401).json({ error: 'Токен истек', expiredAt: err.expiredAt });
} else if (err.name === 'JsonWebTokenError') {
  return res.status(403).json({ error: 'Недействительный токен' });
} else if (err.name === 'NotBeforeError') {
  return res.status(403).json({ error: 'Токен еще не активен' });
}
```

**Fixed in:** `middleware/authenticateToken.js`

**Test coverage:** `tests/edge-cases.test.js` - Edge Case 2

---

### 3. Configuration Security Warnings
**Severity:** CRITICAL  
**Impact:** Production deployments might use default secrets

**Problem:**
```javascript
// Before: silent fallback to default secrets
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  secretWord: process.env.SECRET_WORD || 'default_secret_word',
};
```

**Solution:**
```javascript
// After: validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not set.');
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
}
```

**Fixed in:** `config/appConfig.js`

**Test coverage:** `tests/edge-cases.test.js` - Edge Case 12

---

### 4. Race Condition in Notification Service
**Severity:** HIGH  
**Impact:** Duplicate notifications could be created

**Problem:**
```javascript
// Before: check and create were separate operations
const existingNotification = await db.Notification.findOne({ where: {...} });
if (!existingNotification) {
  await db.Notification.create({...});
}
```

**Solution:**
```javascript
// After: use transaction with lock
const transaction = await db.sequelize.transaction();
const existingNotification = await db.Notification.findOne({
  where: {...},
  lock: transaction.LOCK.UPDATE,
  transaction,
});
if (!existingNotification) {
  await db.Notification.create({...}, { transaction });
}
await transaction.commit();
```

**Fixed in:** `services/notificationService.js` - sendNotificationToAdmins function

---

### 5. Salary Increase Race Condition
**Severity:** HIGH  
**Impact:** Multiple simultaneous salary increases could occur

**Problem:**
```javascript
// Before: no transaction lock
if (daysUntilNextIncrease <= 0 && user.salary < 1500) {
  const newSalary = Math.min(user.salary + 200, 1500);
  await user.update({ salary: newSalary });
}
```

**Solution:**
```javascript
// After: transaction lock prevents double increments
const transaction = await db.sequelize.transaction();
await user.reload({ lock: transaction.LOCK.UPDATE, transaction });
if (user.salary < 1500) {
  const recalculatedSalary = Math.min(user.salary + 200, 1500);
  await user.update({ salary: recalculatedSalary }, { transaction });
}
await transaction.commit();
```

**Fixed in:** `services/notificationService.js` - checkSalaryIncreaseNotifications function

---

## Input Validation Issues

### 6. Missing addEmployee Endpoint Validation
**Severity:** MEDIUM  
**Impact:** Invalid employee IDs could cause database errors

**Problem:**
Route accepted any employeeId without validation

**Solution:**
Created validation middleware:
```javascript
exports.addEmployeeValidation = [
  body('employeeId')
    .isInt({ min: 1 })
    .withMessage('employeeId must be a positive integer'),
];
```

**Fixed in:** 
- `validations/projectValidation.js` - new validation
- `routes/projectRoutes.js` - applied validation

**Test coverage:** `tests/edge-cases.test.js` - Edge Case 5

---

### 7. Missing Notification Pagination Validation
**Severity:** MEDIUM  
**Impact:** Invalid query parameters could cause errors

**Problem:**
No validation for notification list query parameters

**Solution:**
Created comprehensive validation:
```javascript
exports.notificationListValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(['createdAt', 'type']),
  query('order').optional().isIn(['ASC', 'DESC']),
];
```

**Fixed in:**
- `validations/notificationValidation.js` - new validation file
- `routes/notificationRoutes.js` - applied validation

**Test coverage:** `tests/edge-cases.test.js` - Edge Case 6

---

### 8. Missing User ID Validation
**Severity:** MEDIUM  
**Impact:** Routes accepted invalid user IDs causing NaN comparisons

**Problem:**
```javascript
// No validation before parseInt
if (req.user.userId === parseInt(userId)) { ... }
```

**Solution:**
Added validation for all user ID route parameters:
```javascript
exports.userIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
];
```

**Fixed in:**
- `validations/userValidation.js` - new validation
- `routes/userRoutes.js` - applied to PUT, GET, DELETE routes

**Test coverage:** `tests/edge-cases.test.js` - Edge Case 11

---

### 9. Pagination Edge Cases
**Severity:** LOW  
**Impact:** Invalid pagination parameters could cause unexpected behavior

**Problem:**
```javascript
// Before: no bounds checking
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
```

**Solution:**
```javascript
// After: ensure positive values and reasonable limits
let page = parseInt(req.query.page) || 1;
let limit = parseInt(req.query.limit) || 10;
page = Math.max(1, page);
limit = Math.max(1, Math.min(100, limit));
```

**Fixed in:**
- `controllers/userController.js` - getEmployees
- `controllers/projectController.js` - getProjects
- `controllers/notificationController.js` - getNotifications

**Test coverage:** `tests/edge-cases.test.js` - Edge Case 3

---

## Data Handling Issues

### 10. VacationDates Array Inconsistency
**Severity:** MEDIUM  
**Impact:** Single vacation date string could be stored instead of array

**Problem:**
```javascript
// Could accept string or array inconsistently
vacationDates: req.body.vacationDates
```

**Solution:**
```javascript
// Ensure always an array
if (vacationDates && !Array.isArray(vacationDates)) {
  processedVacationDates = [vacationDates];
}
```

**Fixed in:**
- `controllers/userController.js` - updateProfile and createEmployee

**Test coverage:** `tests/edge-cases.test.js` - Edge Case 4

---

## Missing Features

### 11. Missing getProjectEmployees Endpoint
**Severity:** LOW  
**Impact:** No way to list employees assigned to a project

**Problem:**
Route was mentioned in README but endpoint didn't exist

**Solution:**
Implemented complete endpoint:
```javascript
exports.getProjectEmployees = async (req, res, next) => {
  const project = await db.Project.findByPk(projectId, {
    include: [{
      model: db.User,
      as: 'employees',
      attributes: req.user.role === 'admin' 
        ? ['id', 'firstName', 'lastName', 'email', 'position', 'salary']
        : ['id', 'firstName', 'lastName', 'email', 'position'],
    }],
  });
  res.json({ employees: project.employees });
};
```

**Fixed in:**
- `controllers/projectController.js` - new controller method
- `routes/projectRoutes.js` - new GET route

**Test coverage:** `tests/edge-cases.test.js` - Edge Case 7

---

## Test Coverage

### Created Comprehensive Test Suite
**File:** `tests/edge-cases.test.js`

**Test Suites:**
1. Email Case Insensitivity (3 tests)
2. JWT Token Expiration Handling (2 tests)
3. Pagination Edge Cases (5 tests)
4. VacationDates Array Handling (2 tests)
5. Project Employee Management Validation (4 tests)
6. Notification Pagination Validation (3 tests)
7. Project Employees Endpoint (3 tests)
8. Invalid Project/Employee IDs (2 tests)
9. Email Update Edge Cases (1 test)
10. Empty String Validation (2 tests)
11. User ID Validation (5 tests)
12. Configuration Security (2 tests)

**Total:** 34 new edge case tests

---

## Summary Statistics

- **Total bugs fixed:** 11
- **New test files created:** 1
- **New validation files created:** 1
- **Controllers modified:** 4
- **Routes modified:** 3
- **Services modified:** 1
- **Config files modified:** 1
- **Total new tests:** 34

## Severity Breakdown

- **CRITICAL:** 1 (Configuration security)
- **HIGH:** 3 (Email case sensitivity, notification race condition, salary race condition)
- **MEDIUM:** 5 (JWT handling, addEmployee validation, notification validation, user ID validation, vacationDates)
- **LOW:** 2 (Pagination edge cases, missing endpoint)

## Impact Assessment

All bugs have been fixed with:
- ✅ Proper input validation
- ✅ Transaction safety for critical operations
- ✅ Comprehensive test coverage
- ✅ Clear error messages
- ✅ Security warnings for production
- ✅ Backward compatibility maintained
