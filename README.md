## Changes Made

Added data validation 
## API Routes


- POST : http://localhost:8000/login for logging in. Send email and password for the super admins and you will receive accessToken and refreshToken

- POST :http://localhost:8000/user for creating a new user. Send name email and password and the accessToken received while logging in as super admin.

- GET :http://localhost:8000/user for getting all the users. Send in the access token received  while logging in as super admin.

- DELETE :http://localhost:8000/user/:id for deleting the user with the id. Send in the access token received  while logging in as super admin. 

- PUT:http://localhost:8000/user/:id for updating the user details with the specified id. Send in the access token received  while logging in as super admin. 

- GET :http://localhost:8000/todos for getting all your todo. Send the access token you received while logging in. 

- POST:http://localhost:8000/todos/addTodos for adding a todo. Send the access token you received while logging in and also send the name of your task as name and if your task is completed or not as isDone. 

- DELETE :http://localhost:8000/todos/deleteTodos/:id  for deleting the todo with the specified id. Send the access token you received while logging in.

- PUT:http://localhost:8000/todos/updateTodos/:id for updating the todo with the specified id. Send in the access token received  while logging in and also send the new name of your task as name and your new task status as isDone
     
- POST :http://localhost:8000/login/token to obtain a new access token. Send the  refresh token you received while logging in.

## Default Super Admin
```json
{
"email":"jayan@jayan.com",
"password":"jayan"
}  
```
## Default User
```json
{
"email":"jaya@jaya.com",
"password":"jaya"
}
```
