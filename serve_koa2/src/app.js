const Koa = require('koa')
const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const cors = require('@koa/cors')
const serve = require('koa-static')
const logger = require('koa-logger')
const compress = require('koa-compress')
const koaBody = require('koa-body')
const { tokenVerification } = require('./plugins/jwt')

global.secretOrPrivateKey = 'xstxhjh'
global._ = _
global.devEnv = process.env.NODE_ENV == 'development'
global.moment = moment
global.imgurl = 'http://xbwapp.wtc.edu.cn/employment'
global.weapp_access_token = {
  session_key: '',
  time: moment().subtract(1, 'days').valueOf()
}

require('./plugins/db')() // 连接数据库
const app = new Koa()

// 全局捕获错误及数据返回格式处理 中间件
require('./utils/errorCatch.js')(app)

app.use(cors())

const staticPath = '../static'
const uploads = '../uploads'
// 静态资源
app.use(serve(
  path.join(__dirname, staticPath)
))
app.use(serve(
  path.join(__dirname, uploads)
))
// 日志
app.use(logger())

// 数据处理，支持文件上传 https://github.com/dlau/koa-body
app.use(koaBody({ multipart: true }))

// gzip 压缩
app.use(compress({
  filter: function (contentType) {
    return /text/i.test(contentType)
  },
  threshold: 2048
}))

// 校验token
app.use(tokenVerification)

require('./utils/routersApi.js')(app)

// 生成api文档
if (devEnv) {
  const { koaSwagger } = require('koa2-swagger-ui')
  app.use(koaSwagger({
    routePrefix: '/swagger.html',
    swaggerOptions: {
      url: '/swagger.json'
    }
  }))
  const swagger = require('./utils/swagger')
  app.use(swagger.routes(), swagger.allowedMethods())
}

/* 启动 */
const port = 8812
app.listen(port, () => {
  console.log(`运行中: http://localhost:${port}`)
})
