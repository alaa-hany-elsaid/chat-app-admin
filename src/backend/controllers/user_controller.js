const db = require("../database/models");
const {Sequelize, where, fn, Op} = require("sequelize");


exports.getUsers = async (req, res) => {
    const role = req.auth && req.auth.role ? req.auth.role : '';
    const id = (req.auth && req.auth.userId) ? req.auth.userId : 0;
    const page = Math.max((req.query.page ?? 1) - 1, 0);
    const search = req.query.search ?? '';
    const limit = Math.max(parseInt(req.query.limit ?? 10), 10);
    const whereQ = {
        id: {[Op.not]: id},
        [Op.or]: [
            where(
                fn('lower', Sequelize.col('firstName')),
                {
                    [Op.like]: `%${search}%`
                }
            ),
            where(
                Sequelize.fn('lower', Sequelize.col('lastName')),
                {
                    [Op.like]: `%${search}%`
                }
            ),
            where(
                Sequelize.fn('lower', Sequelize.col('email')),
                {
                    [Op.like]: `%${search}%`
                }
            )
        ]
    }
    if (role !== 'admin') {
        whereQ.role = 'normal';
    }

    const users = await db.User.findAndCountAll({
        where: whereQ,
        offset: page,
        limit,
        order: [
            ['createdAt', 'DESC']
        ]
    })
    users.rows = users.rows.map(({id, email, firstName, lastName, phone , createdAt}) => {
        return {id, email, firstName, lastName, phone , createdAt}
    })
    res.json(users);


}


exports.getUserChats = async (req, res) => {
    const user = await db.User.findOne({where: {id: req.auth.userId}})

    //res.json(await db.Chat.findAll());

}