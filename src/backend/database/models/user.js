'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsToMany(models.Chat, {through: models.ChatUser, foreignKey: 'userId'});
            User.hasMany(models.ChatUser, {foreignKey: 'userId'});
            User.hasMany(models.Chat, {
                foreignKey: 'createdBy',
                as: 'owner'
            });

        }
    }

    User.init({
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        role: DataTypes.STRING,
        password: DataTypes.STRING,
        createdAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};