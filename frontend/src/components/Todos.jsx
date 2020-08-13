import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { ApiService } from '../services/apiservice'
import { CircularProgress, Paper, IconButton } from '@material-ui/core'
import NoteAdd from '@material-ui/icons/NoteAdd'


let firsttime = true

export const Todos = props => {
  // When passing an array to the table, it will only
  // re-render if the array reference is changed because
  // it is based on the principle of using an immutable data array.
  // So instead of using
  // const [todos, setTodos] = useState([])
  // we'll wrap it to a 'state' - along with the columns that
  // otherwise could be just a const array
  const [state, setState] = useState({
    columns: [
      {
        title: 'Description',
        field: 'description',
        render: rowData => {
          if (!rowData.done && rowData.due_date) {
            // Moment would be so nice, but for the sake of practise...
            const tanaan = new Date(new Date().toISOString().split('T')[0])
            const due = new Date(
              new Date(rowData.due_date).toISOString().split('T')[0]
            )
            if (tanaan > due) {
              return (
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  {rowData.description}
                </span>
              )
            }
          }
          return rowData.description
        }
      },
      {
        title: 'Done',
        field: 'done',
        editable: 'onUpdate',
        type: 'boolean',
        width: 30
      },
      {
        title: 'Due date',
        field: 'due_date',
        editable: 'onUpdate',
        type: 'date',
        customSort: (a, b) => {
          const res = new Date(a.due_date) > new Date(b.due_date) ? -1 : 1
          return res
        },
        render: rowData =>
          rowData.due_date
            ? new Date(rowData.due_date).toISOString().split('T')[0]
            : ''
      },
      {
        title: 'Created',
        field: 'created',
        editable: 'never',
        sorting: false,
        render: rowData =>
          rowData.created
            ? new Date(rowData.created).toISOString().split('.')[0]
            : ''
      },
      {
        title: 'Id',
        field: 'id',
        editable: 'never',
        type: 'numeric',
        width: 30
      }
    ],
    todos: [],
    preServerCallTodos: [] // just in case our server call is a failure
  })
  const [loading, setLoading] = useState(false)

  const fetchAllTodos = () => {
    setLoading(true)
    ApiService.fetchAllTodos().then(data => {
      setLoading(false)
      if (firsttime) {
        firsttime = false
        data.sort((a, b) =>
          new Date(a.due_date) > new Date(b.due_date) ? 1 : -1
        )
      }
      setState(prevState => {
        return { ...prevState, todos: data }
      })
    })
  }
  const addNewTodo = todo => {
    // Add a new ToDo by calling the ApiService
    // The UI is optimistically updated as if the call would be instantateous
    // if server call in fact fails, return todo state to preServerCallTodos
    // and display a notification.
    ApiService.createTodo(todo)
      .then(added => {
        todo.id = added.id
        todo.done = added.done
        todo.created = added.created
        todo.due_date = added.due_date
        const copy = [added, ...state.todos]
        setState(prevState => {
          return { ...prevState, todos: copy }
        })
      })
      .catch(err => {
        alert('Failed: ' + err.message)
        setState(prevState => {
          const resetdata = [...prevState.preServerCallTodos]
          return { ...prevState, todos: resetdata }
        })
      })
  }

  const updateTodos = todo => {
    ApiService.updateTodo(todo)
      .then(updated => {
        // No need to do anything.., UI already updated
        // Still nice to know everything is fine
      })
      .catch(err => {
        // This might be because of a number of reasons.
        // To play it safe, let's reset our UI by re-fetching all
        // todos, just log the error to the console
        alert('Failed to update: ' + err.message)
        fetchAllTodos()
      })
  }

  const deleteTodo = todo => {
    ApiService.deleteTodo(todo.id)
      .then(deleted => {
        if (deleted) console.log('Deleted fine')
        else console.log('Not deleted, but not restoring old state')
      })
      .catch(err => {
        alert('Failed: ' + err.message)

        setState(prevState => {
          const resetdata = [...prevState.preServerCallTodos]
          return { ...prevState, todos: resetdata }
        })
      })
  }

  useEffect(() => {
    fetchAllTodos()
  }, [])

  if (loading)
    return (
      <Paper style={{ padding: '1em' }}>
        <div>
          Loading Todos <CircularProgress />
        </div>
      </Paper>
    )
  else
    return (
      <MaterialTable
        title='Todos'
        columns={state.columns}
            data={state.todos}
            
        options={{
          sorting: true,
          pageSize: 10,
            pageSizeOptions: [5, 10, 20, 50, 100],
          addRowPosition: 'first'
            }}
icons={{
        Add: props => <IconButton {...props} >
            Add <NoteAdd color="primary" fontSize="large"/> ToDo
        </IconButton>
    }}            
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve()
                setState(prevState => {
                  const data = [...prevState.todos]
                  const preServerCallTodos = [...data]
                  data.unshift(newData)
                  return { ...prevState, todos: data, preServerCallTodos }
                })
                addNewTodo(newData)
              }, 600)
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                if (oldData) {
                  newData.id = oldData.id
                  setState(prevState => {
                    const data = [...prevState.todos]
                    const preServerCallTodos = [...data]
                    data[data.indexOf(oldData)] = newData
                    return { ...prevState, todos: data, preServerCallTodos }
                  })
                  updateTodos(newData)
                  resolve()
                }
              }, 600)
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                setState(prevState => {
                  const data = [...prevState.todos]
                  const preServerCallTodos = [...data]
                  data.splice(data.indexOf(oldData), 1)
                  return { ...prevState, todos: data, preServerCallTodos }
                })
                deleteTodo(oldData)
                resolve()
              }, 600)
            })
        }}
      />
    )
}

export default Todos
