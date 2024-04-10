import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar.js";

import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import Footer from "./Footer.js";

function App() {
  let initialTodo;
  if (localStorage.getItem("todos") === null) {
    initialTodo = [];
  } else {
    initialTodo = JSON.parse(localStorage.getItem("todos"));
  }

  const [todos, setTodos] = useState(initialTodo);
  const [showFinished, setshowFinished] = useState(true);
  const [todo, setTodo] = useState({
    id: uuidv4(),
    title: "",
    description: "",
    isComplete: false,
  });

  const handleReset = () =>{
    setTodo({
      id:uuidv4(),
      title: "",
      description: "",
      isComplete: false,
    });
    setErrors({
      id:"",
      title: "",
      description: "",
      isComplete: "",
    })
  }

  const [errors, setErrors] = useState({
    id:"",
    title: "",
    description: "",
    isComplete: "",
  });

  const handleTitleChange = (value) => {
    if (value.trim().length > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "Title must not have more than 10 characters.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
    }
    setTodo((prevData) => ({ ...prevData, title: value.slice(0, 10) }));
  };

  const handleDescriptionChange = (value) => {
    if (value.trim().length > 25) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: "Description must not have more than 25 characters.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, description: "" }));
    }
    setTodo((prevData) => ({ ...prevData, description: value.slice(0, 25) }));
  };

  useEffect(() => {
    const saveToLS = () => {
      localStorage.setItem("todos", JSON.stringify(todos));
    };
    saveToLS();
  }, [todos]);

  const showDescription = (id) => {
    let t = todos.filter((item) => item.id === id);
    console.log(t);
    Swal.fire({
      title: "Description",
      text: t[0].description,
      confirmButtonColor: "rgb(28,20,117)",
      confirmButtonText: "Ok",
    });
  };

  const handleEdit = (id) => {
    let t = todos.filter((item) => item.id === id);
    console.log(t[0])
    if (t[0].isComplete === false) {
      setTodo({
        id: t[0].id,
        title: t[0].title,
        description: t[0].description,
        isComplete: t[0].isComplete,
      })
      let newTodos = todos.filter((item) => {
        return item.id !== id;
      });
      console.log(newTodos);
      setTodos(newTodos);
    }
    else{
      Swal.fire({
        title: "Task Completed",
        text: "Finished Task can't be edited.",
        confirmButtonColor: "rgb(10,150,10)",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleDelete = (id) => {
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    console.log(newTodos)
    setTodos(newTodos);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex((item) => {
      return item.id === id;
    });
    let newTodos = [...todos];
    newTodos[index].isComplete = !newTodos[index].isComplete;
    setTodos(newTodos);
  };

  const toggleFinished = (e) => {
    setshowFinished(!showFinished);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    console.log(todo)
    if(todo.title.trim() === ""){
      errors.title = "Title field cannot be empty.";
    }

    const titles = todos.map((item)=>({
      title: item.title,
    }))
    console.log(titles)

    const duplicateCheck = titles.find(
      (item)=>item && item.title === todo.title
    );

    if(duplicateCheck){
      errors.title = "Task with same title already listed.";
    }

    if(Object.keys(errors).length > 0){
      setErrors(errors)
      return;
    }

    setTodos([
      ...todos,
      todo
    ]);

    handleReset();
  };

  return (
    <div className="App">
      <Navbar />
      <div className="main">
        <h3>Manage you daily tasks here...</h3>
        <form onSubmit={handleSubmit} className="add-task">
          <h5>Add you Tasks here</h5>
          <input
            type="text"
            placeholder="Title"
            value={todo.title}
            onChange={(e) =>
              handleTitleChange(e.target.value)
            }
            autoFocus
          />
          {errors.title && <div className="error">{errors.title}</div>}
          <input
            type="text"
            placeholder="Description"
            value={todo.description}
            onChange={(e) =>
              handleDescriptionChange(e.target.value)
            }
          />
          {errors.description && <div className="error">{errors.description}</div>}
          <button className="add" type="submit">
            Add
          </button>
        </form>

        <div className="finish">
          <input
            onChange={toggleFinished}
            type="checkbox"
            checked={showFinished}
          />
          <label htmlFor="show">Show Finished Tasks</label>
        </div>
        <h2>Your Tasks</h2>
        <div className="todos scroll-container">
          {todos.length === 0 && (
            <div className="m-12">No tasks to accomplish.</div>
          )}
          {todos.map((item) => {
            return (
              (showFinished || !item.isComplete) && (
                <div key={item.id} className="todo">
                  <div className="content">
                    <input
                      type="checkbox"
                      name={item.id}
                      checked={item.isComplete}
                      onChange={handleCheckbox}
                    />
                    <div
                      className={`${
                        item.isComplete ? "strikethrough" : undefined
                      } display`}
                    >
                      {item.title}
                    </div>
                    <button
                      className="info"
                      onClick={() => showDescription(item.id)}
                    >
                      <IoIosInformationCircleOutline />
                    </button>
                  </div>
                  <div className="buttons">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="edit-delete"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(item.id);
                      }}
                      className="edit-delete"
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
