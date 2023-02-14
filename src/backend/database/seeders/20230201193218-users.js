'use strict';
const random_name = require('node-random-name');
const {hashPassword} = require("../../services/auth");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const password = await hashPassword('P@ssw0rd');
        const date = new Date();
        try {
            await queryInterface.bulkInsert('Users', Array.from({length: 10}).map((i, v) => {
                return {
                    firstName: random_name({random: Math.random, first: true}),
                    lastName: random_name({random: Math.random, first: true}),
                    email: `user-${v + 1}@dev.com`,
                    phone: `02345${v}${v}${v}${v}${v}`,
                    role: 'normal',
                    password,
                    createdAt: new Date(date.getDate() - v),
                    updatedAt: new Date(date.getDate() - v),
                }
            }), {})
        } catch (e) {
            console.log(e)
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
