// const bcrypt = require('bcrypt')
// onst crypto = require('crypto');
const { jsonwebtokenSign } = require('../../plugins/jwt')
const { isReceiveEmptys, getCtxIp } = require('../../plugins/common')
const { Encrypt } = require('../../plugins/lock')
const { User } = require('../../utils/dbModelExports')

module.exports = async router => {
  /**
       * @swagger
       * /login:
       *   post:
       *     description: 登录获取token
       *     tags: [User]
       *     parameters:
       *       - name: username
       *         type: string
       *         required: true
       *         description: 用户账号
       *       - name: password
       *         type: string
       *         required: true
       *         description: 用户密码
       *     responses:
       *       200:
       *         description: 返回用户信息及token
       *         schema:
       *           example:
       *              {data: {
       *                user: '用户信息',
       *                token: 'token'
       *              }
       *              }
    */

  router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body
    if (isReceiveEmptys(username, password)) {
      ctx.throw('400', '用户名或密码不能为空')
    }

    const data = await User.findOne(
      { username: username, password: Encrypt(password) },
      { created_at: 0, updated_at: 0, openid: 0, password: 0 }
    ).lean()
    if (!data) {
      ctx.throw('400', '用户名或密码不正确,请重新登陆!')
    }

    ctx.body = {
      user: data,
      token: jsonwebtokenSign({
        _id: data._id,
        name: data.name,
        ip: getCtxIp(ctx.ip)
      })
    }
    await next()
  })
}
