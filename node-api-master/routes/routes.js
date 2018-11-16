// Load the MySQL pool connection
const pool = require('../data/config');
var jwt   = require('jsonwebtoken');
var fs=require('fs');


// Route the app
const router = app => {
    // Display welcome message on the root
    app.get('/', (request, response) => {
        response.send({message: 'Welcome to the Node.js Express REST API!'});
    });

    // Display all users
    app.get('/users', (request, response) => {
		
        pool.query('SELECT * FROM customers', (error, result) => {
            if (error) throw error;

            response.send(result);
        });
		
		
		
    });
	
	
	
	app.post('/api/v1/login_key',function(req,res){
const user ={id:1};
const token = jwt.sign({user},'molc')
res.json({token:token})

});
	
	
	function ensureToken(req,res,next){
        const bearerHeader = req.headers["authorization"];
        if(typeof bearerHeader !=='undefined'){
                const bearer = bearerHeader.split(" ");
                const bearerToken = bearer[1];
                req.token=bearerToken;
                next();
        }else{
                res.sendStatus(403);
        }
}


app.get('/api/v1/checkMobile',ensureToken,function(req,res){

var contactno = req.query.contactno;



jwt.verify(req.token,'molc',function(err,data){

                if(err){
                        console.log('rrrrrrrr'+err);
             res.sendStatus(403);

        }else{
var query = pool.query("select *  from customers where ContactNo='"+contactno+"'",function(err,rows){

if(err){

        res.send({"message":err});


}else{

        console.log("rrrrrr"+rows.length);
        if(rows.length>0){
                        res.send({"message":true});

        }else{
                        res.send({"message":false});

        }
}


});

}
});
});

app.get('/api/v1/checkMobileByMailID',ensureToken,function(req,res){

var contactno = req.query.contactno;



jwt.verify(req.token,'molc',function(err,data){

                if(err){
                        console.log('rrrrrrrr'+err);
             res.sendStatus(403);

        }else{
var query = pool.query("select *  from customers where ContactNo='"+contactno+"'",function(err,rows){

if(err){

        res.send({"message":err});


}else{

        console.log("rrrrrr"+rows.length);
        if(rows.length>0){
                        res.send({"message":true});

        }else{
                        res.send({"message":false});

        }
}


});

}
});


});


app.get('/api/v1/loginByMobileNo',ensureToken,function(req,res){

var ContactNo = req.query.ContactNo;

jwt.verify(req.token,'molc',function(err,data){

                if(err){
                        console.log('rrrrrrrr'+err);
             res.sendStatus(403);

        }else{
// req.assert('contactno','ContactNo required').notEmpty();

// var error = re.validationErrors();
// if(!error){

var query = pool.query("select * from customers where ContactNo='"+ContactNo+"'",function(err,rows){

   if(err){
console.log("error"+err);

}else{

if(rows.length>0){
        res.send({"response":rows});

}else{
        res.send({"response":"No Data Found"});

}

}


});

}
});
});




app.get('/api/v1/login',ensureToken,function(req,res){

var input = req.query.input;

                let MailidsPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       let MobileidPattern = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;


                if (MailidsPattern.test(input)) {
                         pool.query('SELECT * FROM customers where EmailID ="'+input+'" ', (error, result) => {
           if (error) throw error;
if(result.length>0){
          res.send({"response":result});}else{
res.send({"response":"No data found"});
          }
      });

                }else {
                if(MobileidPattern.test(input)){
                         pool.query('SELECT * FROM customers where ContactNo ="'+input+'" ', (error, result) => {
           if (error) throw error;

                                 if(result.length>0){
          res.send({"response":result});
                                 }else{
res.send({"response":"No Data Found"});
                                 }

      });
                                                               }
}

});


app.get('/api/v1/checkEmail',ensureToken,function(req,res){

var EmailID = req.query.EmailID;


jwt.verify(req.token,'molc',function(err,data){

                if(err){
                        console.log('rrrrrrrr'+err);
             res.sendStatus(403);

        }else{
var query = pool.query("select *  from customers where EmailID='"+EmailID+"'",function(err,rows){

if(err){

        res.send({"message":err});


}else{

        console.log("rrrrrr"+rows.length);
        if(rows.length>0){
                        res.send({"message":true});

        }else{
                        res.send({"message":false});

        }
}


});

}
});
});



app.post('/api/v1/addUserByMobile',ensureToken,function(req,res){





    jwt.verify(req.token,'molc',function(err,data){

                if(err){
                        console.log('rrrrrrrr'+err);
                        res.sendStatus(403);

        }else{



        /*

        var LoginType = req.body.LoginType;
        var FirstName  = req.body.FirstName;
        var EmailID = req.body.EmailID;
        var ProfileImage = req.body.ProfileImage;
*/

var query=pool.query('insert customers set ?',req.body,function(err,rows){


if(err){


        res.json({
          status:400,
          message:err
        })
     res.send("{message:"+err+"}");
}else{
        res.json({
          status:200,
          message:rows
        })

}

})

}
});
});





app.post('/api/v1/addGroup',ensureToken,function(req,res){
jwt.verify(req.token,'molc',function(err,data){
if(err){
        res.sedStatus(403);
}else{

        var query=pool.query('insert  Create_group set ?',req.body,function(err,rows){

if(err){
        res.json({status:400,message:err})
}else{

        res.json({status:200,message:rows})

}
});
}});
});




const util = require('util');

app.get('/api/v1/getProduct',ensureToken,function(req,res){

var newdata = [];

var cats = [];

var subcats = [];

var data=[];

var subprod = [];

var p_subcat = [];

        jwt.verify(req.token,'molc',function(err,data){

                if(err){
                        console.log('rrrrrrrr'+err);
             res.sendStatus(403);

        }else{

                console.log('ressssss'+data);

 var query = pool.query('select * from product_temp pt join product_image pm on (pt.product_id=pm.ProductID)',function(err,rows){

// if(err){
//       console.log("rowww"+err);

// }else{

         //console.log("rowww"+ JSON.stringify(rows));

   data = JSON.stringify(rows);

//}).then(rows=>data,)

// }
//  console.log("rowww"+rows);


var categories = [...new Set(rows.map(item => item.category_id))];


categories.forEach((category, i) => {
        var temp1 = {};
        cats[i] = [];
        rows.forEach(d => {
                if (d.category_id === category) {
                        cats[i].push(d);
                                                       
													   
													                    temp1.category_name = d.category_name;
                }
        });

        var subcategories = [...new Set(cats[i].map(item => item.subcategory_id))];

        temp1.subCategories = [];

        subcategories.forEach((sc, j) => {
                subcats[j] = [];
                var temp2 = {};

                cats[i].forEach(cat => {
                        if (cat.subcategory_id === sc) {
                                subcats[j].push(cat);
                                temp2.subcategory_id = cat.subcategory_id;
                                temp2.subcategory_name = cat.subcategory_name;

                                console.log("subbbb",temp2.subcategory_id);
                        }
                });


    temp2.p_subcat = [];

      var p_sub_cat = [...new Set(subcats[j].map(item => item.p_subcat_id))];



                         p_sub_cat.forEach((pscat,m)=>{

                        var temp5={};
                        p_subcat[m] =[];
                        subcats[j].forEach(p_cat=>{

                        if(p_cat.p_subcat_id==pscat){

                        p_subcat[m].push(p_cat);

                        temp5.p_subcat_id = p_cat.p_subcat_id;
                        temp5.p_subcat_name = p_cat.p_subcat_name;




                temp5.productdetails = [];

                var products = [...new Set(p_subcat[m].map(item => item.product_id))];

                products.forEach((ps, k) => {
                        var temp3 = {};
            subprod[k] = [];
                        p_subcat[m].forEach(scat => {
                                if (scat.product_id === ps) {
                                        subprod[k].push(scat);
                                        temp3.product_id = scat.product_id;
                                        temp3.product_name = scat.product_name;
										
										temp3.product_price = scat.product_price;
                                        temp3.product_description = scat.product_description;
                                        temp3.product_status=scat.product_status;
                                        temp3.product_isactive=scat.product_isactive;
                                        temp3.product_unit=scat.product_unit;
                                        temp3.product_discount=scat.product_discount;
                                        temp3.product_offer_start_dt=scat.product_offer_start_dt;
                                        temp3.product_offer_end_dt=scat.product_end_dt;
                                        temp3.product_color=scat.product_color;
                                        temp3.product_size=scat.product_size;
                                        temp3.product_discount_group=scat.product_discount_group;
                                        temp3.product_gst_includes=scat.product_gst_includes;
                                        temp3.product_image = scat.product_image;

                     //temp3.Imageurl=scat.Imageurl;
                                        temp5.productdetails.push(temp3);

                     temp3.Images=[];
                                   var imageurlss = [...new Set(subprod[k].map(item =>item.Image_id))];
                                imageurlss.forEach((is,l)=>{
                                var temp4={};

                                subprod[k].forEach(sprod=>{
                                if(sprod.Image_id==is){
                                        temp4.imageid=sprod.Image_id;
                                        temp4.imageurl=sprod.Imageurl;
                                        temp3.Images.push(temp4);
                                }

                                });

                                });


                                        }
                                });

                // console.log("subbbb",temp3);



                });


           temp2.p_subcat.push(temp5);
                        }
                                                              
                                                                                       });
                        });
                });





                temp1.subCategories.push(temp2);
        });

        newdata.push(temp1);


                                                                console.log("final",newdata);

});
res.json(newdata);

}


});
});




app.get('/api/v1/getBanner',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){

if(err){
        res.send(403);

}else{
        var query = pool.query("select * from product_banner",function(err,rows){

if(err){
        console.log("err"+err);

}else{
        if(rows.length>0){
                res.send({"response":rows,
                data:data})
        }else{
                res.send({"response":"No Data Found",data:data});
        }
}
});

}

});



});



app.get('/api/v1/getProductImages',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){

                var ProductID = req.query.ProductID;
if(err){
 res.send(403);

}else{
        var query = pool.query('select * from product_image where ProductID = "'+ProductID+'"',function(err,rows){

if(err){
        console.log("err"+err);

}else{
        if(rows.length>0){
                res.send({"response":rows,
                data:data})
        }else{
                res.send({"response":"No Data Found",data:data});
        }
}
});

}

});



});

app.get('/api/v1/getGroups',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){

if(err){
 res.send(403);

}else{
			var query = pool.query("select * ,Date_add(created_date, INTERVAL 1 DAY)  as  expirydate ,timediff('24:00:00',time_format(timediff(current_timestamp(),created_date) ,'%H:%i:%s')) as timecount from Create_group cg join customers cs on (cg.customer_id=cs.CustomerID) where payment_status='N' and no_multy='0'", function(err,rows){

if(err){
        console.log("err"+err);

}else{
        if(rows.length>0){
                res.send({"response":rows,
                data:data})
        }else{
                res.send({"response":"No Data Found",data:data});
        }
}
});

}

});



});



app.get('/api/v1/getProductReview',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){

                var product_id = req.query.product_id;
if(err){
        res.send(403);

}else{
        var query = pool.query('SELECT c.FirstName,c.CustomerID,c.ProfileImage,pv.product_id,pv.Product_rating,pv.review_description FROM product_review pv  join customers c on (c.CustomerID=pv.customer_id)  where product_id="'+product_id+'"',function(err,rows){

if(err){
        console.log("err"+err);

}else{
        if(rows.length>0){
                res.send({"response":rows,
                data:data})
        }else{
                res.send({"response":"No Data Found",data:data});
        }
}
});

}

});
});


app.get('/api/v1/getProducts',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){

if(err){
        res.send(403);

}else{
        var query = pool.query('SELECT * from product_temp',function(err,rows){

if(err){
        console.log("err"+err);

}else{
        if(rows.length>0){
                res.send({"response":rows,
                data:data})
        }else{
                res.send({"response":"No Data Found",data:data});
        }
}
});

}
		});
});

	app.get('/api/v1/getProductsById',function(req,res){
		var product_id=req.query.product_id;
     //   jwt.verify(req.token,'molc',function(err,data){

//if(err){
   //     res.send(403);

//}else{
        var query = pool.query('SELECT * from product_temp where product_id="'+product_id+'"',function(err,rows){

if(err){
        console.log("err"+err);

}else{
        if(rows.length>0){
                res.send({"response":rows})
        }else{
                res.send({"response":"No Data Found"});
        }
}
});

//}
		//});
});

	
	

app.post('/api/v1/addGroupJoin',function(req,res){
   
    var data={
        "error":1,
        "mjm":""
    };

  var pGroup_id = req.query.pGroup_id;
var pCustomer_id = req.query.customer_id;
var pJoin_status = req.query.pJoin_status;
var pNo_multy = req.query.pNo_multy;
var pPayment_status = req.query.pPayment_status;

console.log('resu'+pGroup_id);

     var connectionCount = 0;
     connectionFunc();
  function connectionFunc(){
   pool.getConnection(function(err,connection){
    if(connection!=undefined){
    connection.query("Call sp_getcustomers('"+pGroup_id+"','"+pCustomer_id+"','"+pJoin_status+"','"+pNo_multy+"','"
      +pPayment_status+"')",function(err,rows,fields){

        connection.release();
        if(!err){
            res.json({code:1,message:'added'});
        }else{
            data["error"]=1;
            data["users"]="not added";
            res.json({code:0,message:'not added'+err});
        }
    })
  }
  else{
    connectionCount++;
      if(connectionCount<5){
        connectionFunc();
      }
      else{
        console.log("Mysql connection failed");
        res.send("Mysql connection failed");
      }
  }
  });
 }
});


//not used
app.get('/api/v1/getProductList',function(req,res){

//         jwt.verify(req.token,'molc',function(err,data){

//                 if(err){
//              res.send(403);

//         }else{
var query = pool.query("SELECT * FROM product_temp ",function(err,rows){

   if(err){
console.log("error"+err);

}else{

if(rows.length>0){
        res.send({"response":rows});

}else{
        res.send({"response":"No Data Found"});

}

}


});

	

// }
});

// });








































/*


	
	 // Display all users
    app.get('/login', (request, response) => {
		
		var input = request.query.input;
		
		let MailidsPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       let MobileidPattern = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;

		
		if (MailidsPattern.test(input)) {
			 pool.query('SELECT * FROM customers where EmailID ="'+input+'" ', (error, result) => {
           if (error) throw error;

          response.send(result);
      });
			
		}else {		
		if(MobileidPattern.test(input)){
			 pool.query('SELECT * FROM customers where ContactNo ="'+input+'" ', (error, result) => {
           if (error) throw error;

          response.send(result);
		 
      });
		
		}
		
	}
	
		
		//console.log('input value '+input);
		
     
				
		
    });

	//count check 
	
	
	 app.get('/checkAlreadyExist', (request, response) => {
		
		var input = request.query.input;
		
		let MailidsPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       let MobileidPattern = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;

		
		if (MailidsPattern.test(input)) {
			 pool.query('SELECT COUNT(*) as count FROM customers where EmailID ="'+input+'" ', (error, results) => {
           if (error) throw error;
          response.send(results);
      });
			
		}else {		
		if(MobileidPattern.test(input)){
			 pool.query('SELECT COUNT(*) as count FROM customers where ContactNo ="'+input+'" ', (error, results) => {
           if (error) throw error;
		   

          response.send(results);
		 
      });
		33
		}
		
	}
	
		
		//console.log('input value '+input);
		
     
				
		
    });
	
	
	
	//insert product
	
	 // Add a new user
    app.post('/placeOrder', (request, response) => {
        pool.query('INSERT INTO orderdetails SET ?', request.body, (error, result) => {
			
            if (error) throw error;

					console.log("orderrrrr"+JSON.Stringfy(request.body.order_date));
					
			
			pool.query('INSERT INTO ref_orderdetails (order_date,customer_id) values("'+request.body.order_date+'","'+request.body.customer_id+'") ',(error,result)=>{
				
				
            response.status(201).send(`Product placed  with  order ID: ${result}`);
			
			});
			});
			
        });
    
		
		
		
	
	app.get('/getAllProducts',(request,response) =>{
		
		pool.query('select * from product_temp p  left join product_review pr on(p.product_id = pr.product_id) join product_image pi on (p.product_id=pi.ProductID) order by Product_rating desc',(error,result) =>{
			if(error) throw error;
		response.send(result);	
		});
	});
	
	
	
	app.get('/getOrderDetails',(request,response) =>{
		
		var CustomerID = request.query.CustomerID;
		pool.query('SELECT * FROM orderdetails where CustomerID ="'+CustomerID+'"',(error,result) =>{
			if(error) throw error;
			
			response.send(result);
		});
	});
	
	
	

    // Display a single user by ID
    app.get('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('SELECT * FROM users WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });

    // Add a new user
    app.post('/users', (request, response) => {
        pool.query('INSERT INTO users SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send(`User added with ID: ${result.insertId}`);
        });
    });

    // Update an existing user
    app.put('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('UPDATE users SET ? WHERE id = ?', [request.body, id], (error, result) => {
            if (error) throw error;

            response.send('User updated successfully.');
        });
    });

    // Delete a user
    app.delete('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('DELETE FROM users WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send('User deleted.');
        });
    });
	
	*/

}

// Export the router
module.exports = router;
