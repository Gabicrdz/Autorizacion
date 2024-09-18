import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {
  const userId = req.user.id;

  const todos = database.todos.filter((todo) => todo.owner === userId);

  res.json({ todos });
};

export const createTodoCtrl = (req, res) => {
  const userId = req.user.id;
  const { title, completed } = req.body;

  console.log("Request received to create todo:", { userId, title, completed });

  if (!title) {
    console.log("Title is missing");
    return res.status(400).json({ message: "El título no puede estar vacío" });
  } else if (typeof title !== "string") {
    console.log("Title is not a string");
    return res.status(400).json({ message: "El título debe ser un texto" });
  } else if (title.length < 3) {
    console.log("Title is too short");
    return res
      .status(400)
      .json({ message: "El título debe tener al menos 3 caracteres" });
  }

  if (completed === undefined) {
    console.log("Completed status is missing");
    return res
      .status(400)
      .json({ message: "El estado de la tarea es requerido" });
  } else if (typeof completed !== "boolean") {
    console.log("Completed status is not a boolean");
    return res
      .status(400)
      .json({ message: "El estado de la tarea debe ser verdadero o falso" });
  }

  // Encontrar el ID máximo existente en la base de datos
  const maxId = database.todos.reduce(
    (max, todo) => (todo.id > max ? todo.id : max),
    0
  );

  const newTodo = {
    id: maxId + 1, // Asignar un nuevo ID único
    title,
    completed,
    owner: userId, // Asignar el owner al userId del usuario que crea la tarea
  };

  database.todos.push(newTodo);

  console.log("Todo created successfully:", newTodo);

  res.status(201).json({ message: "Tarea creada exitosamente", todo: newTodo });
};

export const updateTodoCtrl = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, completed } = req.body;

  console.log("Request received to update todo:", {
    userId,
    id,
    title,
    completed,
  });

  if (!title) {
    return res.status(400).json({ message: "El título no puede estar vacío" });
  } else if (typeof title !== "string") {
    return res.status(400).json({ message: "El título debe ser un texto" });
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
      .json({ message: "El estado de la tarea debe ser verdadero o falso" });
  }

  const todoIndex = database.todos.findIndex((todo) => todo.id === Number(id));

  if (todoIndex === -1) {
    console.log("Todo not found:", id);
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  console.log("Todo found:", database.todos[todoIndex]);

  if (database.todos[todoIndex].owner !== userId) {
    console.log("User does not have permission to update this todo:", {
      userId,
      owner: database.todos[todoIndex].owner,
    });
    return res
      .status(403)
      .json({ message: "No tienes permisos para modificar esta tarea" });
  }

  database.todos[todoIndex] = {
    ...database.todos[todoIndex],
    title,
    completed,
  };

  console.log("Todo updated successfully:", database.todos[todoIndex]);

  res.json({ message: "Tarea actualizada exitosamente" });
};

export const deleteTodoCtrl = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  console.log("Request received to delete todo:", { userId, id });

  const todoIndex = database.todos.findIndex((todo) => todo.id === Number(id));

  if (todoIndex === -1) {
    console.log("Todo not found:", id);
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  console.log("Todo found:", database.todos[todoIndex]);

  if (database.todos[todoIndex].owner !== userId) {
    console.log("User does not have permission to delete this todo:", {
      userId,
      owner: database.todos[todoIndex].owner,
    });
    return res
      .status(403)
      .json({ message: "No tienes permisos para eliminar esta tarea" });
  }

  database.todos.splice(todoIndex, 1);

  console.log("Todo deleted successfully:", id);

  res.json({ message: "Tarea eliminada exitosamente" });
};