const express = require('express');
const authRouter = express.Router();
const {body, validationResult} = require('express-validator');
const {signup, login, getProfile, updateProfile} = require("../../controllers/auth_controller");
const db = require("../../database/models");
const {validatorMiddleware} = require("../../middlewares/validator");

// login
authRouter.post('/login',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 12}),
    validatorMiddleware,
    function (req, res) {
        login(req, res).catch((reason) => {
            //console.log(reason)
            res.json(400)
        })
    });

// register
authRouter.post('/register',
    body('firstName').isString().isLength({min: 3, max: 255}),
    body('lastName').isString().isLength({min: 3, max: 255}),
    body('phone').isString().custom((phone) => {
        if (!/^[0-9]{10}$/.test(phone)) {
            throw new Error('Phone is not correct');
        }
        return true
    }),
    body('email').isEmail().isLength({max: 255}).custom(value => {
        return db.User.findOne({where: {email: value}}).then(user => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        })
    }),
    body('password')
        .custom((value) => {

            if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)) {
                return Promise.reject('Password must be at least 8 characters long and contain at least one capital letter and special character');
            }
            return true;

        }),
    body('confirm_password').custom((confirm_password, {req}) => {
        if (confirm_password !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    validatorMiddleware,
    function (req, res) {
        signup(req, res).catch((reason) => {
            res.status(400)
        })
    });


authRouter.post('/profile',
    body('firstName').isString().isLength({min: 3, max: 255}).optional(),
    body('lastName').isString().isLength({min: 3, max: 255}).optional(),
    body('phone').isString().custom((phone) => {
        if (!/^[0-9]{10}$/.test(phone)) {
            throw new Error('Phone is not correct');
        }
        return true
    }).optional(),
    body('email').isEmail().isLength({max: 255}).custom((value, {req}) => {
        return db.User.findOne({where: {email: value, id: {$not: req.auth.userId}}}).then(user => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        })
    }).optional(),
    body('password')
        .custom((value) => {

            if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)) {
                return Promise.reject('Password must be at least 8 characters long and contain at least one capital letter and special character');
            }
            return true;

        })
        .optional(),
    body('confirm_password').custom((confirm_password, {req}) => {
        if (confirm_password !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    validatorMiddleware,
    (req, res) => {
        updateProfile(req, res).catch((reason) => {
            res.status(400)
        })
    })
authRouter.get('/profile',
    (req, res) => {
        getProfile(req, res).catch((reason) => {
            res.status(400)
        })
    })
authRouter.post('/logout',
    (req, res) => {
        res.cookie('accessToken', '')
        res.json({})
    })


module.exports = authRouter;