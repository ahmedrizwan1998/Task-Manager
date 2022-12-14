const Task = require('../models/taskModel');

module.exports.createTask = async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send({ error: error,message });
    }
};

module.exports.viewTask = async (req, res) => {
    const match = {};

        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }   
    try {
        // const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'task',
            match,
            Option: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        });
        res.send(req.user.task);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports.taskByID = async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        
        if (!task) {
            res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports.updateTask = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if (!task) {
            res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}