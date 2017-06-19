const Sequelize = require('sequelize');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const jwt = require('jsonwebtoken');
const { util } = require('./util/util');
const User = require('./models/user');
const config = require('./config');

const sequelize = new Sequelize(config.database, config.username, config.password, config.params);

const Users = sequelize.define('users', User);

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());
app.use(router.routes());

const server = app.listen(config.port);

sequelize.sync();

router.post('/user', async(ctx, next) => {
  try {
    const { password, username, email } = ctx.request.body;
    const token = jwt.sign({ password, username, email }, config.jwtsecret)
    ctx.body = await Users.create({ email, username, token, password: utilgenerateHash(password) });
  } catch(err) {
    console.log(err);
  }
})

router.del('/user/:id', async(ctx, next) => {
  const deleted = await Users.destroy({
    where: {
      id: ctx.params.id,
    }
  });
  if (deleted !== 0) {
    ctx.body = 'Successfully deleted';
  } else {
    ctx.body = 'User not found';
  }
})

router.post('/login', async(ctx, next) => {
  try {
    const { email, password } = ctx.request.body;
    let result;
    const user = await Users.findOne({
      where: {
        email
      }
    });
    if (!user) {
      ctx.body = 'No such user';
    }
    if (util.checkPassword(password, user.password)) {
      ctx.body = user.token;
    } else {
      ctx.body = 'Wrong password';
    }
  } catch(err) {
    console.log(err);
  }
})

router.get('/user/:id', async(ctx, next) => {
  try {
    ctx.body = await Users.findById(ctx.params.id);
  } catch(err) {
    console.log(err);
  }
})

router.put('/user/:id', async(ctx, next) => {
  try {
    await Users.update(ctx.request.body, {
      where: {
        id: ctx.params.id,
      }
    })
  } catch(err) {
    console.log(err);
  }
})

router.get('/users', async(ctx, next) => {
  try {
    ctx.body = await Users.findAll();
  } catch(err) {
    console.log(err);
  }
})
