import { Router } from "express";
import { getAllTodosCtrl, createTodosCtrl, updateTodosCtrl, deleteTodosCtrl } from "../controllers/todos.controllers.js";
import validarJwt from "../middlewares/validar-jwt.js";

const todosRouter = Router();

todosRouter.get("/",validarJwt, getAllTodosCtrl);
todosRouter.post("/",validarJwt, createTodosCtrl);
todosRouter.put("/:id",validarJwt, updateTodosCtrl);
todosRouter.delete("/:id",validarJwt, deleteTodosCtrl);


export { todosRouter };
