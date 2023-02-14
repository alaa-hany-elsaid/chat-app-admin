const express = require('express');
const authRouter = require("./auth");
const usersRouter = require("./users");
const chatsRouter = require("./chats");
const  apiRouter = express.Router();


// auth
apiRouter.use('/auth' ,  authRouter);
apiRouter.use('/users' ,  usersRouter);
apiRouter.use('/chats' ,  chatsRouter);


module.exports = apiRouter;