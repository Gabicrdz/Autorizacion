import { Router } from "express";
import { getAllTodosCtrl } from "../controllers/todos.controllers.js";
import { createTodoCtrl } from "../controllers/todos.controllers.js";
import { updateTodoCtrl } from "../controllers/todos.controllers.js";
import { deleteTodoCtrl } from "../controllers/todos.controllers.js";
import validateJwt from "../middlewares/validar-jwt.js";


const todosRouter = Router();

todosRouter.get("/", validateJwt, getAllTodosCtrl);
todosRouter.post("/", validateJwt, createTodoCtrl);
todosRouter.put("/:id", validateJwt, updateTodoCtrl);
todosRouter.delete("/:id", validateJwt, deleteTodoCtrl);



export { todosRouter };