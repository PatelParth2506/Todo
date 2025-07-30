import React, { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  getTodosByCategory,
  createTodo,
  updateTodoDescription,
  deleteTodoDescription,
  addTodoDescription,
  shareTodo,
  deleteTodo,
} from "../services/todoService";
import { jwtDecode } from "jwt-decode";
import Notification from "../components/Notification";
import { FaTrash, FaEdit, FaBars,FaTimes } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [allTodos, setAllTodos] = useState([]);
  const [displayedTodos, setDisplayedTodos] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [editableDescription, setEditableDescription] = useState("");
  const [editableDescriptionId, setEditableDescriptionId] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [newDescriptionText, setNewDescriptionText] = useState("");
  const [shareUserId, setShareUserId] = useState("");
  const [displayMode, setDisplayMode] = useState("sharedOnly");
  const [categories, setCategories] = useState({});
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // New state for sidebar

  const fetchAllTodos = async () => {
    const response = await getTodosByCategory(null);
    if (response) {
      setAllTodos(response);
    }
  };

  const fetchCategories = async () => {
    const response = await getCategories();
    if (response) {
      setCategories(response);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedInUserId(decodedToken.user_id);
    }
    fetchCategories();
    fetchAllTodos();
  }, []);

  useEffect(() => {
    let filtered = [];
    if (selectedCategory) {
      filtered = allTodos.filter(
        (todo) => todo.category_id === selectedCategory
      );
    } else {
      if (displayMode === "sharedOnly") {
        filtered = allTodos.filter(
          (todo) =>
            todo.TodoSharedTos &&
            todo.TodoSharedTos.some(
              (shared) => shared.sharedWithUser_id === loggedInUserId
            )
        );
      } else {
        filtered = allTodos;
      }
    }
    setDisplayedTodos(filtered);
  }, [allTodos, selectedCategory, displayMode, loggedInUserId]);

  const handleAddCategory = async () => {
    const response = await createCategory(newCategory);
    if (response) {
      fetchCategories();
      setNewCategory("");
      setNotification({ message: "Category added successfully!", type: "success" });
    } else {
      setNotification({ message: "Failed to add category.", type: "error" });
    }
  };    

  const handleAddTodo = async () => {
    const response = await createTodo(newTodo, selectedCategory);
    if (response) {
      await fetchAllTodos();
      setNewTodo("");
      setSelectedTodo(null);
      setEditableDescription("");
      setNotification({ message: "Todo added successfully!", type: "success" });
    } else {
      setNotification({ message: "Failed to add todo.", type: "error" });
    }
  };

  const handleTodoClick = (todoId) => {
    setSelectedTodo(selectedTodo === todoId ? null : todoId);
    setEditableDescription("");
    setEditableDescriptionId(null);
    setNewDescriptionText("");
  };

  const handleEditDescription = (description) => {
    setEditableDescription(description.todo_description);
    setEditableDescriptionId(description.todoDescription_id);
    setNewDescriptionText("");
  };

  const handleSaveDescription = async () => {
    if (editableDescriptionId) {
      const response = await updateTodoDescription(editableDescriptionId, editableDescription);
      if (response) {
        await fetchAllTodos();
        setEditableDescription("");
        setEditableDescriptionId(null);
        setNotification({ message: "Description updated successfully!", type: "success" });
      } else {
        setNotification({ message: "Failed to update description.", type: "error" });
      }
    }
  };

  const handleDeleteDescription = async (descriptionId) => {
    const response = await deleteTodoDescription(descriptionId);
    if (response) {
      await fetchAllTodos();
      setNotification({ message: "Description deleted successfully!", type: "success" });
    } else {
      setNotification({ message: "Failed to delete description.", type: "error" });
    }
  };

  const handleDeleteTodo = async (todoId) => {
    const response = await deleteTodo(todoId);
    if (response) {
      await fetchAllTodos();
      setNotification({ message: "Todo deleted successfully!", type: "success" });
    } else {
      setNotification({ message: "Failed to delete todo.", type: "error" });
    }
  };

  const handleAddDescription = async (todoId) => {
    if (newDescriptionText.trim() !== "") {
      const response = await addTodoDescription(todoId, newDescriptionText);
      if (response) {
        await fetchAllTodos();
        setNewDescriptionText("");
        setNotification({ message: "Description added successfully!", type: "success" });
      } else {
        setNotification({ message: "Failed to add description.", type: "error" });
      }
    }
  };

  const handleShareTodo = async (todoId) => {
    if (shareUserId.trim() !== "") {
      const shared = await shareTodo(todoId, shareUserId);
      setShareUserId("");

      if(shared){
        setNotification({ message: "Todo shared successfully!", type: "success" });
      } else {
        setNotification({ message: "Failed to share todo.", type: "error" });
      }

      await fetchAllTodos();
    }
  };

  return (
    <div className="container home-page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <FaTimes /> : <FaBars />} {sidebarOpen ? 'Hide Categories' : 'Show Categories'}
      </button>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>Categories</h2>
        <div className="category-list">
          {Array.isArray(categories.ownCategories) &&
            categories.ownCategories.map((cat) => (
              <div
                key={cat.category_id}
                className={`category-item ${
                  selectedCategory === cat.category_id ? "selected" : ""
                }`}
                onClick={() => {
                  if (selectedCategory === cat.category_id) {
                    setSelectedCategory(null);
                    setDisplayMode("sharedOnly");
                  } else {
                    setSelectedCategory(cat.category_id);
                    setDisplayMode("category");
                  }
                  setSidebarOpen(false); // Close sidebar on category select
                }}
              >
                {cat.category_name}
              </div>
            ))}

          {Array.isArray(categories.sharedCategories) &&
            categories.sharedCategories.length > 0 && (
              <h3 className="shared-title">Shared Categories</h3>
            )}

          {Array.isArray(categories.sharedCategories) &&
            categories.sharedCategories.map((cat) => (
              <div
                key={cat.category_id}
                className={`category-item shared ${
                  selectedCategory === cat.category_id ? "selected" : ""
                }`}
                onClick={() => {
                  if (selectedCategory === cat.category_id) {
                    setSelectedCategory(null);
                    setDisplayMode("sharedOnly");
                  } else {
                    setSelectedCategory(cat.category_id);
                    setDisplayMode("category");
                  }
                  setSidebarOpen(false); // Close sidebar on category select
                }}
              >
                {cat.category_name}
              </div>
            ))}
        </div>
        <div className="add-category">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
          />
          <button onClick={handleAddCategory}>Add</button>
        </div>
      </div>
      <div className="main-content">
        <h2>{`${
          (Array.isArray(categories) &&
            categories.sharedCategories?.find(
              (cat) => cat.category_id === selectedCategory
            ).category_name) ||
          categories.ownCategories?.find(
            (cat) => cat.category_id === selectedCategory
          )?.category_name ||
          "Shared"
        } Todos`}</h2>
        <div className="todo-list">
          {displayedTodos.map((todo) => (
            <div key={todo.todo_id} className="todo-item">
              <div className="todo-item-header">
                <div
                  onClick={() => handleTodoClick(todo.todo_id)}
                  className="todo-item-title"
                >
                  {todo.todo_title}
                </div>
                {loggedInUserId === todo.creted_by && (
                  <button onClick={() => handleDeleteTodo(todo.todo_id)}>
                    <FaTrash />
                  </button>
                )}
              </div>
              {selectedTodo === todo.todo_id && (
                <div className="todo-description-container">
                  {todo.TodoDescriptions?.length > 0 ? (
                    todo.TodoDescriptions.map((desc) => (
                      <div
                        key={desc.todoDescription_id}
                        className="todo-description-item"
                      >
                        {desc.todo_description}
                        <div>
                          {loggedInUserId === desc.created_by &&
                            loggedInUserId === todo.creted_by && (
                              <>
                                <button
                                  onClick={() => handleEditDescription(desc)}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteDescription(
                                      desc.todoDescription_id
                                    )
                                  }
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          {loggedInUserId === desc.created_by &&
                            loggedInUserId !== todo.creted_by && (
                              <>
                                <button
                                  onClick={() => handleEditDescription(desc)}
                                >
                                  <FaEdit />
                                </button>
                              </>
                            )}
                          {loggedInUserId !== desc.created_by &&
                            loggedInUserId === todo.creted_by && (
                              <>
                                <button
                                  onClick={() =>
                                    handleDeleteDescription(
                                      desc.todoDescription_id
                                    )
                                  }
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No descriptions yet. Add one below!</p>
                  )}
                  {editableDescriptionId ? (
                    <div className="todo-description-edit-area">
                      <textarea
                        value={editableDescription}
                        onChange={(e) => setEditableDescription(e.target.value)}
                      />
                      <button onClick={handleSaveDescription}>Save</button>
                    </div>
                  ) : (
                    <div className="todo-description-edit-area">
                      <textarea
                        value={newDescriptionText}
                        onChange={(e) => setNewDescriptionText(e.target.value)}
                        placeholder="Add a new description..."
                      />
                      <button
                        onClick={() => handleAddDescription(todo.todo_id)}
                      >
                        Add Description
                      </button>
                    </div>
                  )}
                  {loggedInUserId === todo.creted_by && (
                    <div className="share-todo-area">
                      <input
                        type="text"
                        placeholder="User ID to share with"
                        value={shareUserId}
                        onChange={(e) => setShareUserId(e.target.value)}
                      />
                      <button onClick={() => handleShareTodo(todo.todo_id)}>
                        Share Todo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {(selectedCategory && categories.ownCategories.find((cat)=>cat.category_id === selectedCategory)) && (
          <div className="add-todo">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="New Todo"
            />
            <button onClick={handleAddTodo}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
