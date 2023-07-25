const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

//user routes 
userRouter.get('/tasks', userController.getUserTask);

userRouter.post('/addTask', userController.addTask);

userRouter.patch('/updateTask/:id', userController.modifyTask);

userRouter.delete('/deleteTask/:id', userController.deleteTask);

userRouter.patch('/toggleStatus/:id', userController.markTaskAsCompleted);

module.exports = userRouter;