'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Message.belongsTo(models.User, {
                foreignKey: 'senderId',
                as : 'sender'
            });
            Message.belongsTo(models.Chat, {
                foreignKey: 'chatId',
            });
        }
    }

    Message.init({
        content: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Message',
    });
    return Message;
};