import React from 'react';
import { DatePicker } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { Button, Input } from 'reactstrap';
import moment from 'moment';

export const Header = (props) => {
    const { handleAdd, handleChageDate, date } = props;
    const [text, setText] = useState('');
    const AddTodo = () => {
        handleAdd(text);
        setText('')
        inputRef.current.focus()
    }

    const handleKeypress = (e) => {
        if (e.keyCode === 13) {
            AddTodo();
        }
    }
    const inputRef = useRef()
    useEffect(() => {
        inputRef.current.focus()
    }, [])
    return (
        <div className="header row m-1 p-4" >
            <div className="p-1 h1 text-primary text-center mx-auto display-inline-block">
                <i className="fas fa-check bg-primary text-white rounded p-2 mx-2" ></i>
                <u>My Todo-s</u>
            </div>
            <div className="row m-1 p-3">
                <div className="col col-11 mx-auto">
                    <div className="row bg-white rounded shadow-sm p-2 add-todo-wrapper align-items-center justify-content-center">
                        <div className="col">
                            <Input
                                placeholder="Add new .." autoFocus
                                value={text}
                                bsSize="sm"
                                ref={inputRef}
                                onChange={e => setText(e.target.value)}
                                onKeyUp={handleKeypress}
                            />
                        </div>
                        <div className="col-auto m-0 px-2 d-flex align-items-center">
                            <DatePicker
                                onChange={handleChageDate}
                                placeholder="Due_date..."
                                value={date ? moment(date) : ""}
                            />
                        </div>
                        <div className="col-auto px-0 mx-0 mr-2">
                            <Button
                                onClick={AddTodo}
                                color="success"
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    )
}
