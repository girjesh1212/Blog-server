# Zapit

This repository contains backend code for a blog website. The question is as follows:

## Question:
Build an express application that allows users to read, update, delete or post blogs.

### Details
The task is to construct an application in express that allows random users to authenticate
(JWT) using a valid(Only needs to be valid) email id. The users can later use the token to
post blogs.

- Anyone should be able to fetch the blogs posted by themselves and/or by other
users.
- Add pagination in reading the blogs
- Add sorting based on time of creation and/or number of posts
- Add ordering (asc/desc)
- Add filtering based on email
- Allow only the owner of the blog to update or delete a blog.
- Implement internal caching (node-cache)
- All the data should be stored inside MongoDB

### Expectation
- Use express to build the application.
- Use REST standard
- Validations
- MongoDB for database
- Clean, documented and structured code
- Use of design patterns
- Error Handeling
- Test cases (at least 2)



## How to start 
- Clone the repository
- Run the command **npm install** in root directory of this project to install dependencies
- Open the config.env file, write PORT, mongoURI and secretOrKey 
- Run the command **npm run start** in root directory of this project to start the server

## Routes
On going to the route "GET localhost:PORT/" , you should see a list of available routes.
However, those available routes are:

## Try the routes and enjoy
Open postman and try these different routes.

In case of following messages:
- **Unauthorized**: Send authorization token in header obtained from /user/login route
- **{field: "This field is required"}** => Send this field in request body 
