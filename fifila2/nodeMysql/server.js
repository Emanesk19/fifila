const express = require("express");
const body_parser = require("body-parser");
const mysql = require("mysql");
const server = express();

server.use(body_parser.json());

// establish connection 
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"fifila"
});

 db.connect(function(error){
    if(error){
        console.log("error connecting to db");
    }
    else{
        console.log("successfully connected to db");
    }
 });

// establish port
server.listen(8085 , function check(error){
    if(error){console.log("error");}
    else {console.log("started!!!8");}
 })


 // add a record
server.post("/api/product/add", (req , res)=>{
    let sql = "INSERT INTO `product`(name,qty_crt,categoryName,storeId,qty_pcs) VALUES ('"+ req.body.name +"','"+ req.body.qty_crt +"','"+ req.body.categoryId +"','"+ req.body.storeID +"','"+ req.body.qty_pcs +"')";
    db.query(sql,(error)=>{
        if(error){
            res.send({status:false , message:error.message})
            console.log(error.message);
        }
        else{
            res.send({status:true , message:"product created successfully"})
        }
    })
});

// retrive record
server.get("/api/product" , (req,res)=>{
    var sql = "SELECT * FROM product";

    db.query(sql,function(error ,result){
        if(error){
            console.log("error connecting to db");
        }
        else{
            res.send({status:true , data:result})
        }
    });
});

// search record
server.get("/api/product/:id" ,(req,res)=>{
    var pro_id = req.params.id;
    console.log(pro_id);
    var sql ="SELECT * FROM  product where id = '"+ pro_id +"'";
    db.query(sql,function(error , result){
        if(error)
            console.log("error connecting to db search");
        else
            res.send({status:true , data:result})
    })
})

server.get("/api/category" , (req,res)=>{
    var sql = "SELECT * FROM category";

    db.query(sql,function(error ,result){
        if(error){
            console.log("error getting  to category");
        }
        else{
            res.send({status:true , data:result})
        }
    });
});



// update record
server.put("/api/product/:id" , (req,res)=>{
    let sql = 
        "UPDATE product SET name = '"+ 
        req.body.name +
        "',categoryName = '"+
        req.body.categoryId+
        "' , qty_crt = '"+
        req.body.qty_crt +
        "' , storeId = '"+
        req.body.storeID+
        "' , qty_pcs = '"+
        req.body.qty_pcs+
        "' WHERE id= '"+req.params.id+"' "

    let query = db.query(sql ,function(error ,result){
            if(error){
                res.send({status:false , message:error.message})
            }

            res.send({status:true , message:"student updated"})
    });
});

// delete record

server.delete("/api/product/delete/:id" ,(req,res) =>{
    let sql = "DELETE FROM product WHERE  id = '"+ req.params.id+"'";
    let query = db.query(sql ,(error) =>{
        if(error) 
            res.send({status:false , message:error.message });

            res.send({status:true , message:"product deleted successfully"});
    });
});


let rowexists = (req , to) => {
      // Create the sql query (this uses placeholders)
      let sql = "SELECT 1 FROM `product` WHERE name  = '"+req.params.name +"' and storeId = '"+ to +"'";
      console.log(to);
      // Query the database replacing the ?? and ? with actual data
      db.query(sql,function(error, result, field){
        // Result will either be undefined or a row.
        // Convert it to a boolean and return it.
        if(result[0] === undefined){
                console.log("not found " , result );
            let sql = "INSERT INTO `product`(name,qty_crt,categoryName,storeId,qty_pcs) VALUES ('"+ req.params.name +"','"+ req.body.cty +"','"+ req.body.category_Name +"','"+ to +"','"+ req.body.qty_pcs +"')";
            db.query(sql,(error , res )=>{
                    if(error){
                        console.log(error.message);
                    }
                    else{
                        
                    }
                })
            }
                  
        else {
            let sql1 = "UPDATE product SET qty_crt = '"+ req.body.currentQty +"' where storeId = '"+req.params.storeId+"'"
            db.query(sql1,(error , res)=>{
                if (error){
                    console.log(error.message);
                }
                let sql2 = "UPDATE product SET qty_crt = '"+ req.body.cty +"' where storeId = '"+to+"'"
                    db.query(sql2);
                    console.log("found");
            })}
      });
  }
  
  // Get the data
// order
server.put("/api/orders/:id/:storeId/:to/:name" , (req , res)=>{
    rowexists(req , req.params.to)
});