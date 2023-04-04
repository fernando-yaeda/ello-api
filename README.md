# ello-api

ello api is a clone of Trello api, where you can create 

# Tech Stack
  - Node.js
  - Typescript
  - Express.js
  - PrismaORM
  - PostgreSQL
  - Docker
  - Jest
  - Eslint
  - Prettier

## Running for development
1. clone this repository
2. install all dependencies
```bash
npm i
```
3. create a PostgreSQL database
4. configure the `.env.development` file using the `.env.example` file as a template (see "Runing aplication locally or inside docker" session for details)
5. run all migration
```bash
npm run migration:run
```
6. seed db
```bass
npm run npx prisma db seed
```
- there is currently an error when running `npm run dev:seed`, so when using docker, you will need to `npm run dev:docker` -> `docker exec -it <api container id> /bin/bash` -> `npx prisma db seed`

7. run the back-end in a development environment
```bash
npm run dev
```

## Running application locally or inside docker

`.env.development` and `.env.test` must be changed if you want to run the application locally or inside docker. You can populate the .env files bassed on `.env.example`, but you need to consider the following:
- running application locally (postgres and node):
Add your postgres credentials and make sure to create given database before running the application
- running application inside docker:
set POSTGRES_HOST to ello-postgres-development for `.env.development` and ello-postgres-test for `.env.test` file. It is the name of the postgres container inside docker-compose files. Docker Compose will start the postgres container for you, create the database and host alias for you.
- running application locally but postgres is running inside docker:
set POSTGRES_HOST to localhost for `.env.development` and localhost for `.env.test` file. Docker compose is configured to expose postgres container to your localhost

## Conventional commits

- feat - new functionality
- fix - amendment to existing functionality
- docs - changes only in documentation
- chore - changes that do not affect the source code or test content (e.g. package updates)
- refactor - changes that are not both fixes and new functionalities
- tests - everything connected with tests (adding, editing)
- perf - changes in code that improve performance,
- styles - all kinds of code formatting, white space, commas or missing - semicolons
- ci - changes for CI purposes (configs, scripts),
- build - changes affecting the build process,
- revert - revert the last changes

## Testing/Using the API

methods:
| Method | Description |
|---|---|
| `GET` | Return informations from one or more recors |
| `POST` | Used to create a new register |
| `PUT` | Update data on a record |
| `DELETE` | Delete a record |

## Available Routes

# User [ /users ]
## Create User [ POST / ]
creates a new user
- Attributes(object)
  - email (string, required)
  - username (string, required)
  - password (string, required) - min 6 characters, max 18 characters
  
- Request (aplication/json)
  - Body
  
  ```JSON
  {
    "email": "john.doe@email.com",
    "username": "johndoe",
    "password": "top-secret-123"
  }
  ```
  - Response
    
    - 201 (created)
    ```JSON
    {
      "id": "151f80d4-87ec-427d-9386-6a990139050b",
      "email": "john.doe@email.com"
    }
    ```
  - Errors
  
    - 409 (bad request) - return an array with missing or not allowed attributes on request body 
    ```JSON
    {
      "name": "InvalidDataError",
      "message": "Invalid data",
      "details": [
        "\"email\" is required",
        "\"aditional field name\" is not allowed",
      ]
    }
    ```
    - 409 (conflict)
    ```JSON
    {
      "name": "DuplicatedEmailError",
      "message": "There is already an user with given email"
    }
    ```
    
# Authentication [ /auth ]
## Sign In [POST /sign-in ]
- Attributes(object)
  - email (string, required)
  - password (string, required) - min 6 characters, max 18 characters
  
- Request (aplication/json)
  - Body
  
  ```JSON
  {
    "email": "john.doe@email.com",
    "password": "top-secret-123"
  }
  ```
  - Response
    
    - 200 (success)
    ```JSON
    {
      "user": {
        "id": "151f80d4-87ec-427d-9386-6a990139050b",
        "email": "john.doe@email.com",
        "username": "johndoe"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE1MWY4MGQ0LTg3ZWMtNDI3ZC05Mzg2LTZhOTkwMTM5MDUwYiIsImVtYWlsIjoiam9obi5kb2VAZW1haWwuY29tIiwidXNlcm5hbWUiOiJqb2huZG9lIn0.NINkcJh-7kkI7OOgE13BpwZLt6bXo50ZVV8ldZybz5A"
    }
    ```
  - Errors
  
    - 400 (bad request) - return an array with missing or not allowed attributes on request body 
    ```JSON
    {
      "name": "InvalidDataError",
      "message": "Invalid data",
      "details": [
        "\"email\" is required",
        "\"aditional field name\" is not allowed",
      ]
    }
    ```
    - 401 (unauthorized)
    ```JSON
    {
      "name": "InvalidCredentialsError",
      "message": "Email or password are incorrect"
    }
    ```

# Projects [ /projects ]

## Create Project [POST / ]
- Attributes(object)
  - name (string, required)
  
- Request (aplication/json)
  - Headers
  ```
  Authorization: Bearer <token>
  ```
   
  - Body
  
  ```JSON
  {
    "name": "new project name",
  }
  ```
  - Response
    
    - 201 (created)
    ```JSON
    {
      "projectId": "151f80d4-87ec-427d-9386-6a990139050b",
      "name": "new project name",
      "ownerId": "151f80d4-87ec-427d-9386-6a990139050b"
    }
    ```
  - Errors
  
    - 400 (bad request) - return an array with missing or not allowed attributes on request body 
    ```JSON
    {
      "name": "InvalidDataError",
      "message": "Invalid data",
      "details": [
        "\"name\" is required",
        "\"aditional field name\" is not allowed"
      ]
    }
    ```
    - 401 (unauthorized)
    ```JSON
    {
      "name": "UnauthorizedError",
      "message": "You need to authenticate to access this content"
    }
    ```

# Lists [ /lists ]

## Create List [ POST / ]
  Create a new list inside project

- Attributes(object)
  - name (string, required)
  
- Request (aplication/json)
  - Headers
  ```
  Authorization: Bearer <token>
  ```
   
  - Body
  
  ```JSON
  {
    "name": "new list name",
    "projectId": "151f80d4-87ec-427d-9386-6a990139050b"
  }
  ```
  - Response
    
    - 201 (created)
    ```JSON
    {
      "listId": "5082336a-9f7d-4785-bd22-b7506e0b0428",
      "name": " new list name"
    }
    ```
  - Errors
  
    - 400 (bad request) - return an array with missing and not allowed attributes on request body 
    ```JSON
    {
      "name": "InvalidDataError",
      "message": "Invalid data",
      "details": [
        "\"name\" is required",
        "\"aditional field name\" is not allowed"
      ]
    }
    ```
    - 401 (unauthorized)
    ```JSON
    {
      "name": "UnauthorizedError",
      "message": "You need to authenticate to access this content"
    }
    ```
    - 403 (forbidden)
    ```JSON
    {
      "name": "NotParticipantError",
      "message": "You are not a participant on this project"
    }
    ```
    - 404 (not found)
    ```JSON
    {
      "name": "ProjectNotFoundError",
      "message": "There is no project with given id"
    }
    ```
# Cards [ /cards ]

## Create Card [ POST / ]
  Create a new card inside a list
  
- Attributes(object)
  - title (string, required)
  - listId (string, required)
  
- Request (aplication/json)
  - Headers
  ```
  Authorization: Bearer <token>
  ```
   
  - Body
  
  ```JSON
  {
    "title": "new card title",
    "listId": "5082336a-9f7d-4785-bd22-b7506e0b0428"
  }
  ```
  - Response
    
    - 201 (created)
    ```JSON
    {
      "cardId": "1b9b3c41-5c4e-49b5-9a4c-ef01c28dc44e",
      "title": " new card title"
    }
    ```
  - Errors
  
    - 400 (bad request) - return an array with missing and not allowed attributes on request body 
    ```JSON
    {
      "name": "InvalidDataError",
      "message": "Invalid data",
      "details": [
        "\"title\" is required",
        "\"aditional field name\" is not allowed"
      ]
    }
    ```
    - 401 (unauthorized)
    ```JSON
    {
      "name": "UnauthorizedError",
      "message": "You need to authenticate to access this content"
    }
    ```
    - 403 (forbidden)
    ```JSON
    {
      "name": "NotParticipantError",
      "message": "You are not a participant on this project"
    }
    ```
    - 404 (not found)
    ```JSON
    {
      "name": "ProjectNotFoundError",
      "message": "There is no project with given id"
    }
    ```
    - 404 (not found)
    ```JSON
    {
      "name": "ListNotFoundError",
      "message": "There is no list with given id"
    }
    ```
# Labels [ /labels ]

## Create Label [ POST / ]
  Create a new label to use it on the project cards
  
- Attributes(object)
  - title (string, required)
  - colorName (string, required) - the options are defined at `prisma/colors.ts`, and can be changed if you want
  - projectId (string, required)
  
- Request (aplication/json)
  - Headers
  ```
  Authorization: Bearer <token>
  ```
   
  - Body
  
  ```JSON
  {
    "title": "new label title",
    "projectId": "151f80d4-87ec-427d-9386-6a990139050b",
    "colorName": "purple"
  }
  ```
  - Response
    
    - 201 (created)
    ```JSON
    {
      "cardId": "1b9b3c41-5c4e-49b5-9a4c-ef01c28dc44e",
      "title": " new card title"
    }
    ```
  - Errors
  
    - 400 (bad request) - return an array with missing and not allowed attributes on request body 
    ```JSON
    {
      "name": "InvalidDataError",
      "message": "Invalid data",
      "details": [
        "\"title\" is required",
        "\"aditional field name\" is not allowed"
      ]
    }
    ```
    - 401 (unauthorized)
    ```JSON
    {
      "name": "UnauthorizedError",
      "message": "You need to authenticate to access this content"
    }
    ```
    - 403 (forbidden)
    ```JSON
    {
      "name": "NotParticipantError",
      "message": "You are not a participant on this project"
    }
    ```
    - 404 (not found)
    ```JSON
    {
      "name": "ProjectNotFoundError",
      "message": "There is no project with given id"
    }
    ```
    - 404 (not found)
    ```JSON
    {
      "name": "ListNotFoundError",
      "message": "There is no list with given id"
    }
    ```
    - 404 (not found)
    ```JSON
    {
      "name": "ColorNotFoundError",
      "message": "There is no color with given colorName"
    }
    ```
# Deploy with GitActions
  as this project is still in its initial stages, I chose to disable deploy in AWS. But the pipeline is pretty simple, and if you want to deploy it by yourself, you just need to take a look at this repo: https://github.com/bitovi/github-actions-deploy-docker-to-ec2 and create the necessary github secrets for that
