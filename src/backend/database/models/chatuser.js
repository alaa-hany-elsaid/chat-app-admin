'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChatUser extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ChatUser.belongsTo(models.Chat ,  { foreignKey : 'chatId' });
            ChatUser.belongsTo(models.User , { foreignKey : 'userId' });
            ChatUser.belongsTo(models.User, {
                foreignKey: 'by',
                as: 'statusBy'
            });

        }
    }

    ChatUser.init({
        status: DataTypes.ENUM('blocked', 'active', 'suspend', 'invited', 'reject_invitation'),
        reason: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ChatUser',
    });
    return ChatUser;
};