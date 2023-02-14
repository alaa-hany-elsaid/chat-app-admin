const express = require('express');
const usersRouter = express.Router();
const {getUsers} = require("../../controllers/user_controller");


usersRouter.get('/',  (req, res) => {
     getUsers(req, res).catch((reason) => {
        res.status(400).json()
    })
})


module.exports = usersRouter;