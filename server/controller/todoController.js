import Todo from "../models/Todo.model.js";

export const getTasks = async (req, res) => {
    try {
        const id = req.user._id;
        const tasks = await Todo.find({ userId: id })
        return res.json({ success: true, tasks })

    } catch (err) {
        console.error(err)
        return res.status(400).json({ success: false, message: 'Unable to fetch the tasks' })
    }
}

export const createTask = async (req, res) => {

    try {
        const { title } = req.body

        if (!title || title.trim() === '') {
            return res.status(400).json({ message: "Title is required" });
        }

        const user = req.user

        const newTask = await Todo.create({ title, userId: user._id });

        return res.status(201).json({ success: true, message: 'Task created successfully', newTask })
    } catch (err) {
        console.error(err);
        return res.status(400).json({ success: false, message: 'Unable to create the task' })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const userId = req.user._id
        const id = req.params.id;

        const result = await Todo.deleteOne({ _id: id, userId })

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' })
        }

        return res.json({ success: true, message: 'Task deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ success: false, message: 'Unable to delete the task' })
    }
}

export const updateTask = async (req, res) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;
        const { title, status } = req.body

        const updateFields = {}

        if (title !== undefined) {
            if (title.trim() === '') {
                return res.status(400).json({ message: 'Title cannot be empty' });
            }
            updateFields.title = title
        }
        
        if (status !== undefined) {
            updateFields.status = status
        }

        const validStatus = ['pending', 'completed', 'rejected']

        if (status && !validStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedTask = await Todo.findOneAndUpdate(
            { _id: id, userId },
            { $set: updateFields },
            { returnDocument: 'after' }
            // {new: true} means, return the updated document, else old document will be returned
            // {returnDocument: 'after'} also same
            // the difference
            // new: true is used inmongoose method, returnDocument: after used in mongodb driver
        )

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: `Task not found` })
        }

        return res.json({ success: true, message: 'Updated successfully', updatedTask });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ success: false, message: 'Unable to update the task' })
    }
}