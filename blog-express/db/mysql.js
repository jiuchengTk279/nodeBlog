const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/db')

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

// 统一执行的 sql 的函数
function exec (sql) {
  // 返回 promise 对象
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        // console.error(err)
        reject(err)
        return
      }
      // console.log(result)
      resolve(result)
    })
  })

  return promise
  
}

// 类似单例模式，保持连接不断

module.exports = {
  exec,
  escape: mysql.escape
}