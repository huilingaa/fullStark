const mongoose = require('mongoose')

module.exports = () => {
  const user = 'employment'
  const password = 'ctkj.mc123'
  const DB_URL = `mongodb://${user}:${password}@127.0.0.1:27017/employment`
  // const DB_URL = `mongodb://${user}:${password}@10.15.5.134:27017/employment`
  // const DB_URL = `mongodb://${user}:${password}@101.132.166.73:27017/employment`
  const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
  global.ObjectId = mongoose.Types.ObjectId

  mongoose.connect(DB_URL, config, (err) => {
    if (err) {
      console.log('连接失败', err)
    } else {
      console.log('Mongdb连接成功')
    }
  })
}
// db.createUser({user:"admin",pwd:"ctkj.mc123",roles:["dbAdmin"]})
