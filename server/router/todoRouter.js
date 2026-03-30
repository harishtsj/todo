import express from 'express'
import { createTask, deleteTask, getTasks, updateTask } from '../controller/todoController.js';
import { protect } from '../middleware/authMiddleware.js';

const todoRouter = express.Router();

todoRouter.get('/tasks', protect, getTasks)
todoRouter.post('/tasks', protect, createTask)
todoRouter.delete('/tasks/:id', protect, deleteTask)
todoRouter.put('/tasks/:id', protect, updateTask)

export default todoRouter