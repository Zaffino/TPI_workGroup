const expess = require('express')
const bcrypt = require('bcrypt')
const app = expess()

app.use(expess.json())

const users = [] //in questo caso è in chiaro 


app.get('/users', (req, res) => { 
    res.json(users)
})


app.post('/users', async(req, res) => { 
    try{
        const salt = await bcrypt.genSalt()//genera un salt per migliorare la sicurezza delle password
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt)
        console.log(hashedPassword)
        
        const user = {
            name: req.body.name,
            password: hashedPassword,
            passwordNoHash: req.body.password
        }
        users.push(user)
        res.status(201).send()
    }
    catch{
        res.status(500).send()
    }
})


app.post('/users/login', async(req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if(user == null){
        return res.status(400).send("l'utente non esiste")
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
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

app.listen(3000)