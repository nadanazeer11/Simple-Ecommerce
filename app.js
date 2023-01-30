
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
//const store=new sessions.MemoryStore();
var app = express();

//var fs = require('fs');
var mongoose = require('mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false,
   // store : store
}));
app.use(cookieParser());


var {
  MongoClient
} = require('mongodb');
const { json } = require('body-parser');
var uri = "mongodb+srv://networks:projectnetworks@cluster0.7luwi.mongodb.net/test";
var client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

main().catch(err => console.log(err));
async function main() {

    await client.connect();
    await mongoose.connect('mongodb+srv://networks:projectnetworks@cluster0.7luwi.mongodb.net/test');


     client.close();
};

const Schema =mongoose.Schema;
const user = new Schema ({
  username :{
    type : String,
    required : true ,
    unique : true 
  },
  password :{
    type : String ,
    required : true 
  }
})
const item = new Schema ({
  name: {
    type: String,
    required: true
  }
})
const cart = new Schema({
  username :{
    type : String,
    // required : true ,
    unique : true 
  },
  list: {
    type: [{
        name : String,
        quantity : Number
    }],
    default: undefined
}
})
const UserTable =  mongoose.model('Users',user);
const itemTable =  mongoose.model('Items',item);
const CartTable =  mongoose.model('Carts',cart);
// const m = new itemTable({
//   name : 'Galaxy S21 Ultra',
// });
//   m.save();
//   const m1 = new itemTable({
//     name : 'iPhone 13 Pro',
//   });
//     m1.save();
//     const m2 = new itemTable({
//       name : 'Leaves of Grass',
//     });
//       m2.save();
//       const m3 = new itemTable({
//         name : 'The Sun and Her Flowers',
//       });
//         m3.save();
//         const m4 = new itemTable({
//           name : 'Boxing Bag',
//         });
//           m4.save();
        
//           const m5 = new itemTable({
//             name : 'Tennis Racket',
//           });
//             m5.save();
//var nameOfUser="";
//var session;
app.get('/',function(req,res){
  //session=req.session;
  res.render('login')
});
app.post('/', function(req, res) {
  UserTable.findOne({ username: req.body.username, password: req.body.password },function(err,existingUser){
    if (existingUser){
      //session=req.session;
      req.session.userid = req.body.username
     // req.session.authenticated=true;
     // session.userid=req.body.username;
      //session.save();
      req.session.save();
      // console.log(session);
      // console.log(session.userid);
     // nameOfUser=req.body.username;
      res.render('home');
    }
    else {
      const alert = '';
      res.render('login',{alert});
    }
  })
});

app.get('/registration',function(req,res){
  res.render('registration')
});
app.post('/register',function(req,res){
  UserTable.findOne({ username: req.body.username},function(err,existingUser){
    if (existingUser){
      const alert = '';
      res.render('registration',{alert});
   }else {
      // session=req.session;
      // session.userid=req.body.username;
      req.session.userid = req.body.username;
      req.session.save();
      const m = new UserTable({
      username :  req.session.userid,
      password :  req.body.password
    });
      m.save();
      //nameOfUser=req.body.username;
      const m1 = new CartTable({
      username :  req.session.userid,
      list : []
      });
      m1.save();
      res.render('home');
   }
  })
});
app.get('/home',function(req,res){
  res.render('home')
});
app.post('/home',function(req,res){
  res.render('home')
});

//START VIEW BUTTONS IN HOME PAGE 
//type phones
app.get('/phones', function(req, res) {
  res.render('phones')
})
app.post('/phones', function(req, res) {
      res.render('phones')
  })
  //type books
app.get('/books', function(req, res) {
  res.render('books')
})
app.post('/books', function(req, res) {
      res.render('books')
  })
  //type sports
app.get('/sports', function(req, res) {
  res.render('sports')
})
app.post('/sports', function(req, res) {
      res.render('sports')
  })
  // END VIEW BUTTONS IN HOME PAGE 

//TYPE PHONES to item page
app.get('/galaxy', function(req, res) {
  res.render('galaxy')
})
app.post('/galaxy', function(req, res) {
  var flag=false;
  var quantityx=0;
 // session=req.session;
  CartTable.findOne({username : req.session.userid} , function(err,CartTable){
   if (CartTable){
     var listx=CartTable.list ;
     const count=CartTable.list.length;
     for (let i=0;i<count;i++){
       if((listx[i]).name =="Galaxy S21 Ultra"){
        quantityx=CartTable.list[i].quantity;
        flag=true;
        }
     }
     if (quantityx>0){
       var quantityw= quantityx+1;
       updateq(quantityw);
     }
     else {
      addq();
     }
   }
  })
  function updateq(quantityw){
    CartTable.findOneAndUpdate(
      {"$and":[{"list.name":"Galaxy S21 Ultra"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
   ).exec();
  }
  function addq(){
    CartTable.findOneAndUpdate({username : req.session.userid},{$push : { list: { 'name' :'Galaxy S21 Ultra', 'quantity': 1}}}).exec();
  }
})
app.get('/iphone', function(req, res) {
  res.render('iphone')
})

//TYPE BOOKS to item page
app.get('/leaves', function(req, res) {
      res.render('leaves')
  })
app.post('/leaves', function(req, res) {
  var quantityx=0;
  //session=req.session;
  CartTable.findOne({username : req.session.userid} , function(err,CartTable){
   if (CartTable){
     var listx=CartTable.list ;
     const count=CartTable.list.length;
     for (let i=0;i<count;i++){
       if((listx[i]).name =="Leaves of Grass"){
        quantityx=CartTable.list[i].quantity;
        }
     }
     if (quantityx>0){
       var quantityw= quantityx+1;
       updateq(quantityw);
     }
     else {
      addq();
     }
   }
  })
  function updateq(quantityw){
    CartTable.findOneAndUpdate(
      {"$and":[{"list.name":"Leaves of Grass"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
   ).exec();
  }
  function addq(){
    CartTable.findOneAndUpdate({username : req.session.userid},{$push : { list: { 'name' :'Leaves of Grass', 'quantity': 1}}}).exec();
  }
  })
app.get('/sun', function(req, res) {
      res.render('sun')
  })
app.post('/sun', function(req, res) {
  var quantityx=0;
 // session=req.session;
  CartTable.findOne({username : req.session.userid} , function(err,CartTable){
   if (CartTable){
     var listx=CartTable.list ;
     const count=CartTable.list.length;
     for (let i=0;i<count;i++){
       if((listx[i]).name =="The Sun and Her Flowers"){
        quantityx=CartTable.list[i].quantity;
        }
     }
     if (quantityx>0){
       var quantityw= quantityx+1;
       updateq(quantityw);
     }
     else {
      addq();
     }
   }
  })
  function updateq(quantityw){
    CartTable.findOneAndUpdate(
      {"$and":[{"list.name":"The Sun and Her Flowers"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
   ).exec();
  }
  function addq(){
    CartTable.findOneAndUpdate({username : req.session.userid},{$push : { list: { 'name' :'The Sun and Her Flowers', 'quantity': 1}}}).exec();
  }
  })
//TYPE SPORTS to item page
app.get('/boxing', function(req, res) {
      res.render('boxing')  ;
      
  })
  app.post('/boxing', function(req, res) {
    var quantityx=0;
   // session=req.session;
    CartTable.findOne({username : req.session.userid} , function(err,CartTable){
     if (CartTable){
       var listx=CartTable.list ;
       const count=CartTable.list.length;
       for (let i=0;i<count;i++){
         if((listx[i]).name =="Boxing Bag"){
          quantityx=CartTable.list[i].quantity;
          }
       }
       if (quantityx>0){
         var quantityw= quantityx+1;
         updateq(quantityw);
       }
       else {
        addq();
       }
     }
    })
    function updateq(quantityw){
      CartTable.findOneAndUpdate(
        {"$and":[{"list.name":"Boxing Bag"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
     ).exec();
    }
    function addq(){
      CartTable.findOneAndUpdate({username : req.session.userid},{$push : { list: { 'name' :'Boxing Bag', 'quantity': 1}}}).exec();
    }

  })
  app.post('/iphone', function(req, res) {
    var quantityx=0;
    //session=req.session;
    CartTable.findOne({username : req.session.userid} , function(err,CartTable){
     if (CartTable){
       var listx=CartTable.list ;
       const count=CartTable.list.length;
       for (let i=0;i<count;i++){
         if((listx[i]).name =="Iphone 13 Pro"){
          quantityx=CartTable.list[i].quantity;
          }
       }
       if (quantityx>0){
         var quantityw= quantityx+1;
         updateq(quantityw);
       }
       else {
        addq();
       }
     }
    })
    function updateq(quantityw){
      CartTable.findOneAndUpdate(
        {"$and":[{"list.name":"Iphone 13 Pro"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
     ).exec();
    }
    function addq(){
      CartTable.findOneAndUpdate({username : req.session.userid},{$push : { list: { 'name' :'Iphone 13 Pro', 'quantity': 1}}}).exec();
    }

})
app.get('/tennis', function(req, res) {
      res.render('tennis')

  })
  app.post('/tennis', function(req, res) {
    var quantityx=0;
    //session=req.session;
    CartTable.findOne({username : req.session.userid} , function(err,CartTable){
     if (CartTable){
       var listx=CartTable.list ;
       const count=CartTable.list.length;
       for (let i=0;i<count;i++){
         if((listx[i]).name =="Tennis Racket"){
          quantityx=CartTable.list[i].quantity;
          }
       }
       if (quantityx>0){
         var quantityw= quantityx+1;
         updateq(quantityw);
       }
       else {
        addq();
       }
     }
    })
    function updateq(quantityw){
      CartTable.findOneAndUpdate(
        {"$and":[{"list.name":"Tennis Racket"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
     ).exec();
    }
    function addq(){
      CartTable.findOneAndUpdate({username : req.session.userid},{$push : { list: { 'name' :'Tennis Racket', 'quantity': 1}}}).exec();
    }

  })
app.get('/cart', function(req, res) {
  var quan1=0;
  var quan2=0;
  var quan3=0;
  var quan4=0;
  var quan5=0;
  var quan6=0;
  //session=req.session;
    CartTable.findOne({username : req.session.userid},function(err,CartTable){
        if(CartTable){
          var listx=CartTable.list ;
          const count=CartTable.list.length;
          var i=0;
          for (i=0;i<count;i++){
            if((listx[i].name=='Galaxy S21 Ultra') && (listx[i].quantity>0)){
               quan1= listx[i].quantity
            }
            if((listx[i].name=='Iphone 13 Pro') && (listx[i].quantity>0)){
              quan2= listx[i].quantity
            }
            if((listx[i].name=='Leaves of Grass') && (listx[i].quantity>0)){
              quan3= listx[i].quantity
            }
            if((listx[i].name=='The Sun and Her Flowers') && (listx[i].quantity>0)){
              quan4= listx[i].quantity
            }
            if((listx[i].name=='Tennis Racket') && (listx[i].quantity>0)){
              quan5= listx[i].quantity
            }
            if((listx[i].name=='Boxing Bag') && (listx[i].quantity>0)){
              quan6= listx[i].quantity
            }
          }
          if (i==count){
          res.render('cart',{msg1 : quan1,msg2 : quan2,msg3 :quan3,msg4:quan4,msg5:quan5,msg6:quan6});
          }
        }else {
          res.render('cart',{msg1 : quan1,msg2 : quan2,msg3 :quan3,msg4:quan4,msg5:quan5,msg6:quan6});
        }
    });
      }
    );

app.post('/action_galaxy',function(req,res){
  var quantityx=0;
  //session=req.session;
    CartTable.findOne({username : req.session.userid} , function(err,CartTable){
     if (CartTable){
       var listx=CartTable.list ;
       const count=CartTable.list.length;
       for (let i=0;i<count;i++){
         if((listx[i]).name =="Galaxy S21 Ultra"){
          quantityx=CartTable.list[i].quantity;
          }
       }
       var quantityw= quantityx-1;
       if (quantityw>0){
         updateq(quantityw);
       }
       else {
        deletex();
       }
     }
    })
    function updateq(quantityw){
      CartTable.findOneAndUpdate(
        {"$and":[{"list.name":"Galaxy S21 Ultra"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
     ).exec();
    }
    function deletex(){
      CartTable.findOneAndUpdate(
        {"username":req.session.userid},{$pull: { 'list': { 'name':"Galaxy S21 Ultra"}}}
     ).exec();
    } 

});

app.post('/action_iphone',function(req,res){
  var quantityx=0;
  //session=req.session;
    CartTable.findOne({username : req.session.userid} , function(err,CartTable){
     if (CartTable){
       var listx=CartTable.list ;
       const count=CartTable.list.length;
       for (let i=0;i<count;i++){
         if((listx[i]).name =="Iphone 13 Pro"){
          quantityx=CartTable.list[i].quantity;
          }
       }
       var quantityw= quantityx-1;
       if (quantityw>0){
         updateq(quantityw);
       }
       else {
        deletex();
       }
     }
    })
    function updateq(quantityw){
      CartTable.findOneAndUpdate(
        {"$and":[{"list.name":"Iphone 13 Pro"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
     ).exec();
    }
    function deletex(){
      CartTable.findOneAndUpdate(
        {"username":req.session.userid},{$pull: { 'list': { 'name':"Iphone 13 Pro"}}}
     ).exec();
    } 
});
app.post('/action_leaves',function(req,res){
  var quantityx=0;
 // session=req.session;
    CartTable.findOne({username : req.session.userid} , function(err,CartTable){
     if (CartTable){
       var listx=CartTable.list ;
       const count=CartTable.list.length;
       for (let i=0;i<count;i++){
         if((listx[i]).name =="Leaves of Grass"){
          quantityx=CartTable.list[i].quantity;
          }
       }
       var quantityw= quantityx-1;
       if (quantityw>0){
         updateq(quantityw);
       }
       else {
        deletex();
       }
     }
    })
    function updateq(quantityw){
      CartTable.findOneAndUpdate(
        {"$and":[{"list.name":"Leaves of Grass"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
     ).exec();
    }
    function deletex(){
      CartTable.findOneAndUpdate(
        {"username":req.session.userid},{$pull: { 'list': { 'name':"Leaves of Grass"}}}
     ).exec();
    } 
});
app.post('/action_sun',function(req,res){
  var quantityx=0;
  //session=req.session;
    CartTable.findOne({username : req.session.userid} , function(err,CartTable){
     if (CartTable){
       var listx=CartTable.list ;
       const count=CartTable.list.length;
       for (let i=0;i<count;i++){
         if((listx[i]).name =="The Sun and Her Flowers"){
          quantityx=CartTable.list[i].quantity;
          }
       }
       var quantityw= quantityx-1;
       if (quantityw>0){
         updateq(quantityw);
       }
       else {
        deletex();
       }
     }
    })
    function updateq(quantityw){
      CartTable.findOneAndUpdate(
        {"$and":[{"list.name":"The Sun and Her Flowers"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
     ).exec();
    }
    function deletex(){
      CartTable.findOneAndUpdate(
        {"username":req.session.userid},{$pull: { 'list': { 'name':"The Sun and Her Flowers"}}}
     ).exec();
    }
});
app.post('/action_tennis',function(req,res){
  var quantityx=0;
  //session=req.session;
  CartTable.findOne({username : req.session.userid} , function(err,CartTable){
   if (CartTable){
     var listx=CartTable.list ;
     const count=CartTable.list.length;
     for (let i=0;i<count;i++){
       if((listx[i]).name =="Tennis Racket"){
        quantityx=CartTable.list[i].quantity;
        }
     }
     var quantityw= quantityx-1;
     if (quantityw>0){
       updateq(quantityw);
     }
     else {
      deletex();
     }
   }
  })
  function updateq(quantityw){
    CartTable.findOneAndUpdate(
      {"$and":[{"list.name":"Tennis Racket"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
   ).exec();
  }
  function deletex(){
    CartTable.findOneAndUpdate(
      {"username":req.session.userid},{$pull: { 'list': { 'name':"Tennis Racket"}}}
   ).exec();
  }
});
app.post('/action_box',function(req,res){
  var quantityx=0;
 // session=req.session;
  CartTable.findOne({username : req.session.userid} , function(err,CartTable){
   if (CartTable){
     var listx=CartTable.list ;
     const count=CartTable.list.length;
     for (let i=0;i<count;i++){
       if((listx[i]).name =="Boxing Bag"){
        quantityx=CartTable.list[i].quantity;
        }
     }
     var quantityw= quantityx-1;
     if (quantityw>0){
       updateq(quantityw);
     }
     else {
      deletex();
     }
   }
  })
  function updateq(quantityw){
    CartTable.findOneAndUpdate(
      {"$and":[{"list.name":"Boxing Bag"},{"username":req.session.userid}]},{$set: { 'list.$.quantity' : quantityw} }
   ).exec();
  }
  function deletex(){
    CartTable.findOneAndUpdate(
      {"username":req.session.userid},{$pull: { 'list': { 'name':"Boxing Bag"}}}
   ).exec();
  }
});
app.post('/search',function(req,res){
  var input=req.body.Search;
  var ms1=0;
  var ms2=0;
  var ms3=0;
  var ms4=0;
  var ms5=0;
  var ms6=0;
  var alert;
  var items = [
    "Galaxy S21 Ultra",
    "Leaves of Grass",
    "Iphone 13 Pro",
    "Tennis Racket",
    "The Sun and Her Flowers",
    "Boxing Bag",
  ];
  var result=[];
  let i=0;
  for (i =0; i < items.length; i++) {
    var small=items[i].toLowerCase();
    var smallinput=input.toLowerCase();
    if (small.includes(smallinput)==true) {
      result.push(items[i])
    }
  }
  if(result.length==0){
    alert='success'
  }
  for (let i=0;i<result.length;i++){
    if(result[i]=="Galaxy S21 Ultra"){
      ms1=1;
    }
    if(result[i]=="Iphone 13 Pro"){
      ms2=1;
    }
    if(result[i]=="Leaves of Grass"){
      ms3=1;
    }
    if(result[i]== "The Sun and Her Flowers"){
      ms4=1;
    }
    if(result[i]== "Boxing Bag"){
      ms5=1;
    }
    if(result[i]== "Tennis Racket"){
      ms6=1;
    }

  }
  res.render('searchresults',{msg1:ms1,msg2:ms2,msg3:ms3,msg4:ms4,msg5:ms5,msg6:ms6,alert});
})
app.get('/searchresults',function(req,res){
  res.render('searchresults',{msg1:0,msg2:0,msg3:0,msg4:0,msg5:0,msg6:0})
})


main().catch(console.error);
app.listen(5000);




