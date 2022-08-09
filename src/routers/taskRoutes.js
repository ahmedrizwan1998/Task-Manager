const router = require('express').Router();
const auth = require('../middleware/auth');
const {createTask, viewTask, deleteTask, updateTask, taskByID} = require("../controllers/taskController");


router.route("/tasks").post(auth, createTask);
router.route("/tasks").get(auth, viewTask);
router.route("/tasks/:id").delete(auth, deleteTask);
router.route("/tasks/:id").patch(auth, updateTask);
router.route("/tasks/:id").get(auth, taskByID);


module.exports = router;