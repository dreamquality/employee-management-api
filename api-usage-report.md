# API Endpoint Usage Report

Generated: 2025-11-02T12:13:45.205Z

## Summary

- **Total Backend Endpoints**: 18
- **Used by Frontend**: 18 (100%)
- **Unused by Frontend**: 0 (0%)
- **Total Frontend API Calls**: 18

## Used Endpoints ✓

These endpoints are implemented in the backend and actively used by the frontend.

| Method | Endpoint | Backend File |
|--------|----------|-------------|
| POST | `/register` | authRoutes.js |
| POST | `/login` | authRoutes.js |
| GET | `/notifications` | notificationRoutes.js |
| PATCH | `/notifications/:id/mark-as-read` | notificationRoutes.js |
| GET | `/projects` | projectRoutes.js |
| GET | `/projects/:id` | projectRoutes.js |
| POST | `/projects` | projectRoutes.js |
| PUT | `/projects/:id` | projectRoutes.js |
| DELETE | `/projects/:id` | projectRoutes.js |
| POST | `/projects/:id/employees` | projectRoutes.js |
| POST | `/projects/:id/employee` | projectRoutes.js |
| DELETE | `/projects/:id/employees/:employeeId` | projectRoutes.js |
| GET | `/profile` | userRoutes.js |
| POST | `/users` | userRoutes.js |
| DELETE | `/users/:id` | userRoutes.js |
| GET | `/users` | userRoutes.js |
| PUT | `/users/:id` | userRoutes.js |
| GET | `/users/:id` | userRoutes.js |

## Unused Endpoints ✗

These endpoints are implemented in the backend but NOT used by the frontend.

**All endpoints are in use! 🎉**


## Frontend API Calls

All API calls made from the frontend services.

| Method | Endpoint | Frontend File | Line |
|--------|----------|---------------|------|
| POST | `/login` | authService.js | 5 |
| POST | `/register` | authService.js | 23 |
| GET | `/notifications` | notificationService.js | 5 |
| PATCH | `/notifications/:id/mark-as-read` | notificationService.js | 10 |
| GET | `/projects` | projectService.js | 5 |
| GET | `/projects/:id` | projectService.js | 10 |
| POST | `/projects` | projectService.js | 15 |
| PUT | `/projects/:id` | projectService.js | 20 |
| DELETE | `/projects/:id` | projectService.js | 25 |
| POST | `/projects/:id/employees` | projectService.js | 30 |
| POST | `/projects/:id/employee` | projectService.js | 35 |
| DELETE | `/projects/:id/employees/:id` | projectService.js | 40 |
| GET | `/profile` | userService.js | 5 |
| GET | `/users` | userService.js | 10 |
| GET | `/users/:id` | userService.js | 15 |
| POST | `/users` | userService.js | 20 |
| PUT | `/users/:id` | userService.js | 25 |
| DELETE | `/users/:id` | userService.js | 30 |

## Details

### Backend Route Files

#### authRoutes.js

- ✓ `POST /register`
- ✓ `POST /login`

#### notificationRoutes.js

- ✓ `GET /notifications`
- ✓ `PATCH /notifications/:id/mark-as-read`

#### projectRoutes.js

- ✓ `GET /projects`
- ✓ `GET /projects/:id`
- ✓ `POST /projects`
- ✓ `PUT /projects/:id`
- ✓ `DELETE /projects/:id`
- ✓ `POST /projects/:id/employees`
- ✓ `POST /projects/:id/employee`
- ✓ `DELETE /projects/:id/employees/:employeeId`

#### userRoutes.js

- ✓ `GET /profile`
- ✓ `POST /users`
- ✓ `DELETE /users/:id`
- ✓ `GET /users`
- ✓ `PUT /users/:id`
- ✓ `GET /users/:id`

### Frontend Service Files

#### authService.js

- `POST /login` (line 5)
- `POST /register` (line 23)

#### notificationService.js

- `GET /notifications` (line 5)
- `PATCH /notifications/:id/mark-as-read` (line 10)

#### projectService.js

- `GET /projects` (line 5)
- `GET /projects/:id` (line 10)
- `POST /projects` (line 15)
- `PUT /projects/:id` (line 20)
- `DELETE /projects/:id` (line 25)
- `POST /projects/:id/employees` (line 30)
- `POST /projects/:id/employee` (line 35)
- `DELETE /projects/:id/employees/:id` (line 40)

#### userService.js

- `GET /profile` (line 5)
- `GET /users` (line 10)
- `GET /users/:id` (line 15)
- `POST /users` (line 20)
- `PUT /users/:id` (line 25)
- `DELETE /users/:id` (line 30)

