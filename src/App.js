import { Header } from "./component/Header";
import Content from "./component/Content";
import "./assets/index.css";
import React from "react";
import "antd/dist/antd.css";
import { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import Pagination from "./component/Pagination";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [date, setDate] = useState(null);
  const [sortStatus, setSortStatus] = useState("all");
  const [sortTime, setSortTime] = useState("dateUp");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 4;
  const [theme, setTheme] = useState({
    isLightTheme: true,
    light: {
      background: "rgb(240,240,240)",
      color: "black",
    },
    dark: {
      background: "rgb(39,39,39)",
      color: "white",
    },
  });

  const history = useHistory();
  const api = "https://todo-app-sv.herokuapp.com";

  const { search } = useLocation();

  const getTodos = (term = {}) => {
    axios
      .get(api + "/todos", {
        params: {
          // page: currentPage,
          limit: 4,
          page: 1,
          ...term,
        },
      })
      .then((res) => {
        const { itemPage, pages } = res.data;
        setTodos(itemPage);
        setPageCount(pages.pageCount);
      });
  };
  console.log(currentPage)
  useEffect(() => {
    const { page = 1, status, sortBy, limit } = queryString.parse(search);
    setCurrentPage(+page - 1)
    if (status === "completed") {
      setSortStatus(status);
      getTodos({ status: true, limit, page });
    }
    if (status === "active") {
      setSortStatus(status);
      getTodos({ status: false, limit, page });
    }
    if (status === "all") {
      setSortStatus(status);
      getTodos({ limit, page });
    }
    if (status !== "active" && status !== "all" && status !== "completed") {
      getTodos({});
    }
    setPageCount(Math.ceil(todos.length / PAGE_SIZE));
  }, []);

  const handlePageClick = (event) => {
    const currentP = event.selected + 1;
    setCurrentPage(event.selected)
    history.push({
      search: `?page=${currentP}&limit=${PAGE_SIZE}&status=${(sortStatus === "active" && "active") ||
        (sortStatus === "completed" && "completed") ||
        (sortStatus === "all" && "all")
        }&order=${(sortTime === "dateDown" && "desc") || (sortTime === "dateUp" && "asc")}`,
    });
    if (sortStatus !== "all") {
      getTodos({
        page: currentP,
        limit: PAGE_SIZE,
        status:
          (sortStatus === "active" && false) ||
          (sortStatus === "completed" && true),
        order:
          (sortTime === "dateDown" && "desc") ||
          (sortTime === "dateUp" && "asc"),
      });
    } else {
      getTodos({
        page: currentP,
        limit: PAGE_SIZE,
        order:
          (sortTime === "dateDown" && "desc") ||
          (sortTime === "dateUp" && "asc"),
      });
    }
  };

  const handleTheme = () => {
    setTheme({ ...theme, isLightTheme: !theme.isLightTheme });
  };

  const handleAdd = async (todo) => {
    const data = await fetch(api + "/todo/new", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        content: todo,
        due_date: date,
      }),
    }).then((res) => res.json());
    if (todo.trim() !== "") {
      setTodos((prev) => [data, ...prev]);
    } else {
      alert("Error");
    }

    setDate("");
  };

  const handleRemove = async (id) => {
    const data = await fetch(api + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());
    const newTodo = todos.filter((item) => item._id !== data._id);
    setTodos(newTodo);
  };

  const handleChageDate = (value) => {
    if (value) {
      const newDate = value.format("MM/DD/YYYY");
      setDate(newDate);
    }
  };

  const handleEdit = async (id, value) => {
    const data = await fetch(api + "/todo/update/" + id, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        content: value,
      }),
    }).then((res) => res.json());
    const newTodo = todos.map((item) => {
      if (item._id !== data._id) return item;

      return { ...item, content: value };
    });
    setTodos(newTodo);
  };

  const markCompleted = async (id) => {
    const data = await fetch(api + "/todo/status/" + id).then((res) =>
      res.json()
    );
    setTodos((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...item, status: !item.status } : item
      )
    );
  };

  const filterStatus = async (status) => {
    setSortStatus(status);
    setCurrentPage(0)
    switch (status) {
      case "completed":
        return getTodos({ status: true, page: 1 });
      case "active":
        return getTodos({ status: false, page: 1 });
      case "all":
        return getTodos({});
      default:
        throw new Error("Error");
    }
  };

  const filterDate = async (time) => {
    setSortTime(time);
    switch (time) {
      case "dateUp":
        if (sortStatus === "completed") {
          return getTodos({ order: "asc", page: 1, status: true });
        }
        if (sortStatus === "active") {
          return getTodos({ order: "asc", page: 1, status: false });
        }
        return getTodos({ order: "asc", page: 1 });
      case "dateDown":
        if (sortStatus === "completed") {
          return getTodos({ order: "desc", page: 1, status: true });
        }
        if (sortStatus === "active") {
          return getTodos({ order: "desc", page: 1, status: false });
        }
        return getTodos({ order: "desc", page: 1 });
      default:
        throw new Error("Error");
    }
  };

  const style = theme.isLightTheme ? { ...theme.light } : { ...theme.dark };

  return (
    <div
      className="App container m-5 p-2 rounded mx-auto shadow "
      style={style}
    >
      <Header
        handleAdd={handleAdd}
        todos={todos}
        handleChageDate={handleChageDate}
        date={date}
      />
      <Content
        handleEdit={handleEdit}
        handleRemove={handleRemove}
        status={sortStatus}
        todos={todos}
        markCompleted={markCompleted}
        sortTime={sortTime}
        onFilterDate={filterDate}
        onFilterStatus={filterStatus}
        handleTheme={handleTheme}
        theme={theme}
      />
      <Pagination
        handlePageClick={handlePageClick}
        pageCount={pageCount}
        currentPage={+currentPage}
      />
    </div>
  );
}
