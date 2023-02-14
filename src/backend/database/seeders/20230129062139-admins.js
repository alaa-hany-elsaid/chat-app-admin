'use strict';

const {hashPassword} = require("../../services/auth");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {

            const password = await hashPassword('P@ssw0rd');
            const date = new Date();
            await queryInterface.bulkInsert('Users', Array.from({length: 10}).map((i, v) => {
                return {
                    firstName: `Admin`,
                    lastName: `admin ${v}`,
                    email: `admin${v}@admin.com`,
                    phone: `123456${v}${v}${v}${v}`,
                    role: 'admin',
                    password,
                    createdAt: new Date(date.getDate() - v),
                    updatedAt: new Date(date.getDate() - v),

                }
            }), {})
        }catch (e){
            console.log(e)
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
