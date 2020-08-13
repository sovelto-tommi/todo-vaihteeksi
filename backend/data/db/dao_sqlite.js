const sqlite3 = require('sqlite3').verbose()
const config = require('../../config')
const debug = require('debug')('todoserver:dao:sqlite3')

// We want to use Promises, so instead of getting yet
// another npm package I've coded a callback -> Promise
// class for the SQLLite database requests I need in this
// project
class PromisedSQLite {
  static select (sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
  static insert (sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(this.lastID) // created id
        }
      })
    })
  }
  static modify (sql, params = []) {
    debug(sql, params)
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(this.changes) // how many were modified
        }
      })
    })
  }
}

// Connect to a database, or create one if it doesn't exist
const db = new sqlite3.Database(config.db.SQLiteDBName, err => {
  if (err) {
    console.error(err.message)
    process.exit(2)
  }
  debug('Connected to the SQlite database.')
  db.run(
    'CREATE TABLE IF NOT EXISTS todo (id integer primary key autoincrement, description text not null, done boolean not null default false, due_date date default current_date, created timestamp default current_timestamp)',
    err => {
      if (err) {
        console.error('Unable to create table', err.message)
        process.exit(2)
      }
      //testmydb()
    }
  )
})

class SQLiteDao {
  // return created todo's id
  static createTodo (description) {
    return PromisedSQLite.insert('INSERT INTO todo(description) VALUES($1)', [
      description
    ])
  }
  static readAll () {
    return PromisedSQLite.select('SELECT * FROM todo').then(rows => {
      return rows //.map(r => todoFromDbRow(r))
    })
  }
  static read (id) {
    return PromisedSQLite.select('SELECT * FROM todo WHERE id = $1', id).then(
      rows => {
        if (rows.length === 0) return null
        if (rows.length === 1) return /*userFromDbRow(*/ rows[0] /*)*/
        throw new Error(
          "Multiple todos with the same id, shouldn't be possible though..."
        )
      }
    )
  }
  static setDone(id, undone) {
    undone = undone ? 0 : 1
    const sql = 'UPDATE todo SET done = $1 WHERE id = $2'  // 'UPDATE todo SET done = $1 WHERE id = $2 AND done <> $1'
    return PromisedSQLite.modify(sql,
      [undone, id]).then(res => {
      return res > 0
    })
  }
  static modifyDueDate(id, duedate) {
    const sql = 'UPDATE todo SET due_date = $1 WHERE id = $2' 
    return PromisedSQLite.modify(sql, [duedate, id]).then(res => {
      return res > 0
    })
    
  }
  static modifyDescription(id, description) {
    const sql = 'UPDATE todo SET description = $1 WHERE id = $2' 
    return PromisedSQLite.modify(sql, [description, id]).then(res => {
      return res > 0
    })    
  }
  static delete (id) {
    return PromisedSQLite.modify('DELETE FROM todo WHERE id = $1', id).then(
      res => {
        return res > 0
      }
    )
  }
}

// Some dummy code to check the db is used ok
// async function testmydb () {
//   const id = await SQLiteDao.createTodo('This is the end')
//   console.log('Id:', id)
//   const one = await SQLiteDao.read(id)
//   console.log('One:', one)
//   await SQLiteDao.createTodo('Shmiley')
//   await SQLiteDao.createTodo('Shmiley, filey')
//   let all = await SQLiteDao.readAll()
//   console.log('All:', all)

//   console.log('Deleted', await SQLiteDao.delete(id))

//   all = await SQLiteDao.readAll()
//   console.log('All:', all)
//   console.log("setDone", await SQLiteDao.setDone(id + 1))
//   console.log('Done?', await SQLiteDao.read(id + 1))
//   await SQLiteDao.setDone(id + 1, true)
//   console.log('Undone?', await SQLiteDao.read(id + 1))
//   console.log('resettodone', await SQLiteDao.setDone(id + 1, true))
//   console.log('Undone again?', await SQLiteDao.read(id + 1))
//   console.log('setDone', await SQLiteDao.setDone(id))
//   console.log('setDone to', await SQLiteDao.read(id))

//   await SQLiteDao.modifyDueDate(id + 1, '2020-09-08')
//   console.log('duedate to', await SQLiteDao.read(id + 1))
//   await SQLiteDao.modifyDescription(id + 1, 'Kuukkeli ei toiminut..')
//   console.log('description to', await SQLiteDao.read(id + 1))  
// }


module.exports = SQLiteDao
