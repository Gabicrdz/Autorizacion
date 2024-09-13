import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {
  const userId = req.user.id;

  const todos = database.todos.filter((todo) => todo.owner === userId);

  res.json({ todos });
};

export const createTodoCtrl = (req, res) => {
  const userId = req.user.id;
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({ message: "El título es requerido" });
  } else if (typeof title !== "string") {
    return res.status(400).json({ message: "El título debe ser un string" });
  } else if (title.length < 3) {
    return res
      .status(400)
      .json({ message: "El título debe tener al menos 3 caracteres" });
  }

  if (completed === undefined) {
    return res
      .status(400)
      .json({ message: "El estado de la tarea es requerido" });
  } else if (typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ message: "El estado de la tarea debe ser un booleano" });
  }

  const newTodo = {
    id: database.todos.length + 1,
    title,
    completed,
    owner: userId,
  };

  database.todos.push(newTodo);

  res.json({ message: "Tarea creada exitosamente" });
};

export const updateTodoCtrl = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({ message: "El título es requerido" });
  } else if (typeof title !== "string") {
    return res.status(400).json({ message: "El título debe ser un string" });
  } else if (title.length < 3) {
    return res
      .status(400)
      .json({ message: "El título debe tener al menos 3 caracteres" });
  }

  if (completed === undefined) {
    return res
      .status(400)
      .json({ message: "El estado de la tarea es requerido" });
  } else if (typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ message: "El estado de la tarea debe ser un booleano" });
  }

  const todoIndex = database.todos.findIndex((todo) => todo.id === Number(id));

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  if (database.todos[todoIndex].owner !== userId) {
    return res
      .status(403)
      .json({ message: "No tienes permisos para modificar esta tarea" });
  }

  database.todos[todoIndex] = {
    ...database.todos[todoIndex],
    title,
    completed,
  };

  res.json({ message: "Tarea actualizada exitosamente" });
};

export const deleteTodoCtrl = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const todoIndex = database.todos.findIndex((todo) => todo.id === Number(id));

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  if (database.todos[todoIndex].owner !== userId) {
    return res
      .status(403)
      .json({ message: "No tienes permisos para eliminar esta tarea" });
  }

  database.todos.splice(todoIndex, 1);

  res.json({ message: "Tarea eliminada exitosamente" });
};
