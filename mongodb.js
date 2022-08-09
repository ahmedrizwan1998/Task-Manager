const {MongoClient , ObjetID} = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connecto to database')
    }

    // const id = new ObjectID
    // console.log(id.getTimestamp())
    const db = client.db(databaseName)
    // db.collection('tasks').insertMany([                  //create
    //     {
    //         description: 'task3',
    //         completed: false
    //     }, {
    //         description: 'task4',
    //         completed: false
    //     }
    // ]).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    // db.collection('tasks').find({description: 'task1'}).toArray().then((result) => {     //read
    //     if (result.length === 0) {
    //       return console.log('No task Found')
    //     }
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    db.collection('tasks').deleteMany({      //delete
        description: 'task 1'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
    // db.collection('tasks').updateMany({          //update
    //     description: 'task2'
    // }, {$set:{completed: true}}).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
})   