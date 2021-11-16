import React, { memo } from 'react'
import Todoitem from './Todoitem';
import { useHistory } from 'react-router-dom';


function Content(props) {
    const { todos, handleRemove, markCompleted, handleEdit,
        status, sortTime, onFilterDate, onFilterStatus, handleTheme, theme } = props;
    const history = useHistory();
    return (
        <div className="content">
            <div className="row m-1 p-3 px-5 justify-content-end">
                <div className="col-auto d-flex align-items-center">
                    <label className="text-secondary my-2 pr-2 view-opt-label">Filter</label>
                    <select className="custom-select custom-select-sm btns my-2 border-secondary mx-3"
                        value={status}
                        onChange={(e) => {
                            history.push(sortTime || status || (sortTime && status) ? { search: `?status=${e.target.value}&sortBy=${sortTime}` } : { search: `?status=${e.target.value}` })
                            onFilterStatus(e.target.value)
                        }}
                    >
                        <option value="all" >All</option>
                        <option value="completed">Completed</option>
                        <option value="active">Active</option>
                    </select>
                </div>
                <div className="col-auto d-flex align-items-center px-1 pr-3">
                    <label className="text-secondary my-2 view-opt-label mx-3">Sort</label>
                    <select className="custom-select custom-select-sm btns my-2 border-secondary"
                        value={sortTime}
                        onChange={(e) => {
                            onFilterDate(e.target.value)
                            history.push(sortTime || status || (sortTime && status) ? { search: `?sortBy=${e.target.value}&status=${status}` } : { search: `?sortBy=${e.target.value}` })
                        }}
                    >
                        <option value="dateUp"  >DateUp</option>
                        <option value="dateDown" >DateDown</option>
                    </select>
                </div>
            </div>
            <div className=" row mx-1 px-4 w-80">
                {todos.map((todo, index) => {
                    return <Todoitem
                        content={todo.content}
                        key={index}
                        index={index}
                        todo={todo}
                        handleRemove={handleRemove}
                        markCompleted={markCompleted}
                        handleEdit={handleEdit}
                        todos={todos}
                    />
                })}
            </div>
            <div className="theme-switch-wrapper">
                <label className="theme-switch" htmlFor="checkbox">
                    <input
                        type="checkbox"
                        id="checkbox"
                        checked={theme.isLightTheme}
                        onClick={() => handleTheme()}
                    />
                    <div className="slider round"></div>
                </label>
            </div>
        </div>
    )
}

export default memo(Content)
