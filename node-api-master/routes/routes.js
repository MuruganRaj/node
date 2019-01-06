const pool = require('../data/config');
var jwt   = require('jsonwebtoken');
var fs=require('fs');
const path =require('path');
var multer = require('multer');

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
	
	var upload = multer({ dest: 'images/'});


app.get('/:filename',function(req,res){
	var filename = req.params.filename;
	
	console.log(filename);
	  fs.readFile(__dirname + '/'+filename, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");    
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
    });
});
app.post('/api/v1/updateProfile',upload.single('file'),function(req,res){
   
   var file = __dirname + '/' + req.file.filename+".jpg";
  
  //if(file!=null){
  //console.log(req.file);
  fs.rename(req.file.path, file, function(err) {
    if (err) {
      console.log(err);
      res.send(500);
    } else {
	   var filename= req.file.filename;
	   var file_extenstion= req.file.originalname;

	   var file_ex=file_extenstion.split(".");
	   var file_temp = file_ex[1];
 var data={
        "error":1,
        "mjm":""
    };
	
	//console.log('rrrrrrrr'+fileurl);

 var sFirstName = req.query.sFirstName;
var sLastName = req.query.sLastName;
var sAddress1 = req.query.sAddress1;
var sContactNo = req.query.sContactNo;
var sEmailId = req.query.sEmailId;
var sCustomerID = req.query.sCustomerID;
//var sProfile_image=req.query.sProfile_image;

     var connectionCount = 0;
     connectionFunc();
  function connectionFunc(){
   pool.getConnection(function(err,connection){
    if(connection!=undefined){
		
	 var   fileurl ="http://18.224.1.148:3000/"+filename+"."+file_temp;
   // sProfile_image = fileurl;

    connection.query("Call spUpdate_profile('"+sFirstName+"','"+sLastName+"','"+sAddress1+"','"
      +sContactNo+"','"+fileurl+"','"+sEmailId+"','"+sCustomerID+"')",function(err,rows,fields){

        connection.release();
        if(!err){
            res.json({code:1,message:rows[0]});
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
 
	}
   
  });
  
 
});
app.post('/file_upload', upload.single('file'), function(req, res) {
  var file = __dirname + '/' + req.file.filename+".jpg";
  
  //console.log(req.file);
  fs.rename(req.file.path, file, function(err) {
    if (err) {
      console.log(err);
      res.send(500);
    } else {
	   var filename= req.file.filename;
	   var file_extenstion= req.file.originalname;

	   var file_ex=file_extenstion.split(".");
	   var file_temp = file_ex[1];
	   
	   console.log('exteee'+file_temp);
	   var FirstName = req.query.FirstName;
	   var CustomerID = req.query.CustomerID;
		var file ="http://18.224.1.148:3000/"+filename+"."+file_temp;
				pool.query('update customers set ProfileImage="'+file+'" , FirstName="'+FirstName+'" where CustomerID="'+CustomerID+'"', 
				 function(err) { 
				if (err) {
					res.status(500);
					res.send(err);
				}
				else {
					res.status(200);
					//res.send({ status: "Success" });
					 res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename
      });
				 }
				});
     
    }
  });
});

	
	
	app.get('/api/v1/updateShippingAddr',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){
		
		var sType = req.query.sType;
		var sCustomerid = req.query.sCustomerid;
		var sAddress = req.query.sAddress;
		var sPincode = req.query.sPincode;

if(err){
 res.send(403);

}else{
			var query = pool.query("Call spUpdate_shippingAddr('"+sType+"','"+sCustomerid+"','"+sAddress+"','"+sPincode+"')", function(err,rows){

if(err){
        console.log("err"+err);
		res.send({code:0,"response":err.sqlMessage})

}else{
        if(rows.length>0){
                res.send({code:1,"response":rows[0]})
                //data:data})
        }else{
                res.send({"response":"No Data Found"});
        }
}
});

}

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

	
	
	app.get('/api/v1/getGroupsById',ensureToken,function(req,res){
       jwt.verify(req.token,'molc',function(err,data){
	
	
	if(err){
 res.send(403);

}else{
		var productlink = req.query.productlink;
		var group_id = req.query.group_id;

			var query = pool.query("select * ,ADDTIME(created_date, '29:30:00')  as  expirydate ,timediff('24:00:00',time_format(timediff(current_timestamp(),created_date) ,'%H:%i:%s')) as timecount from Create_group cg join customers cs on (cg.customer_id=cs.CustomerID) where payment_status='N' and no_multy='0' and group_status = 'Active' and productlink= '"+productlink+"' and group_id ='"+group_id+"' order by group_id desc", function(err,rows){

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

}

});



});

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

	
	

app.get('/api/v1/getPendingRegStatus',ensureToken,function(req,res){
jwt.verify(req.token,'molc',function(err,data){
	var ContactNo = req.query.ContactNo;
	
if(err){
        res.sedStatus(403);
}else{

        var query=pool.query('SELECT count(*) as usercount from customers  where step_status="1" and ContactNo="'+ContactNo+'"',function(err,rows){

if(err){

        res.send({"message":err});


}else{

        console.log("rrrrrr"+rows[0].usercount);
		
		var numRows = rows[0].usercount;
        if(numRows>0){
                        res.send({"message":true});

        }else{
                        res.send({"message":false});

        }
}
});
}});
});



	
	
app.get('/api/v1/getProductByGroupID',ensureToken,function(req,res){

var group_id = req.query.group_id;

jwt.verify(req.token,'molc',function(err,data){

                if(err){
                        console.log('rrrrrrrr'+err);
             res.sendStatus(403);

        }else{
// req.assert('contactno','ContactNo required').notEmpty();

// var error = re.validationErrors();
// if(!error){

var query = pool.query("select * from product_temp pt join Create_group cg on (pt.product_id =cg.product_id) where cg.group_id="+group_id,function(err,rows){

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



app.get('/api/v1/getLiveUser',function(req,res){
       
			var query = pool.query("select FirstName,ProfileImage,fuserid from  customers where loginType='FB' order by CustomerID desc limit 1;", function(err,rows){

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




});
	
	
	
	app.get('/api/v1/getCompitionUsers',function(req,res){
       
			var query = pool.query("select  first_name, referal_id, counts from our_customers union all (select b.FirstName as first_name, a.referal_id as referal_id, a.counts as counts from (SELECT  referal_id,  count(referal_id) as counts FROM customers where created_at between DATE_ADD(now(), INTERVAL(1-DAYOFWEEK(now())) DAY) and DATE(NOW() + INTERVAL (7 - DAYOFWEEK(NOW())) DAY) group by referal_id  order by count(referal_id) desc) as a inner join customers as b on (a.referal_Id=b.CustomerID) where b.FirstName is not null) order by counts desc limit 8", function(err,rows){

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




});
	
	
	
	
	
	

app.get('/api/v2/login',ensureToken,function(req,res){

var input = req.query.input;

                let MailidsPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       let MobileidPattern = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;


                if (input.toString().length>10) {
                         pool.query('SELECT * FROM customers where fuserid ="'+input+'" ', (error, result) => {
           if (error) throw error;
if(result.length>0){
          res.send({"response":result});}else{
res.send({"response":"No data found"});
          }
      });

                }else {
               // if(MobileidPattern.test(input)){
                         pool.query('SELECT * FROM customers where ContactNo ="'+input+'" ', (error, result) => {
           if (error) throw error;

                                 if(result.length>0){
          res.send({"response":result});
                                 }else{
res.send({"response":"No Data Found"});
                                 }

      });
                                                               }
//}

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
               // if(MobileidPattern.test(input)){
                         pool.query('SELECT * FROM customers where ContactNo ="'+input+'" ', (error, result) => {
           if (error) throw error;

                                 if(result.length>0){
          res.send({"response":result});
                                 }else{
res.send({"response":"No Data Found"});
                                 }

      });
                                                               }
//}

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
app.get('/api/v2/checkEmail',ensureToken,function(req,res){

var fuserid = req.query.fuserid;


jwt.verify(req.token,'molc',function(err,data){

                if(err){
                        console.log('rrrrrrrr'+err);
             res.sendStatus(403);

        }else{
var query = pool.query("select *  from customers where fuserid='"+fuserid+"'",function(err,rows){

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

app.get('/api/v1/getDummyUser',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){
		
		var customer_id = req.query.customer_id;

if(err){
 res.send(403);

}else{
			var query = pool.query("SELECT Fname FROM dummy_user ORDER BY rand() LIMIT 1", function(err,rows){

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

}

});



});

	
	
app.post('/api/v1/addcustomersnew',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){
		
		var sLogintype = req.query.sLogintype;
		var sContactno = req.query.sContactno;
		var sReferal_id = req.query.sReferal_id;
		var sStep_status = req.query.sStep_status;

if(err){
 res.send(403);

}else{
			var query = pool.query("Call sp_addCustomers('"+sLogintype+"','"+sContactno+"','"+sReferal_id+"','"+sStep_status+"')", function(err,rows){

if(err){
        console.log("err"+err);
		res.send({code:0,"response":err.sqlMessage})

}else{
        if(rows.length>0){
                res.send({code:1,"response":rows[0]})
                //data:data})
        }else{
                res.send({"response":"No Data Found"});
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
        res.send(403);
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

	
	app.get('/api/v1/updateAddress1',ensureToken,function(req,res){
		    const FirstName = req.query.FirstName;
		    const BillingContactNo = req.query.BillingContactNo;
		    const EmailID = req.query.EmailID;
		    const Address1 = req.query.Address1;
		    const BillingAddress = req.query.BillingAddress;
		    const Billingcountry = req.query.Billingcountry;
		    const BillingPostalCode = req.query.BillingPostalCode;
		    const ShipAddress = req.query.ShipAddress;
		    const ShipCity = req.query.ShipCity;
		    const ShipPostalCode = req.query.ShipPostalCode;
		    const CustomerID = req.query.CustomerID;

jwt.verify(req.token,'molc',function(err,data){
if(err){
        res.send(403);
}else{

        var query=pool.query('update customers set FirstName="'+FirstName+'",BillingContactNo="'+BillingContactNo+'",EmailID ="'+EmailID+'",Address1="'+Address1+'",BillingAddress="'+BillingAddress+'",Billingcountry="'+Billingcountry+'",BillingPostalCode="'+BillingPostalCode+'",ShipAddress="'+ShipAddress+'",ShipCity="'+ShipCity+'",ShipPostalCode= "'+ShipPostalCode+'" where CustomerID="'+CustomerID+'"',function(err,rows){

if(err){
        res.json({status:400,message:err})
}else{

        res.json({status:200,message:'User updated successfully.'})

}
});
}});
});

	
	

	app.get('/api/v1/updateFBChallenge',function(req,res){
		    const FirstName = req.query.FirstName;
		    const EmailID = req.query.EmailID;
		    const ContactNo = req.query.ContactNo;
		   const ProfileImage =req.query.ProfileImage;
		   const fuserid =req.query.fuserid;



        var query=pool.query('update customers set FirstName="'+FirstName+'", EmailID="'+EmailID+'",loginType="FB",ProfileImage="'+ProfileImage+'",fuserid="'+fuserid+'" ,step_status=2 where ContactNo="'+ContactNo+'"',function(err,rows){

if(err){
        res.json({status:400,message:err})
}else{

        res.json({status:200,message:'User updated successfully.'})

}
});
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
                res.send({"response":rows})
        }else{
                res.send({"response":"No Data Found"});
        }
}
});

}

});



});



app.post('/api/v1/placeOrder',function(req,res){
   
   
  
	//console.log('rrrrrrrr'+fileurl);

 var sCustomer_id = req.query.sCustomer_id;
var sPayment_method_code = req.query.sPayment_method_code;
var sPayment_method_details = req.query.sPayment_method_details;
var sTotal_price = req.query.sTotal_price;
var sProduct_price = req.query.sProduct_price;
var sOrder_id = req.query.sOrder_id;
var sQuantity = req.query.sQuantity;
var sOrderStatus = req.query.sOrderStatus;
var sOrderInvoice = req.query.sOrderInvoice;
var sProductId = req.query.sProductId;
var sMolc_sku_id = req.query.sMolc_sku_id;
var sPaymentStatus = req.query.sPaymentStatus;
var pSno = req.query.pSno;
var sSuplier_id = req.query.sSuplier_id;
var sTransactionId = req.query.sTransactionId;

var data={
        "error":1,
        "mjm":""
    };

     var connectionCount = 0;
     connectionFunc();
  function connectionFunc(){
   pool.getConnection(function(err,connection){
    if(connection!=undefined){
		
   // sProfile_image = fileurl;


    connection.query("Call place_orders('"+sCustomer_id+"','"+sPayment_method_code+"','"
      +sPayment_method_details+"','"+sTotal_price+"','"+sProduct_price+"','"+sOrder_id+"','"+sQuantity+"', '"+sOrderStatus+"','"+sOrderInvoice+"', '"+sProductId+"','"+sMolc_sku_id+"','"+sPaymentStatus+"','"+pSno+"','"+sSuplier_id+"','"+sTransactionId+"')",function(err,rows,fields){
   
        connection.release();
        if(!err){
            res.json({code:1,message:rows[0]});
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
	
	
	app.get('/api/v1/getSplashImages',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){

               
if(err){
 res.send(403);

}else{
        var query = pool.query('SELECT imageurl FROM splash_screen where active=1',function(err,rows){

if(err){
        console.log("err"+err);

}else{
        if(rows.length>0){
                res.send({"response":rows
               })
        }else{
                res.send({"response":"No Data Found"});
        }
}
});

}

});

});
	
	
	
	
	

app.get('/api/v1/getGroups',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){
		
		var productlink = req.query.productlink;

if(err){
 res.send(403);

}else{
			var query = pool.query("select * ,ADDTIME(created_date, '29:30:00')  as  expirydate ,timediff('24:00:00',time_format(timediff(current_timestamp(),created_date) ,'%H:%i:%s')) as timecount from Create_group cg join customers cs on (cg.customer_id=cs.CustomerID) where payment_status='N' and no_multy='0' and group_status = 'Active' and productlink= '"+productlink+"' order by group_id desc", function(err,rows){

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

app.get('/api/v1/getReviewById',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){
		
		var customer_id = req.query.customer_id;

if(err){
 res.send(403);

}else{
			var query = pool.query("SELECT * FROM product_review where customer_id='"+customer_id+"';", function(err,rows){

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

}

});



});

app.get('/api/v1/getOrdersById',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){
		
		var sCustomerid = req.query.sCustomerid;
		var sOrder_status_id = req.query.sOrder_status_id;

if(err){
 res.send(403);

}else{
			var query = pool.query("Call spOrderDetails('"+sOrder_status_id+"','"+sCustomerid+"')", function(err,rows){

if(err){
        console.log("err"+err);

}else{
        if(rows.length>0){
                res.send({"response":rows[0]})
                //data:data})
        }else{
                res.send({"response":"No Data Found"});
        }
}
});

}

});



});






app.get('/api/v1/getProductByType',function(req,res){
   
    var data={
        "error":1,
        "mjm":""
    };

  var sType = req.query.sType;
var sCategoryId = req.query.sCategoryId;


     var connectionCount = 0;
     connectionFunc();
  function connectionFunc(){
   pool.getConnection(function(err,connection){
    if(connection!=undefined){
    connection.query("Call spGetProduct('"+sType+"','"+sCategoryId+"')",function(err,rows,fields){

        connection.release();
        if(!err){
          if(rows[0].length>0){
		     res.json({code:1,message:rows[0]});

			}else{
				 res.json({code:1,message:"No data found"});
			}
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


app.get('/api/v1/getOrder_id',function(req,res){
   
    var data={
        "error":1,
        "mjm":""
    };

  

     var connectionCount = 0;
     connectionFunc();
  function connectionFunc(){
   pool.getConnection(function(err,connection){
    if(connection!=undefined){
    connection.query("Call sp_orderid()",function(err,rows,fields){

        connection.release();
        if(!err){
            res.json({code:1,message:rows[0]});
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


	app.get('/api/v1/getCompition',function(req,res){
   
		var stype =req.query.stype;
    var data={
        "error":1,
        "mjm":""
    };

  

     var connectionCount = 0;
     connectionFunc();
  function connectionFunc(){
   pool.getConnection(function(err,connection){
    if(connection!=undefined){
    connection.query("Call sp_challenge('"+stype+"')",function(err,rows,fields){

        connection.release();
        if(!err){
            res.json({code:1,message:rows[0]});
        }else{
            
            res.json({code:0,message:'No data found'});
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

	
app.get('/api/v1/getGroupcount',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){
var product_id = req.query.product_id;
		

if(err){
 res.send(403);

}else{
        var query = pool.query("select count(group_id) as group_count from Create_group where payment_status ='N' and group_status ='Active'  and product_id ='"+product_id+"' ",function(err,rows){

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

}

});



});	
	
	

app.post('/api/v1/addGroupJoin',function(req,res){
   
    var data={
        "error":1,
        "mjm":""
    };

  var pGroup_id = req.query.pGroup_id;
var pCustomer_id = req.query.pCustomer_id;
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
            res.json({code:1,message:rows[0]});
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
var query = pool.query("SELECT * FROM product_temp  ORDER BY RAND()",function(err,rows){

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
	
	
	
	app.get('/api/v1/getProductListByCategory',function(req,res){

		var category_id =req.query.category_id;
		
//         jwt.verify(req.token,'molc',function(err,data){

//                 if(err){
//              res.send(403);

//         }else{
var query = pool.query("SELECT * FROM product_temp  where category_id='"+category_id+"' ",function(err,rows){

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

	
	
	
	
	
app.get('/api/v1/getWalletBal',function(req,res){
   
    var data={
        "error":1,
        "mjm":""
    };

	var sType = req.query.sType;
	var sUserid = req.query.sUserid;
	var sWalletamt  =req.query.sWalletamt;
  

     var connectionCount = 0;
     connectionFunc();
  function connectionFunc(){
   pool.getConnection(function(err,connection){
    if(connection!=undefined){
    connection.query("call spWalletRecharge('"+sType+"',"+sUserid+", "+sWalletamt+")",function(err,rows,fields){

        connection.release();
        if(!err){
            res.json({code:1,message:rows[0]});
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

app.get('/api/v1/getProductList_new',ensureToken,function(req,res){

        jwt.verify(req.token,'molc',function(err,data){

                if(err){
             res.send(403);

        }else{
var query = pool.query("select s.subcat_name, c.category_name,p.* from product_new p  join category c on  (c.category_id=p.category_id)   join subcategory s on (p.subcategory_id=s.subcat_id)",function(err,rows){

   if(err){
console.log("error"+err);

}else{

if(rows.length>0){
        res.send({"response":rows,
        data:data});

}else{
        res.send({"response":"No Data Found",data:data});

}

}


});



}
});

});



app.post('/api/v1/addReview',ensureToken,function(req,res){
jwt.verify(req.token,'molc',function(err,data){
if(err){
        res.sedStatus(403);
}else{

        var query=pool.query('insert  product_review set ?',req.body,function(err,rows){

if(err){
        res.json({status:400,message:err})
}else{

        res.json({status:200,message:"Review Added"})

}
});
}});
});




app.get('/api/v1/getProductReview',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){

    var product_id = req.query.product_id;
if(err){
        res.send(403);

}else{
        var query = pool.query('SELECT c.FirstName,c.CustomerID,c.ProfileImage,pv.product_id,pv.rating,pv.description FROM product_review pv  join customers c on (c.CustomerID=pv.customer_id)  where product_id="'+product_id+'"',function(err,rows){

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



app.get('/api/v1/getProductByRetailer',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){

		var supplier_id = req.query.supplier_id;
if(err){
        res.send(403);

}else{
        var query = pool.query('SELECT * from product_temp where supplier_id="'+supplier_id+'"',function(err,rows){

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



app.get('/api/v1/getProductBySimiler',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){

		var category_id = req.query.category_id;
		var subcategory_id = req.query.subcategory_id;
		
if(err){
        res.send(403);

}else{
        var query = pool.query('SELECT * from product_temp where category_id="'+category_id+'" and subcategory_id ="'+subcategory_id+'" ',function(err,rows){

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


	app.get('/api/v1/getJoinUserStatusa',ensureToken,function(req,res){
jwt.verify(req.token,'molc',function(err,data){
	var group_id = req.query.group_id;
	var customer_id = req.query.customer_id;
	
if(err){
        res.sedStatus(403);
}else{

        var query=pool.query('select count(*) as usercount from join_group where group_id ="'+group_id+'" and customer_id ="'+customer_id+'"',function(err,rows){

if(err){

        res.send({"message":err});


}else{

        console.log("rrrrrr"+rows[0].usercount);
		
		var numRows = rows[0].usercount;
        if(numRows>0){
                        res.send({"message":true});

        }else{
                        res.send({"message":false});

        }
}
});
}});
});



app.get('/api/v1/getJoinUserImages',ensureToken,function(req,res){

        jwt.verify(req.token,'molc',function(err,data){
			var group_id = req.query.group_id;

			console.log('rrrreeeeee'+group_id);
                if(err){
             res.send(403);

        }else{

var query = pool.query('select c.CustomerID,c.loginType, c.ProfileImage , c.FirstName,c.LastName,c.EmailID ,c.ContactNo,c.Address1 from join_group j  join customers c on (j.customer_id=c.CustomerID) where group_id="'+group_id+'"',function(err,rows){


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


app.get('/api/v1/getProductsku',ensureToken,function(req,res){
        jwt.verify(req.token,'molc',function(err,data){
			var product_id = req.query.product_id;

if(err){
 res.send(403);

}else{
        var query = pool.query("SELECT pt.product_name,ps.* FROM product_sku  ps join product_temp pt on (ps.product_id=pt.product_id) where ps.product_id='"+product_id+"'",function(err,rows){

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

}

});



});	



}

// Export the router
module.exports = router;
