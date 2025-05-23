import { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch todos from backend with error handling
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/todos");
        setTodos(response.data);
      } catch (error) {
        handleNetworkError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const validateInput = (field, value) => {
    const errors = {};
    if (field === "title") {
      if (!value.trim()) errors.title = "Title is required";
      else if (value.length > 50) errors.title = "Title must be ≤50 characters";
    }
    if (field === "description") {
      if (value.length > 100)
        errors.description = "Description must be ≤100 characters";
    }
    setErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleNetworkError = (error) => {
    if (error.response) {
      showMessage(`Server error: ${error.response.status}`, "error");
    } else if (error.request) {
      showMessage("Network error - backend server may be down", "error");
    } else {
      showMessage("Request setup error", "error");
    }
  };

  const handleAddTodo = async () => {
    const validationErrors = {};
    if (!newTodo.title.trim()) validationErrors.title = "Title is required";
    if (newTodo.title.length > 50)
      validationErrors.title = "Title must be ≤50 characters";
    if (newTodo.description.length > 100)
      validationErrors.description = "Description must be ≤100 characters";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:8080/api/todos", newTodo);
      showMessage("Todo added successfully!", "success");
      setNewTodo({ title: "", description: "" });
      // Refresh the list instead of reloading the page
      const response = await axios.get("http://localhost:8080/api/todos");
      setTodos(response.data);
    } catch (error) {
      handleNetworkError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      showMessage("Todo deleted successfully!", "success");
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      handleNetworkError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (id, completed) => {
    setIsLoading(true);
    try {
      await axios.patch(`http://localhost:8080/api/todos/${id}`, {
        completed: !completed,
      });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      handleNetworkError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEditing = (id, todo) => {
    setEditId(id);
    setEditData({ title: todo.title, description: todo.description });
    setErrors({});
  };

  const handleSaveEdit = async (id) => {
    const validationErrors = {};
    if (!editData.title.trim()) validationErrors.title = "Title is required";
    if (editData.title.length > 50)
      validationErrors.title = "Title must be ≤50 characters";
    if (editData.description.length > 100)
      validationErrors.description = "Description must be ≤100 characters";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/todos/${id}`, editData);
      showMessage("Todo updated successfully!", "success");
      setEditId(null);
      // Refresh the list
      const response = await axios.get("http://localhost:8080/api/todos");
      setTodos(response.data);
    } catch (error) {
      handleNetworkError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setErrors({});
  };

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8080/api/todos/summarize");
      showMessage("Summary sent to Slack!", "success");
    } catch (error) {
      if (error.response?.status === 429) {
        showMessage(
          "Too many requests. Please wait 1 minute before trying again.",
          "error"
        );
      } else {
        handleNetworkError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <div className="app">
      <header>
        <h1>Todo Summary Assistant</h1>
      </header>

      <div className="container">
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="add-todo">
          <div className="input-fields">
            <div className="input-group">
              <input
                type="text"
                placeholder="Title"
                value={newTodo.title}
                onChange={(e) => {
                  setNewTodo({ ...newTodo, title: e.target.value });
                  validateInput("title", e.target.value);
                }}
                className={errors.title ? "error" : ""}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="input-group">
              <textarea
                placeholder="Description"
                value={newTodo.description}
                onChange={(e) => {
                  setNewTodo({ ...newTodo, description: e.target.value });
                  validateInput("description", e.target.value);
                }}
                className={errors.description ? "error" : ""}
                rows="3"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
          </div>

          <button
            className="add-button"
            onClick={handleAddTodo}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Todo"}
          </button>
        </div>

        {isLoading && todos.length === 0 ? (
          <div className="loading">Loading todos...</div>
        ) : (
          <div className="todos-list">
            {todos.length === 0 ? (
              <p className="empty-message">No todos yet. Add one above!</p>
            ) : (
              <ul>
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className={todo.completed ? "completed" : ""}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id, todo.completed)}
                      disabled={isLoading}
                    />

                    {editId === todo.id ? (
                      <div className="edit-group">
                        <div className="input-group">
                          <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => {
                              setEditData({
                                ...editData,
                                title: e.target.value,
                              });
                              validateInput("title", e.target.value);
                            }}
                            className={errors.title ? "error" : ""}
                          />
                          {errors.title && (
                            <span className="error-message">
                              {errors.title}
                            </span>
                          )}
                        </div>
                        <div className="input-group">
                          <textarea
                            value={editData.description}
                            onChange={(e) => {
                              setEditData({
                                ...editData,
                                description: e.target.value,
                              });
                              validateInput("description", e.target.value);
                            }}
                            className={errors.description ? "error" : ""}
                            rows="2"
                          />
                          {errors.description && (
                            <span className="error-message">
                              {errors.description}
                            </span>
                          )}
                        </div>
                        <div className="edit-actions">
                          <button
                            onClick={() => handleSaveEdit(todo.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="todo-content">
                          <h4>{todo.title}</h4>
                          <p>{todo.description}</p>
                        </div>
                        <div className="actions">
                          <button
                            onClick={() => handleStartEditing(todo.id, todo)}
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="summary-section">
          <button
            onClick={handleSummarize}
            disabled={
              todos.filter((todo) => !todo.completed).length === 0 || isLoading
            }
          >
            {isLoading ? "Processing..." : "Generate & Send Summary to Slack"}
          </button>
          <p>Pending todos: {todos.filter((todo) => !todo.completed).length}</p>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
