const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const async = require("hbs/lib/async")
const collection = require("./mongodb")


const templetePath = path.join(__dirname,'../templates')

app.use(express.json())
app.set("view engine","hbs")
app.set("views",templetePath)
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname + '/templates'))

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'templates', 'index.html');
    res.sendFile(filePath);
});

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'templates', 'login.html');
    res.sendFile(filePath);
});
app.get('/signup', (req, res) => {
    const filePath = path.join(__dirname, 'templates', 'signup.html');
    res.sendFile(filePath);
});

app.post("/signup", async (req, res) => {
    const data = {
      name: req.body.name,
      password: req.body.password,
    };
  
    const existingUser = await collection.findOne({ name: req.body.name });
  
    if (existingUser) {
      const filePath = path.join(__dirname, 'templates', 'nameExists.html');
      res.sendFile(filePath);
    } else {
      await collection.insertMany([data]);
      const filePath = path.join(__dirname, 'templates', 'home.html');
      res.sendFile(filePath);
    }
  });
  

app.post("/login",async(req,res)=>{
 try{
    const check = await collection.findOne({name:req.body.name})

    if(check.password===req.body.password){
        const filePath = path.join(__dirname, 'templates', 'home.html');
        res.sendFile(filePath);
    }else{
        const filePath = path.join(__dirname, 'templates', 'loginwrong.html');
        res.sendFile(filePath);
    }
 }
 catch{
    const filePath = path.join(__dirname, 'templates', 'loginwrong.html');
    res.sendFile(filePath);
    
 }

})

app.listen(3000,()=>{
    console.log("port connected");
})