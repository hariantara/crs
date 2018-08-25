// require express lib
const express = require('express')

// require bodyParser , bodyParser is used to recieves the request from front-end side
const bodyParser = require('body-parser')

// call the express func from express lib
const app = express()

// call the mysql config connection
const db = require('./connection')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// example how to fetch data from mysql to the server and ready to send it to front end side

// mysql -> server -> front end
app.get('/', async(req, res)=>{
    try{
        let queryGetUserDatas = await db.connection.execute(`select * from users`)
        console.log('queryGetUserDatas: ', queryGetUserDatas[0])
        let listAllUsers = queryGetUserDatas[0]
        let status = []
        await listAllUsers.map(data => {
            status.push({
                id: data.id,
                username: data.username,
                password: data.password,
                email: data.email
            })
        })
        res.send({
            status: status, 
            error: null
        })
    }catch(err){
        console.log(err)
        res.send({
            status: null, 
            error: err.message
        })
    }
})

app.post('/post', async(req, res)=>{
    try{
        console.log('req: ', req.body)
        let username = req.body.username 
        let password = req.body.password 
        let email = req.body.email
        console.log('username: ', req.body.username)
        console.log('password: ', req.body.password)
        console.log('email: ', req.body.email)

        let queryInsertUser = `
            insert into users 
            (username, password, email, created_at)
            values
            ('${username}', '${password}', '${email}', now())
        `
        let runQueryInsertUser = await db.connection.execute(queryInsertUser)
        console.log('runQueryInsertUser: ', runQueryInsertUser)
        if(runQueryInsertUser[0].affectedRows === 1){
            let id = runQueryInsertUser[0].insertId
            let result = {}
            let getLastInserted = await db.connection.execute(`select * from users where id = ${id}`)
            console.log('getLastInserted: ', getLastInserted[0])
            let insertedData = getLastInserted[0]
            await insertedData.map(data => {
                result = {
                    id: data.id,
                    username: data.username,
                    password: data.password,
                    email: data.email
                }
            })
            res.send({
                status: result,
                error: null
            })
        }else{
            res.send({
                status: 'bad request 404',
                error: null
            })
        }
    }catch(err){
        return{
            status: null,
            error: err.message
        }
    }
})

// determine the server run on port 3000 or 80(in https use 443)
app.listen(3000,() => console.log('server running on port 3000'))

