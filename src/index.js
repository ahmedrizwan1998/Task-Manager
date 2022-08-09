require('./db/mongoose');
const express = require('express')
const userRouter = require('./routers/userRoutes')
const taskRouter = require('./routers/taskRoutes')


const app = express()

const port = process.env.PORT;

app.use(express.json()) 
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('server up ' + port)
})

// const jwt = require ('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id:'1234' }, 'thisismycourse', {expiresIn: '5 seconds'})
//     console.log(token)

//     const data = jwt.verify(token, 'thisismycourse')
//     console.log(data)
// }
// myFunction()