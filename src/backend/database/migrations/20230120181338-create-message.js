'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            content: {
                type: Sequelize.TEXT
            },
            senderId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {tableName: 'Users'},
                    key: 'id'
                },
                allowNull: false,
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            chatId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {tableName: 'Chats'},
                    key: 'id'
                },
                allowNull: false,
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Messages');
    }
};