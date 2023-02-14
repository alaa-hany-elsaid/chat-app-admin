'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Chat extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Chat.belongsTo(models.User, {
                foreignKey: 'createdBy',
                onDelete: 'CASCADE',
                as: 'owner'
            });
            Chat.belongsToMany(models.User, {through: models.ChatUser, foreignKey: 'chatId'})
            Chat.hasMany(models.ChatUser, {foreignKey: 'chatId'})
            Chat.hasMany(models.Message, {foreignKey: 'chatId'})

        }
    }

    Chat.init({
        subject: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Chat',
    });
    return Chat;
};