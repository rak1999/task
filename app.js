const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json())
app.use(express.static("public"));

const createToken = async() =>{
    const token = jwt.sign({_id:"61027363ce8c603290b85656"}, "thisismysecretkey");
    const userVer = jwt.verify(token, "thisismysecretkey");
}
createToken();

mongoose.connect('mongodb://localhost:27017/itemdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const empSchema = new mongoose.Schema({
    name : String,
    age : Number,
    email : {type: String, required: true},
    address : String
});

const Emp = mongoose.model("person",empSchema);

const listSchema = new mongoose.Schema({
    items : [empSchema]
});

const List = mongoose.model("list", listSchema);

app.get("/", function(req,res){
   
    Emp.find({},function(err, itemfound){
        if(!err){
            res.render("listdata", {listTitle :"Employee", listItems: itemfound });
        }
    });
});

app.post("/", function(req, res){
    const Name = req.body.name;
    const Age = req.body.age;
    const Email = req.body.email;
    const Address = req.body.address;
    const listName = req.body.List;
    const item = new Emp({
        name : Name,
        age : Age,
        email : Email,
        address : Address
    });
    if(listName === "Employee"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName}, function(err, foundList){
            foundList.people.push(item);
            foundList.save();
            res.redirect("/");
        })
    }

});

app.listen(3000, function(){
    console.log("server is running on port 3000");
});