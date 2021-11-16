import React, { memo } from 'react'
import { useState, useRef, useEffect } from 'react';


function Todoitem(props) {
    const { todo, handleRemove, markCompleted, handleEdit } = props;
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(todo.content)

    const removeTodo = () => {
        handleRemove(todo._id)
    }

    const checkedInput = () => {
        markCompleted(todo._id)
    }

    const inputRef = useRef()


    const _toggleEditInput = () => {
        setEditing(true)
    }

    const EditTodo = () => {
        handleEdit(todo._id, value);
        setEditing(false);
    }

    useEffect((prev) => {
        if (prev !== todo.content) {
            setValue(todo.content)
        }
    }, [todo.content])

    useEffect(() => {
        inputRef.current.focus();
    })
    return (
        <div className="items p-1 h1 mx-auto " >
            <div className="item col-auto m-1 p-0 ">
                <input type="checkbox"
                    className=" display-inline-block mx-auto "
                    onChange={checkedInput}
                    checked={todo.status}
                />
                <input type="text"
                    value={value}
                    style={{ 'textDecoration': todo.status ? 'line-through' : 'none' }}
                    disabled={!editing}
                    ref={inputRef}
                    onBlur={EditTodo}
                    onChange={e => setValue(e.target.value)}
                />
            </div>
            <div className="duedate">
                {todo.due_date}
            </div>
            <div className="edit align-items-center">
                <h5 className="m-0 p-0 px-2">
                    <i className="fa fa-edit text-info btn m-0 p-0"
                        data-toggle="tooltip"
                        data-placement="bottom" title="Edit todo"
                        // style={{ 'visibility': todo.status ? 'hidden' : 'auto' }}
                        onClick={_toggleEditInput}
                    ></i>
                </h5>
                <h5 className="m-0 p-0 px-2">
                    <i
                        className="fa fa-trash-o text-danger btn m-0 p-0"
                        data-toggle="tooltip" data-placement="bottom" title="Delete todo"
                        onClick={removeTodo}
                    >
                    </i>
                </h5>
            </div>
        </div>
    )
}

export default memo(Todoitem)

