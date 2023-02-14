require("dotenv").config();
const {DATABASE_NAME = 'chay_app_admin', DATABASE_USERNAME = 'hisham', DATABASE_PASSWORD = 'password'} = process.env
module.exports = {
    "development": {
        "username": DATABASE_USERNAME,
        "password": DATABASE_PASSWORD,
        "database": DATABASE_NAME,
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "test": {
        "username": DATABASE_USERNAME,
        "password": DATABASE_PASSWORD,
        "database": DATABASE_NAME,
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": DATABASE_USERNAME,
        "password": DATABASE_PASSWORD,
        "database": DATABASE_NAME,
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
}
