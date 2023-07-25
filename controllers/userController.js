const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const getUserTask = async (req, res) => {
    try{

        const token = req.headers.authorization.split(' ')[1];
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const userId = decodedToken.userID;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userTasks = user.tasks;

        return res.status(200).json({ userTasks });
    } catch(error){
        console.error('Error getting user tasks:', error);
        res.status(500).json({ error: 'Failed to get user tasks. Please try again later.' });
    }
}

const addTask = async (req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];

        const { tittle, description, completed } = req.body;

        const taskId  = req.params.id;

        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        const userId = decodedToken.userID;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({ error: 'user not found' });
        }
        
        user.tasks.push({tittle, description, completed});

        user.save();

        return res.status(200).json({ message: 'Task added successfully' });

    }catch(error){
        console.error('Error adding a task', error);
        res.status(500).json({ error: 'Failed to add a task. Please try again later.' });
    }
}

const verifyToken = (token) => {
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log('Decoded token:', decodedToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
};

const modifyTask = async (req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];

        const { tittle, description} = req.body;

        const taskId = req.params.id;

        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const userId = decodedToken.userID;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json('User not found');
        }

        const taskIndex = user.tasks.findIndex((task) => task._id.toString() === taskId);

        if(taskIndex === -1) {
            return res.status(404).json('Task not found');
        }

        user.tasks[taskIndex].tittle = tittle;
        user.tasks[taskIndex].description = description;

        await user.save();

        return res.status(200).json({message: 'Task updated succesfully'});
    }catch(error){
        console.error('Error updating task', error);
        res.status(500).json({ error: 'Error updating task, try again later' });
    }
}

const deleteTask =  async (req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];

        const taskId = req.params.id;

        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const userId = decodedToken.userID;

        await User.updateOne({ _id: userId }, { $pull: { tasks: { _id: taskId } } });

        return res.status(200).json({ message: 'Task successfully deleted' });
    } catch(error) {
        console.error('Error deleting task', error);
        res.status(500).json({ error: 'Error deleting task, try again later' });
    }
}


const markTaskAsCompleted = async (req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];

        const taskId = req.params.id;

        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const userId = decodedToken.userID;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json('User not found');
        }

        const task = user.tasks.find((task) => task._id.toString() === taskId);

        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
          
        task.completed = !task.completed;

        await user.save();

        return res.status(200).json({ message: 'task status updated' });
    }catch (error) {
        console.error('Failed to update task status', error);
        return res.status(500).json({ error: 'Failed to update task status. Please try again later.' });
      }
}

module.exports = {
    getUserTask,
    addTask,
    modifyTask,
    deleteTask,
    markTaskAsCompleted,
}