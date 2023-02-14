require("dotenv").config();
const {PORT = 3001} = process.env;
const path = require('path');
const express = require('express');
const apiRouter = require("./backend/routes/api");
const {expressjwt: jwt} = require("express-jwt");
const cookieParser = require('cookie-parser');
const cookieParserSocketio = require('socket.io-cookie');
const cors = require("cors");
const http = require('http');
const app = express();
const server = http.createServer(app);
const {Server} = require("socket.io");
const {isValidToken, checkMessage, getChatUsers, getChatMessages} = require("./backend/utils");
const db = require("./backend/database/models");
const {Op} = require("sequelize");
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIES_SECRET, {
    secure: false,
    httpOnly: false,
    maxAge: 1000 * 60 * 60,
}));

app.use(
    jwt({
        secret: process.env.JWT_SECRET,
        algorithms: ["HS256"],
        getToken: function fromHeaderOrQuerystringOrCookies(req) {
            if (
                req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
                return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.accessToken) {
                return req.query.accessToken;
            } else if (req.body && req.body.accessToken) {
                return req.body.accessToken;
            } else if (req.cookies && req.cookies.accessToken) {
                return req.cookies.accessToken;
            }
            return null;
        },

    }).unless({path: ["/api/auth/login", "/api/auth/register"]})
);
// Serve API requests from the router
app.use('/api', apiRouter);


// this code for server app in production mode

app.use(express.static('dist/app'));


io.use(cookieParserSocketio)
io.use(async (socket, next) => {

    const token = socket.handshake.headers.cookie.accessToken;
    const chatId = socket.handshake.auth.chatId;
    const {userId, role} = isValidToken(token ?? "")

    if (!userId || !chatId) {
        return next(new Error(JSON.stringify({
            code: 402
        })));
    }
    if (!socket.user) {
        if (role !== 'admin') {
            const chatUser = await db.ChatUser.findOne({
                where: {
                    userId,
                    chatId,
                    status: {[Op.in]: ['active', 'invited']}
                }
            })
            if (!!chatUser) {
                chatUser.status = 'active';
                await chatUser.save()
            } else {
                return next(new Error(JSON.stringify({
                    code: 402
                })));
            }
        }
    }
    if (!socket.user) {
        socket.user = await db.User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'role']
        })

        socket.chat = await db.Chat.findByPk(chatId)
        socket.messages = await getChatMessages(chatId)
        socket.users = await getChatUsers(socket.user.id, socket.chat.id)
    }
    return next();

});


io.on('connection', (socket) => {
    socket.join(socket.chat.id)

    io.to(socket.id).emit('init-info', {
        chat: socket.chat,
        user: socket.user,
        users: socket.users,
        messages: socket.messages
    })

    socket.on('message', async (message, callback) => {
        if (socket.user.role !== 'admin') {
            const chatUser = await db.ChatUser.findOne({
                where: {
                    userId: socket.user.id,
                    chatId: socket.chat.id
                },
                attributes: ['status']
            });

            if (chatUser.status === 'blocked') {
                callback({
                    code: 403,
                    description: 'you are blocked'
                });
            } else if (chatUser.status === 'suspend') {
                callback({
                    code: 404,
                    description: 'you are suspend'
                });
            }
        }
        checkMessage(message, socket.user.id, socket.chat.id).then((message) => {
            io.to(socket.chat.id).except(socket.id).emit('message', message);
            callback({
                code: 200,
                description: 'message sent',
            })
        }).catch((er) => {
            callback({
                code: 400,
                description: er.message
            })
        })

    })
    if (socket.user.role === 'admin' || socket.chat.createdBy === socket.user.id) {
        socket.on('delete-message', (messageId, callback) => {

            if (socket.user.role === 'admin') {
                db.Message.destroy({
                    where: {
                        id: messageId
                    }
                }).then(() => {
                    getChatMessages(socket.chat.id).then((msgs) => {
                        socket.messages = msgs;
                        io.to(socket.chat.id).emit('update-messages', socket.messages)
                    })


                })
                callback({
                    code: 200,
                    description: 'Message deleted successfully'
                })

            } else {
                callback({
                    code: 404,
                    description: 'Not Allowed to delete Message'
                })
            }


        })
        socket.on('add-users', (selectedUsers, callback) => {

            db.ChatUser.bulkCreate(selectedUsers.map(userId => {
                return {
                    status: 'invited',
                    userId,
                    by: socket.user.id,
                    chatId: socket.chat.id,
                }
            })).then(() => {

                getChatUsers(socket.user.id, socket.chat.id).then((users) => {
                    socket.users = users
                    io.to(socket.chat.id).emit('update-users', users)
                })


                callback({
                    code: 200,
                    description: "Users added successfully"
                })
            }).catch(() => {
                callback({
                    code: 400,
                    description: 'Something is wrong'
                })
            })


        });
        socket.on('action', ({name, userId, chatId}, callback) => {
            let status = false;
            if (name === 'blocked') {

                status = 'blocked';

            } else if (name === 'unblocked' || name === 'unsuspend') {
                status = 'active'
            } else if (name === 'suspend') {
                status = 'suspend'
            }
            if (status) {
                db.ChatUser.update({status}, {
                    where: {
                        userId,
                        chatId
                    }
                }).then(() => {
                    callback({
                        code: 200
                    })
                })
            }

        });

    }
});


app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'app/index.html'));
});


server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});



