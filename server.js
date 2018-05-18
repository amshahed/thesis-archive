'use strict';

var express = require('express');
var bp = require('body-parser');
var fs = require('fs');
var bcrypt = require('bcrypt');
var mongo = require('mongodb').MongoClient;
var oid = require('mongodb').ObjectID;
var multer = require('multer');
var text = require('pdf-text-extract');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'papers/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage });
var app = express();
var db;

//load .env file, creating port
app.use(express.static(__dirname + '/'));
app.use(bp.urlencoded({ extended: false }));
var port = process.env.PORT || 8080;

//connect to mongo archive database
mongo.connect('mongodb://127.0.0.1/', function(err, client){
	if (err)	return console.log(err);
	db = client.db('archive');

	//listen to port
	app.listen(port, function(){
		console.log('listening on port '+port);
	});
});

//render hoome page
app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html')
});

app.get('/signupstudent', function(req, res){
	res.sendFile(__dirname + '/views/sign_up_student.html');
});

app.get('/signupfaculty', function(req, res){
	res.sendFile(__dirname + '/views/sign_up_faculty.html');
});

//render log in page
app.get('/login', function(req, res){
	res.sendFile(__dirname + '/views/login.html');
});

app.get('/thesislist', function(req, res){
	res.sendFile(__dirname + '/views/thesis_list.html');
});

//render page for adding new thesis
app.get('/addthesis', function(req, res){
	res.sendFile(__dirname + '/views/addthesis.html');
});

app.get('/showthesis', function(req, res){
	res.sendFile(__dirname + '/views/thesis_details.html');
});

app.get('/staffprofile', function(req, res){
	res.sendFile(__dirname + '/views/staffprofile.html');
});

app.get('/profile', function(req, res){
	res.sendFile(__dirname + '/views/profile.html');
});	

app.post('/getinfo', function(req, res){
	var id = req.body.id;
	db.collection('theses').find({_id:oid(id)}).toArray(function(err, doc){
		if (err)
			res.send({error: err});
		else if (doc.length==0)
			res.send({error: 'nomatch'});
		else 
			res.send(doc[0]);
	});
});

app.post('/su', function(req, res){
	var name = req.body.name;
	var id = Number(req.body.id);
	var stat = req.body.stat;
	var cur; if (stat=='yes') cur=true; else cur = false;
	if (cur==true)	var level = Number(req.body.level); else var level = null;
	if (cur==false)	var year = Number(req.body.year); else var year = null;
	var phone = req.body.phone;
	var email = req.body.email;
	var pass = req.body.pass;

    //hash password before saving
	bcrypt.hash(pass, 5, function (err, hash){
    	if (err)	res.send({error : 'nohash'});
        else {
            pass = hash;
   			db.collection('students').find({_id:id},{}).toArray(function(er, doc){
                if (er) res.send({error : er});
                else {
                    if (doc.length!=0)
                        res.send({present:true});
                    else {
                        var obj = { _id:id, name:name, current:cur, year:year, level:level, phone:phone, email:email, password:pass };
                        
                        //if doesn't exist, save in db
                        db.collection('students').insert(obj, function(e, docu){
                            if (e)  res.send({error : e});
                            else res.send({ inserted: true });
                        });
                    }
                }
            });
        }
  	});
});

app.post('/suf', function(req, res){
	var name = req.body.name;
	var rank = req.body.rank;
	var dept = req.body.dept;
	var varsity = req.body.varsity;
	var id = req.body.id;
	var phone = req.body.phone;
	var email = req.body.email;
	var pass = req.body.pass;
    //hash password before saving
	bcrypt.hash(pass, 5, function (err, hash){
    	if (err)	res.send({error : 'nohash'});
        else {
            pass = hash;
   			db.collection('faculties').find({_id:id},{}).toArray(function(er, doc){
                if (er) res.send({error : er});
                else {
                    if (doc.length!=0)
                        res.send({present:true});
                    else {
                        var obj = { _id:id, name:name, designation:rank, department: dept, university: varsity, phone:phone, email:email, password:pass };
                        
                        //if doesn't exist, save in db
                        db.collection('faculties').insert(obj, function(e, docu){
                            if (e)  res.send({error : e});
                            else res.send({ inserted: true });
                        });
                    }
                }
            });
        }
  	});
});

//existing user's login
app.post('/li', function(req, res){
    var name = req.body.name;
    var pass = req.body.pass;
    if (isNaN(Number(name))){
    	if (name=='naimul'){
    		db.collection('staff').find({}).toArray(function(err, doc){
    			if (err)	res.send({error: err});
    			else res.send(doc[0]);
    		})
    	}
    	else {
		    db.collection('faculties').find({_id:name},{}).toArray(function(er, doc){
		        if (er) res.send({error:er});
		        else if (doc.length==0)  res.send({error:'nouser'});
		        else {
		            bcrypt.compare(pass, doc[0].password, function(e, ress){
		                if (e)  res.send({error:e});
		                else if (ress==false) res.send({error:'wrongpass'});
		                else if (ress==true) {
		                    res.send(doc[0]);
		                }
		            });
		       	}
		    });     		
    	}
    }
    else {
	    db.collection('students').find({_id:Number(name)},{}).toArray(function(er, doc){
	        if (er) res.send({error:er});
	        else if (doc.length==0)  res.send({error:'nouser'});
	        else {
	            bcrypt.compare(pass, doc[0].password, function(e, ress){
	                if (e)  res.send({error:e});
	                else if (ress==false) res.send({error:'wrongpass'});
	                else if (ress==true) {
	                    res.send(doc[0]);
	                }
	            });
	       	}
	    });    	
    }
});

app.post('/studentcheck', function(req, res){
	var id = Number(req.body.id);
	db.collection('students').find({_id:id}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else if (doc.length==0)	res.send({error: 'nomatch'});
		else res.send(doc[0]);
	})
})

app.post('/supercheck', function(req, res){
	var name = req.body.name;
	db.collection('faculties').find({ name : { $regex: name, $options: 'i' } }).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else if (doc.length==0)	res.send({error: 'nomatch'});
		else res.send(doc[0]);
	})
})

//show thesis list
app.post('/gettheses', function(req, res){
	db.collection('theses').find({}).project({abstract:0, isIssued:0, year:0, by:0, pdf:0, keywords:0, location:0, publishInfo:0 }).toArray(function(err, doc){
		if (err)
			res.send({error: err});
		else {
			res.send(doc);
		}
	});
});

app.post('/theinfo', function(req, res){
	var title = req.body.title;
	var abs = req.body.abs;
	var keys = JSON.parse(req.body.keys);
	var sv = JSON.parse(req.body.sv);
	var students = JSON.parse(req.body.students);
	db.collection('theses').insert({title:title, abstract:abs, keywords:keys, supervisor:sv, students:students}, function(er, doc){
		if (er)
			res.send({error: er});
		else
			res.send({inserted:true});
	});
})

app.post('/thesisinfo', upload.single('the-file'), function(req, res){
	var title = req.body.title;
	var category = req.body.category;
	var keywords = JSON.parse(req.body.keywords);
	var supervisor = JSON.parse(req.body.supervisor);
	var authors = JSON.parse(req.body.students);
	var batch = Number(req.body.batch);
	var year = Number(req.body.year);
	var isPublished = req.body.isPublished;
	var publication = req.body.publication;
	var date = req.body.date;
	var code = req.body.code;
	var shelf = Number(req.body.shelf);
	var row = Number(req.body.row);
	var obj = { title, abstract:'', category, keywords, supervisor, authors, year, batch, pdf:'' };
	obj.location = { code, shelf, row };
	if (isPublished=='yes') obj.publishInfo = { isPublished:true, publication, date };
	else obj.publication = { isPublished:false, publication:'', date: '' };
	obj.isIssued = false;
	text(__dirname+'/papers/'+req.file.originalname, function (err, pages) {
	  if (err)	res.send({error: err});
	  else {
	  	var abstract = pages[4].split('\n');
	  	abstract.splice(0,1);
	  	abstract.splice(abstract.length-2,2);
	  	obj.abstract = abstract.join('');
		db.collection('theses').insert(obj, function(err, doc){
			if (err)	res.send({error: err});
			else res.send({added:true});
		})
	  }
	})
})

app.get('/getpdf/:id', function(req, res){
	var id = req.params.id;
	db.collection('theses').findOne({}).then(function(doc){
		res.download(__dirname+'/papers/'+doc.pdf);
	})
})

app.post('/search', function(req, res){
	var val = req.body.val.toLowerCase();
	db.collection('theses').find({}).toArray(function(err, doc){
		if (err)	res.send(err);
		else {
			var obj = { title: [], supervisor: [], authors: [], keywords: [], category: [], year: [], by: [] };
			for (var i=0; i<doc.length; i++){
				if (doc[i].title.toLowerCase().includes(val))
					obj.title.push(doc[i]);
				if (doc[i].supervisor[1].toLowerCase().includes(val))
					obj.supervisor.push(doc[i]);
				if (doc[i].keywords.toLowerCase().includes(val))
					obj.keywords.push(doc[i]);
				if (doc[i].category.toLowerCase()==val)
					obj.category.push(doc[i]);
				if (doc[i].year==Number(val))
					obj.year.push(doc[i]);
				if (doc[i].by==val)
					obj.by.push(val);
			}
			res.send(obj);
		}
	})
});

app.get('/text', function(req, res){
	text(__dirname+'/papers/paper-kot.pdf', function (err, pages) {
	  if (err)	res.send({err});
	  else res.send(pages);
	})
})

app.get('/chart', function(req, res){
	var arr = [];
	var obj = {
		title: 0, supervisor: 0, authors: 0,
		year: 0, by: 0, abstract: 0, pdf: 0,
		keywords: 0, location: 0,
		publishInfo: 0
	};
	db.collection('theses').find({}).project(obj).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else res.send(doc);
	})
})
