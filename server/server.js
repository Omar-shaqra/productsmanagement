const express = require("express");
const bodyparser=require("body-parser");
const app=express();
const request = require('request');

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

app.use(bodyparser.json());

const http = require('http');
const port = process.env.PORT || 3000;



const mysql=require("mysql");
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'grocy'
});




db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('mysql connected...');

})


app.listen(port,function(){
console.log("server is on port port");

})



app.get("/",function(req,res){
  console.log("working");
  res.render("index");
});

app.post('/',function(req,res){

})




app.get("/contact.html",function(req,res){
  console.log("contact");
  res.render("contact.html");
});

app.post("/contact.html",function(req,res){
  console.log("contact");
  res.redirect("/");
});

let message="";

app.get("/login",function(req,res){

  console.log("login now!");
  res.render("login",{message:message});
   message="";
});


app.post('/login',function(req,res){
  var name = req.body.username;
  var pass = req.body.pass;
  if(name=="ehabramadan"&&pass=="ahyosaas"){
res.redirect("cashier")
  }else{
    message="Error ! Please Try Again ";
res.render("login",{message:message});
  }

})
var pinfo = "";

app.get("/cashier" , function(req,res){
console.log("cashier");

var num = 0;
let sql2="select * from num where id = 1";
let query2 = db.query(sql2,(err,result)=>{
  if (err) throw err;
//console.log(result);
num = Number(result[0].num) ;
num++;
console.log(num);
})



let sql="select * from productsinfo";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;
//console.log(result);
pinfo = result;
console.log(pinfo[0]['quantity']);
  res.render("cashier",{result:result,num:num});
})
})

app.post("/cashier",(req,res)=>{
console.log("cashier");
var data=req.body.data;
console.log(data);

//var myarray1 = JSON.parse(String(req.body.myarray1)) ;
var myarray1 = req.body.myarray1;
var myarray2 = req.body.myarray2;
var myarray3 = req.body.myarray3;
var myarray4 = req.body.myarray4;
let myArr1 = myarray1.split(",");
let myArr2 = myarray2.split(",");
let myArr3 = myarray3.split(",");
let myArr4 = myarray4.split(",");

console.log(myArr1);
console.log(myArr2);

//fwater table
var data=req.body.data;
var date = req.body.date;
var num = req.body.num;
var dis = req.body.dis;

var fatwra = data + "// discount is : " + dis;



let post = {date:date ,  num:num , fatwra:fatwra };
let sql="insert into fwater set ?";
let query = db.query(sql,post,(err,result)=>{
  if (err) throw err;
  console.log("insert fatwr");

let sql2 = "update num set num = ? where id=?"
let post2 =[num,1];
let query2 = db.query(sql2,post2,(err,result)=>{
if (err) throw err;
  console.log("num is updated");





  var quantity = parseInt(req.body.quantity);
try {


  for(var i = 0 ; i <=myArr1.length-1;i++){
  var parz = myArr1[i];
  var __FOUND = pinfo.findIndex(function(post, index) {
	if(post.parcode == parz)
		return true;
});
console.log(__FOUND);
      var pqu =parseInt(pinfo[__FOUND]['quantity']);
  //    console.log(pinfo.parcode[parz]['quantity']);

      var quz =parseInt(myArr2[i]);
      console.log("start");
      console.log(quz);
        let minsqu =parseInt(pqu-quz) ;
        console.log(pqu);
      console.log(minsqu);
  console.log(pinfo[i]['quantity'] + " " + minsqu );
      if (minsqu <0 ) {
        minsqu = 0;
      }

        let post3 = [minsqu , parz];
        let sql3="update productsinfo set quantity = ? where parcode = ?";
        let query3 = db.query(sql3,post3,(err,result)=>{
          if (err) throw err;


      })
  }

} catch (e) {
console.log("error quantity updated");
}

try {
  for(var i = 0 ; i <=myArr1.length-1;i++){


      var par = myArr1[i];
      var qu =parseInt(myArr2[i]);
      var name = myArr3[i];
      var price =parseFloat(myArr4[i]) ;



        let post3 = {parcode : par ,name : name , quantity : qu , price : price , date : date , num : num} ;
        let sql3="insert into movements set ? ";
        let query3 = db.query(sql3,post3,(err,result)=>{
          if (err) throw err;


      })
  }

} catch (e) {
  console.log("error insert movements");
}

  res.redirect("cashier");




})

})
})




app.get("/setting",(req,res)=>{
console.log("setting");

res.render("setting.html")
})

app.get("/Nproducts",(req,res)=>{
console.log("Nproducts");


var num = 0;
let sql2="select * from num where id = 2";
let query2 = db.query(sql2,(err,result)=>{
  if (err) throw err;
//console.log(result);
num = Number(result[0].num) ;
num++;
console.log(num);
})

let sql="select * from productsinfo";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;
//console.log(result);
  res.render("setting/nproducts",{result:result,num:num});
})


})


app.post("/Nproducts",(req,res)=>{


var num = req.body.incode;

  let sql2 = "update num set num = ? where id=?"
  let post2 =[num,2];
  let query2 = db.query(sql2,post2,(err,result)=>{
  if (err) throw err;
    console.log("num is updated");
})
//console.log("Nproducts");
var parcode =req.body.incode + req.body.taxcode + req.body.parcode ;
var name = req.body.name;
var pbuy = parseFloat(req.body.buy).toFixed(2) ;
var psell = parseFloat(req.body.sell).toFixed(2)  ;
console.log(parcode + name + pbuy + psell);
var safy = parseFloat( psell - pbuy).toFixed(2) ;

let post = {parcode:parcode ,  name:name , priceOfbuy: pbuy , priceOfsell : psell , safy : safy};
let sql="insert into productsinfo set ?";
let query = db.query(sql,post,(err,result)=>{
  if (err) throw err;
  console.log("insert one");

  res.redirect("Nproducts")
})

})

app.get("/update",(req,res)=>{
console.log("update");

let sql="select * from productsinfo";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;
//console.log(result);
  res.render("setting/update",{result:result});
})
})

app.get("/update2/:parcode/:name/:buy/:sell/:qu",(req,res)=>{
console.log("update2");
var name = req.params.name;
var parcode = req.params.parcode;
var buy = req.params.buy;
var sell = req.params.sell;
var qu = req.params.qu;
  res.render("setting/update2",{name:name,parcode:parcode,buy:buy,sell:sell,qu:qu})
})

app.post("/update2/:parcode/:name/:buy/:sell/:qu",(req,res)=>{
console.log("updatepost");

var name = req.body.name;
var parcode1 = req.params.parcode;
var parcode2 = req.body.parcode2;
var buy = parseFloat(req.body.buy);
var sell = parseFloat(req .body.sell);
var qu = parseInt(req .body.qu);
var safy = parseFloat(sell - buy);
console.log(parcode2 + buy + sell + qu);

try {


          let post = [buy,sell,safy,name,qu,parcode2,parcode1];
          let sql="update productsinfo set priceOfbuy = ? , priceOfsell= ? , safy = ? ,name = ? ,quantity = ?,parcode = ? where parcode = ?";
          let query = db.query(sql,post,(err,result)=>{
            if (err) throw err;


              res.redirect("/update")
  })


} catch (e) {
  console.log(e);
console.log("updated error!");
}

})


app.get("/fwater",(req,res)=>{
console.log("fwater");


let sql="select * from fwater";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;
//console.log(result);
  res.render("setting/fwater",{result:result});
})


})


app.get("/addproducts",(req,res)=>{
console.log("addproducts");

let sql="select * from productsinfo";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;
//console.log(result);
  res.render("setting/addproducts",{result:result});
})


})

app.post("/addproducts",(req,res)=>{
console.log("addproducts");
var parcode = req.body.parcode;
var quantity = parseInt(req.body.quantity);
console.log(parcode);
var parx = parcode.substr(0,parcode.indexOf(":")-1);
var qux =parcode.substr(parcode.indexOf("/")+2) ;
var intqux = parseInt(qux);
console.log(parx + " " + quantity);
console.log(qux + intqux);
let addqu =parseInt(intqux + quantity) ;
console.log("the add is : "+addqu);
let post = [addqu , parx];
let sql="update productsinfo set quantity = ? where parcode = ?";
let query = db.query(sql,post,(err,result)=>{
  if (err) throw err;
//console.log(result);
  res.redirect("addproducts");
})


})


app.get("/config",(req,res)=>{
console.log("store");


let sql="select * from productsinfo;";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;
//console.log(result);
  res.render("setting/config",{result:result});
})


})

app.get("/store",(req,res)=>{
console.log("store");


let sql="select * from productsinfo where quantity > 0;";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;
//console.log(result);
  res.render("setting/store",{result:result});
})


})


app.get("/storeEnd",(req,res)=>{
console.log("storeEnd");


let sql="select * from productsinfo where quantity < 4;";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;
//console.log(result);
  res.render("setting/storeEnd",{result:result});
})


})




app.get("/day",(req,res)=>{
console.log("accounts");


let sql="select * ,productsinfo.safy * movements.quantity as totalsafy from productsinfo right JOIN  movements on movements.parcode = productsinfo.parcode ";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;

console.log(result);
  res.render("setting/day",{result:result});
})


})


app.get("/trade",(req,res)=>{
console.log("trade");



let sql="select * from trader ";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;
//console.log(result);
  res.render("setting/trade",{result:result});
})



})

app.post("/trade",(req,res)=>{
console.log("trade");

var name=req.body.name;
var phone=req.body.phone;
var tradetype=req.body.tradetype;
var nationalid=req.body.nid;
var taxnum = req.body.taxnum;

        let post = {name : name , phone : phone , tradetype : tradetype ,nationalid:nationalid,taxnum:taxnum} ;
        let sql="insert into trader set ? ";
        let query = db.query(sql,post,(err,result)=>{
          if (err) throw err;
            res.redirect("trade")
        })




})


app.get("/trademovs",(req,res)=>{
console.log("trademovs");



let sql="select * from trader ";
let query = db.query(sql,(err,result)=>{
  if (err) throw err;
//console.log(result);
let sql2 = "SELECT trader.id,trader.name,trader.tradetype,trademovs.date,trademovs.themove, trademovs.cashe FROM trader INNER JOIN trademovs ON trader.id=trademovs.id";
let query2 = db.query(sql2,(err,result2)=>{
if (err) throw err ;

    res.render("setting/trademovs",{result:result,result2:result2});
})

})



})


app.post("/trademovs",(req,res)=>{
console.log("trademovs");

var trader = req.body.name;
var check = req.body.check;
var cashe = req.body.cashe;
var date = req.body.date;



var check2 = parseInt(check)

var cashe2 = parseFloat(cashe);
var mins = 0;


var id = trader.substr(0,trader.indexOf(":"));

 var safy = trader.substr(trader.indexOf("$")+1);
var safyint = parseFloat(safy);

var themove = "";
if (check2 == 1){
  themove = "give";
  mins = cashe2
}else {
  themove = "take";
  mins = -Math.abs(cashe2);
}

var final = 0;
final = safyint + mins;
console.log("final is " + final);

console.log("the id is :" +id + "//"  + ' ' + themove + ' ' + cashe + ' ' + date ) ;

let post = {id : id , themove: themove , date : date ,cashe:cashe} ;
let sql="insert into trademovs set ? ";
let query = db.query(sql,post,(err,result)=>{
  if (err) throw err;

let sql2 = "update trader set safy = ? where id = ? ";
let query2 = db.query(sql2,[final , id],(err,result2)=>{
if (err) throw err;

    res.redirect("trademovs");
})



})



})



app.get("/nasryat",(req,res)=>{
  let sql = "select * from nsryat";

  let query = db.query(sql,(err,result)=>{
    if (err) throw err;

  res.render("setting/nasryat",{result:result});
})
})

app.post("/nasryat",(req,res)=>{
var data = req.body.data;
var cashe = req.body.cashe;
var date = req.body.date;

let post = {data :data , cashe: cashe , date : date } ;
let sql="insert into nsryat set ? ";
let query = db.query(sql,post,(err,result)=>{
  if (err) throw err;

  res.redirect("/nasryat");
})
})


app.get("/back",(req,res)=>{
  let sql = "select * from productsinfo;";
  let query = db.query(sql,(err,result)=>{
    if (err) throw err;


    let sql2 = "select * from back;"
    let query2 = db.query(sql2,(err,result2)=>{
      if (err) throw err;
      res.render("setting/back",{result:result,result2:result2});
    })

  })
})

app.post("/back",(req,res)=>{
var par=req.body.parcode;
var quantity =parseInt(req.body.quantity) ;
var num = parseInt(req.body.num) ;
var date = req.body.date;
console.log(par+ " " + quantity + " " + num + " "+ date);

var parcode = par.substr(0,par.indexOf(":")-1);
console.log(parcode)
var qux =parseInt(par.substr(par.indexOf("/")+2) );
console.log(qux);

var final = parseInt(qux + quantity)

try {

  let post = {parcode : parcode , quantity:quantity , date : date ,num:num} ;
  let sql="insert into back set ? ";
  let query = db.query(sql,post,(err,result2)=>{
    if (err) throw err;

    let post2 = [final , parcode];
    let sql2="update productsinfo set quantity = ? where parcode = ?";
    let query2 = db.query(sql2,post2,(err,result3)=>{
    if (err) throw err;

  let sql3 = "select * from movements where num =? "
  let query3=db.query(sql3,num,(err,result)=>{
    var count = 0;
    var price = parseFloat(result[0].price / result[0].quantity);
    console.log(price);
    var co = 0
    for(var i = 0; i<= result.length-1;i++){
  count += parseInt(result[i].quantity);
  co ++;
    }
  console.log(count + " " + co);
  var uqu =parseInt(count - quantity) ;


  var finalprice = parseFloat(price * uqu);

  let post4 = [num,parcode]
  let sql4 = "delete from movements where num = ? and parcode = ?";
  let query4 = db.query(sql4,post4,(err,result4)=>{
  if(err) throw err;

  let sql5 = "insert into movements set ?";
  let post5 = {date:result[0].date , parcode:result[0].parcode , name:result[0].name , quantity:uqu , price:finalprice , num:num};
  let query5 = db.query(sql5,post5,(err,result5)=>{
    res.redirect("/back")
  })


    })
  })
  })

  })
} catch (e) {
console.log(err);
}

})
