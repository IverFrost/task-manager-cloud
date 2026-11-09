import { useEffect, useMemo, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve tasks when the application starts.
  async function loadTasks() {
    try {
      setError("");
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError("Could not load tasks. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Calculate dashboard statistics.
  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingCount = tasks.length - completedCount;

  const filteredTasks = useMemo(() => {
    if (filter === "pending") {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }, [tasks, filter]);

  // Create a new task.
  async function handleCreateTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      setError("");

      const newTask = await createTask({
        title: title.trim(),
        description: description.trim() || null,
      });

      setTasks((previous) => [...previous, newTask]);

      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Could not create the task.");
      console.error(err);
    }
  }

  // Toggle task completion.
  async function handleToggleTask(task) {
    try {
      setError("");

      const updatedTask = await updateTask(task.id, {
        completed: !task.completed,
      });

      setTasks((previous) =>
        previous.map((item) =>
          item.id === task.id ? updatedTask : item
        )
      );
    } catch (err) {
      setError("Could not update the task.");
      console.error(err);
    }
  }

  // Begin editing a task.
  function startEditing(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  }

  // Save task changes.
  async function handleSaveEdit(event) {
    event.preventDefault();

    if (!editTitle.trim()) return;

    try {
      setError("");

      const updatedTask = await updateTask(editingId, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });

      setTasks((previous) =>
        previous.map((item) =>
          item.id === editingId ? updatedTask : item
        )
      );

      setEditingId(null);
    } catch (err) {
      setError("Could not save your changes.");
      console.error(err);
    }
  }

  // Delete a task.
  async function handleDeleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setError("");

      await deleteTask(id);

      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      );
    } catch (err) {
      setError("Could not delete the task.");
      console.error(err);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✓</span>
          <span>Task Manager</span>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>

          <div className="sidebar-link active">
            <span>▦</span> My Tasks
          </div>

          <div className="sidebar-link">
            <span>◷</span> Overview
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">TM</div>
          <div>
            <strong>My Workspace</strong>
            <small>Personal task manager</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">WORKSPACE / TASKS</p>
            <h1>My Tasks</h1>
            <p className="subtitle">
              Organize your work and keep track of your progress.
            </p>
          </div>

          <div className="header-date">
            <span>PROJECT</span>
            <strong>Personal Workspace</strong>
          </div>
        </header>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon blue">▦</span>
            <div>
              <p>Total tasks</p>
              <strong>{tasks.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon orange">◷</span>
            <div>
              <p>Pending</p>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon green">✓</span>
            <div>
              <p>Completed</p>
              <strong>{completedCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon purple">%</span>
            <div>
              <p>Completion rate</p>
              <strong>
                {tasks.length === 0
                  ? 0
                  : Math.round((completedCount / tasks.length) * 100)}
                %
              </strong>
            </div>
          </div>
        </section>

        <section className="create-card">
          <div className="section-heading">
            <div>
              <h2>Create a task</h2>
              <p>Add something you need to get done.</p>
            </div>
            <span className="heading-symbol">+</span>
          </div>

          <form onSubmit={handleCreateTask} className="task-form">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              required
            />

            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <button type="submit" className="primary-button">
              + Add task
            </button>
          </form>
        </section>

        <section className="tasks-section">
          <div className="tasks-heading">
            <div>
              <h2>Your tasks</h2>
              <p>Manage and track your activities.</p>
            </div>

            <div className="filters">
              <button
                className={filter === "all" ? "filter active-filter" : "filter"}
                onClick={() => setFilter("all")}
              >
                All ({tasks.length})
              </button>

              <button
                className={
                  filter === "pending" ? "filter active-filter" : "filter"
                }
                onClick={() => setFilter("pending")}
              >
                Pending ({pendingCount})
              </button>

              <button
                className={
                  filter === "completed" ? "filter active-filter" : "filter"
                }
                onClick={() => setFilter("completed")}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          <div className="task-list">
            {loading ? (
              <p className="empty-state">Loading your tasks...</p>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <span>✓</span>
                <h3>No tasks found</h3>
                <p>
                  {filter === "all"
                    ? "Create your first task above."
                    : "There are no tasks in this category."}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <article
                  className={`task-item ${
                    task.completed ? "completed-task" : ""
                  }`}
                  key={task.id}
                >
                  {editingId === task.id ? (
                    <form
                      className="edit-form"
                      onSubmit={handleSaveEdit}
                    >
                      <input
                        value={editTitle}
                        onChange={(event) =>
                          setEditTitle(event.target.value)
                        }
                        maxLength={200}
                        required
                      />

                      <input
                        value={editDescription}
                        onChange={(event) =>
                          setEditDescription(event.target.value)
                        }
                        placeholder="Description"
                      />

                      <div className="task-actions">
                        <button type="submit" className="save-button">
                          Save
                        </button>
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <button
                        className={`task-checkbox ${
                          task.completed ? "checked" : ""
                        }`}
                        onClick={() => handleToggleTask(task)}
                        aria-label={
                          task.completed
                            ? "Mark as pending"
                            : "Mark as completed"
                        }
                      >
                        {task.completed ? "✓" : ""}
                      </button>

                      <div className="task-details">
                        <h3>{task.title}</h3>
                        {task.description && (
                          <p>{task.description}</p>
                        )}
                        <small>
                          Created{" "}
                          {new Date(task.created_at).toLocaleDateString()}
                        </small>
                      </div>

                      <div className="task-actions">
                        <button
                          className="edit-button"
                          onClick={() => startEditing(task)}
                          aria-label="Edit task"
                          title="Edit task"
                        >
                          ✎
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDeleteTask(task.id)}
                          aria-label="Delete task"
                          title="Delete task"
                        >
                          ×
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))
            )}
          </div>
        </section>

        <footer className="page-footer">
          Task Manager · Powered by React, FastAPI and PostgreSQL
        </footer>
      </main>
    </div>
  );
}

export default App;
