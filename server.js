const express = require('express')
const bcrypt = require('bcrypt')
const app = express()

const FileSync = require('lowdb/adapters/FileSync')

const low = require('lowdb');
const adapter = new FileSync('db.json');
const db = low(adapter);

app.use(express.json())

//const users = []

/*
get all users
*/
app.get('/users', (req, res) => { 
    //res.json(users)
    users = db.get("users").value()
    console.log(users)
    res.status(200).send()
})

/*
get 1 user
*/
app.get('/users/:name', (req, res) => { 
    name = req.params.name;
    
    user = db.get("users").find({"name":name}).value();
    console.log(user)
    res.status(200).send()
})

/*
get 1 user's todos
*/
app.get('/users/:name/todos', (req, res) => { 
    name = req.params.name;
    
    user = db.get("users").find({"name":name}).get("todos").value();
    console.log(user)
    res.status(200).send()
})

/*
create new user
*/
app.post('/users', async (req, res) => {
    try{
        //const salt =  bcrypt.genSalt() // =10
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
        
        lastUserID = db.get("users").last().get("id").value();
        console.log(lastUserID)
        if(lastUserID == null)
            lastUserID = -1
        const newuser = {
            id: lastUserID + 1,
            name: req.body.name,
            password: hashedPassword,
            passwordNoHash: req.body.password,
            todos: []
        }

        db.get("users")
        .push(newuser)
        .last()
        .write()

        res.status(201).send()
    }
    catch{
        res.status(500).send()
    }
})

/*
search a user and check if the user and password are correct
*/
app.post('/users/login', async (req, res) => {
    const user = db.get("users").find({"name":req.body.name}).value();
    const hashedPassword = db.get("users").find({"name":req.body.name}).get("password").value();
    //const user = users.find(user => user.name === req.body.name)
    console.log(req.body.password, hashedPassword)
    if(user == null){   //funziona
        return res.status(400).send("l'utente non esiste") 
    }
    try{ 
        if( await bcrypt.compare(req.body.password, hashedPassword)){
            res.send("successo")
        }
        else{
            res.send("password errata")
        }
    }
    catch{
        res.status(500).send()
    }
})

/*
create new todo
*/
app.post('/users/:name/todos', (req, res) => {
    lastTodoID = db.get("users").find({"name":req.params.name}).get("todos").last().get("id").value();
    if(lastTodoID == null)
        lastTodoID = -1
    try {
        db.get("users").find({"name":req.params.name}).get("todos")
        .push({
            id : lastTodoID + 1,
            content : req.body.content
        })
        .last()
        .write()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
    
})

  

app.listen(3000)