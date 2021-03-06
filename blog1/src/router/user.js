const { login } = require('../controller/user')
const { set } = require('../db/redis')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 获取 cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  console.log('d.toGMTString() is ', d.toGMTString())
  return d.toGMTString()
}


const handleUserRouter = (req, res) => {
  const method = req.method
  // const url = req.url
  // const path = url.split('?')[0]

  // 登录
  if (method === 'POST' && req.path === '/api/user/login') {
    
    const { username, password } = req.body
    // const { username, password } = req.query
    const result = login(username, password)

    return result.then(data => {
      if (data.username) {

        // 操作 cookie
        // username  登录的用户名
        // path=/    保证 cookie 在前端所有路由都是生效的
        // httpOnly  保证数据不被前端修改
        // expires   保证设置过期时间
        // res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)

        // 设置 session
        req.session.username = data.username
        req.session.realname = data.realname

        console.log('req session is', req.session)

        // 同步到 redis
        set(req.sessionId, req.session)

        return new SuccessModel()
      }
      return new ErrorModel('登录失败')
    })
  }


  // 登录验证的测试
  // if (method === 'GET' && req.path === '/api/user/login-test') {
  //   if (req.session.username) {
  //     return Promise.resolve(new SuccessModel({
  //       session: req.session
  //     }))
  //   }
  //   return Promise.resolve(new ErrorModel('尚未登录'))
  // }
}

module.exports = handleUserRouter