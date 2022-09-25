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

userRoutes: [
    "GET /user/test",
    "POST /user/register",
    "POST /user/login",
    "GET /user/profile"
],

blogRoutes: [
    "GET /blog/test",
    "POST /blog/create",
    "GET /blog/fetch/:num",
    "GET /blog/fetch/:email/:num",
    "PUT /blog/update",
    "POST /blog/delete"
]

Do not hesitate to try POST/PUT request without request body or authorization. 
On visiting the routes, proper messages will be returned back by the server to guide you. 

## Try the routes and enjoy
Open postman and try these different routes.

In case of following messages:
- **Unauthorized**: Send authorization token in header obtained from /user/login route
- **{field: "This field is required"}** => Send this field in request body 


## How Node Cache is used? 
- The most frequent and common route for everyone is **GET /blog/fetch/:num** route. The data returned by this route has been cached for 10 minutes. 

- However, if any blog is updated/deleted/modified, then this cached data has to be flushed, which is handled in the code.

- However, the caching can be improved in case of blog update by modifying single cached blog according to the request body. 

- In case of delete and create, entire caching has to be modified which would be a lot of code and slow process. In this case, a direct flush is better.