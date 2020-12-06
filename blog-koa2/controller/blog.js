// controller 只关心数据
const { exec } = require('../db/mysql')
const xss = require('xss')

const getList = async (author, keyword) => {
  // 先返回假数据，格式是正确的
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  // 返回 promise
  return await exec(sql)
}


const getDetail = async (id) => {
  // 先返回的数据
  const sql = `select * from blogs where id='${id}'`
  const rows = await exec(sql)
  return rows[0]

  // return await exec(sql).then(rows => {
  //   return rows[0]
  // })
}


const newBlog = async (blogData = {}) => {
  // blogData 是一个博客对象，包含 title、content 属性
  // console.log('newBlog blogData...', blogData)

  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const author = blogData.author
  const createtime = Date.now()

  const sql = `insert into blogs (title, content, createtime, author)
              values ('${title}', '${content}', ${createtime}, '${author}');`
  
  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }

  // return await exec(sql).then(insertData => {
  //   console.log('insertData is ', insertData)
  //   return {
  //     id: insertData.insertId
  //   }
  // })

}


const updateBlog = async (id, blogData = {}) => {
  // id 就是要更新博客的 id
  // blogData 是一个博客对象，包含 title、content 属性
  
  const title = xss(blogData.title)
  const content = xss(blogData.content)

  const sql = `update blogs set title='${title}', content='${content}' where id=${id}`

  const updateData = await exec(sql)
  if (updateData.affectedRows > 0) {
    return true
  }
  return false


  // return await exec(sql).then(updateData => {
  //   console.log('updateData is', updateData)
  //   if (updateData.affectedRows > 0) {
  //     return true
  //   }
  //   return false
  // })
}


const deleteBlog = async (id, author) => {
  // id 就是要更新博客的 id
  const sql = `delete from blogs where id=${id} and author='${author}';`

  const delData = await exec(sql)
  if (delData.affectedRows > 0) {
    return true
  }
  return false

  // return await exec(sql).then(delData => {
  //   if (delData.affectedRows > 0) {
  //     return true
  //   }
  //   return false
  // })
}


module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}