const jwt = require("jsonwebtoken");
const db = require("./database/models");
const {where, Sequelize, Op} = require("sequelize");


exports.isValidToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return false;
    }
}


exports.checkMessage = async (message, senderId, chatId) => {

    if (await db.NotAllowedMessage.count({
        where: where(
            Sequelize.fn('lower', Sequelize.col('content')),
            {
                [Op.in]: message.trim().replace(/_\-!@#\$%\^&*\(\)/, ' ').toLowerCase().split(' ').map((word) => word.trim())
            }
        )
    }) > 0) {
        throw new Error('Message content is not allowed')
    }

    const messageModel = await db.Message.create({
        senderId,
        chatId,
        content: message
    })

    const sender = await messageModel.getSender({
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
    })

    return {...messageModel.get({plain: true}), sender: sender.get({plain: true})}
}

exports.getChatUsers = async (currentUserId, chatId) => {

    return (await db.ChatUser.findAll({
        where: {
            userId: {
                [Op.not]: currentUserId
            },
            chatId,
            status: {
                [Op.not]: 'reject_invitation'
            }
        },
        attributes: ['status'],
        include: [
            {
                model: db.User,
                attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
            }
        ]
    })).map((user) => {
        const {status, User} = user.get({plain: true});
        return {
            status,
            ...User
        }
    })
}

exports.getChatMessages = async (chatId) => {
    return  (await db.Message.findAll({
        where: {
            chatId: chatId,
        },
        include: [
            {
                model: db.User,
                as: 'sender',
                attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'role']
            }
        ]
    })).map((message) => {
        return message.get({plain: true});
    });
}