const bcrypt = require("bcrypt");
const db = require("../database/models");


exports.hashPassword = async function hashPassword(password) {
    return await bcrypt.hash(password, 12);
}

exports.validatePassword = async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}



