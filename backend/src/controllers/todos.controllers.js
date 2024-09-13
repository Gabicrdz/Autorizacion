import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {
  const userId = req.user.id;
  const todos = database.todos.filter((todo) => todo.owner === userId);

  res.json({ todos });
};
export const createTodosCtrl = (req, res) => {
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({ message: "El título es obligatorio" });
  } else if (typeof title !== "string") {
    return res.status(400).json({ message: "El título debe ser un texto" });
  } else if (title === "") {
    return res.status(400).json({ message: "El título no puede estar vacío" });
  }

  if (completed && typeof completed !== "boolean") {
    return res.status(400).json({ message: "El estado debe ser un booleano" });
  } else if (completed === "") { 
    return res.status(400).json({ message: "El estado no puede estar vacío" });
  }
  
  const userId = req.user.id;
  const newTodo = {
    id: database.todos.length + 1,
    title,
    completed: false,
    owner: userId,
  };

  database.todos.push(newTodo);

  res.json({ message: "Tarea creada exitosamente" });
}