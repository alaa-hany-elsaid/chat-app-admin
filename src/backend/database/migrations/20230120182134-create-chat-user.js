'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ChatUsers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            status: {
                default: 'active',
                type: Sequelize.ENUM('active', 'blocked' , 'suspend' , 'invited', 'reject_invitation')
            },
            reason: {
                allowNull: true,
                type: Sequelize.STRING
            },
            by: {
                type: Sequelize.INTEGER,
                references: {
                    model: {tableName: 'Users'},
                    key: 'id'
                },
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
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {tableName: 'Users'},
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
        await queryInterface.dropTable('ChatUsers');
    }
};