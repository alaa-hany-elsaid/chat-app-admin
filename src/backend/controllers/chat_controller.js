const db = require("../database/models");
const {Op} = require("sequelize");
exports.createChat = async (req, res) => {
    const {selectedUsers, subject} = req.body;
    const userId = req.auth.userId;

    selectedUsers.push(userId)
    const chat = await db.Chat.create({subject, createdBy: userId})
    await db.ChatUser.bulkCreate(selectedUsers.map(id => {
        return {
            status: id === userId ? 'active' : 'invited',
            userId: id,
            by: userId,
            chatId: chat.id,
        }
    }));
    res.json({
        data: chat
    })

}


exports.getChat = async (req, res) => {

    const role = req.auth.role;

    const query = {
        where: {
            id: req.params.chatId,
        },
        attributes: ['id', 'subject']
    };

    if (role !== 'admin') {
        query['include'] = [];
        query['include'].push({
            model: db.ChatUser,
            where: {
                'userId': req.auth.userId,
                'status': {[Op.in]: ['active', 'invited']}
            },
            attributes: []
        })
        query['include'].push({
            model: db.User,
            as: 'owner',
            attributes: ['firstName', 'lastName', 'email', 'id']
        })
    }


    res.json(await db.Chat.findOne(query))
}

exports.getChats = async (req, res) => {
    const page = Math.max((req.query.page ?? 1) - 1, 0);
    const role = req.auth.role;
    const query = {
        offset: page,
        limit: 10,

    };
    query['include'] = [];
    query['include'].push({
        model: db.User,
        as: 'owner',
        attributes: ['firstName', 'lastName', 'email', 'id']
    })
    query['include'].push({
        model: db.Message,
        where: {
            senderId: req.auth.userId,
        },
        separate: true,
        limit: 1,
        order: [['id', 'DESC']],
        attributes: ['id']
    })
    if (role !== 'admin') {

        query['include'].push({
            model: db.ChatUser,
            where: {
                'userId': req.auth.userId,
                'status': {[Op.in]: ['active', 'blocked', 'suspend']}
            },
            attributes: ['status']
        })

    }
    const result = await db.Chat.findAndCountAll(query);
    result.rows = result.rows.map(({id, subject, owner, Messages, ChatUsers}) => {
        return {
            id,
            subject,
            owner,
            lastMessage: Messages[0] ?? {id: -1},
            status: (ChatUsers && ChatUsers[0] ? ChatUsers[0].status : 'active')
        };
    })
    res.json(result)


}
exports.getInvitations = async (req, res) => {
    const page = Math.max((req.query.page ?? 1) - 1, 0);
    const role = req.auth.role;
    const query = {
        offset: page,
        limit: 10,

    };

    if (role !== 'admin') {
        query['include'] = [];
        query['include'].push({
            model: db.ChatUser,
            where: {
                'userId': req.auth.userId,
                'status': 'invited'
            },
            attributes: []
        })
        query['include'].push({
            model: db.User,
            as: 'owner',
            attributes: ['firstName', 'lastName', 'email', 'id']
        })
    }
    const result = await db.Chat.findAndCountAll(query);
    result.rows = result.rows.map(({id, subject, owner}) => {
        return {id, subject, owner};
    })
    res.json(result)
}


exports.rejectInvitation = async (req, res) => {
    const chatUser = await db.ChatUser.findOne({
        where: {
            chatId: req.params.chatId,
            userId: req.auth.userId
        }
    })
    if (chatUser) {
        chatUser.status = 'reject_invitation';
        await chatUser.save();
    }

    res.json({})


}
