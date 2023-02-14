# Chat App Admin
----------------------------------------------------
## Steps to run the project:
+ Clone the repo.
+ copy .env.example file to .env in the project's root path 
+ Add database configuration (`database_name` . `username`, `password`) in the file `.env`
+ Add your JWT and COOKIES secrets in new env file 
+ Create database called "chat_app_admin" if you didn't change database_name .
    + Run the following SQL query to create the database:
        + ` create database chat_app_admin;`
+ Open terminal and run the following commands:
    + `npm install`
    + `npx sequelize-cli db:migrate`
    +  To add some admin and some bad words run `npx sequelize-cli db:seed:all`
    + `npm run dev`
### MySQL terminal:
+ `show databases;` # show all database ;
+ `drop database chat_app_admin;` # delete Old database and all its table
+ `create database chat_app_admin;` # create new database called chat_app_admin
+ `use  chat_app_admin ;` # select database  to run queries throw it
+ `select * from Users;` # select all user from selected database
+ `select * from Users where role = 'admin' ;` # select all admin from selected database
----------------------------------------------------

## By Alaa Hany Elsaid