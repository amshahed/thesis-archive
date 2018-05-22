'use strict';

var express = require('express');
var bp = require('body-parser');
var fs = require('fs');
var bcrypt = require('bcrypt');
var mongo = require('mongodb').MongoClient;
var oid = require('mongodb').ObjectID;
var multer = require('multer');
var session = require('express-session');
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
app.use(session({ secret: 'bajilobukeshukhermotobetha', resave: false, saveUninitialized: false }));
app.use(express.static(__dirname + '/'));
app.use(bp.urlencoded({ extended: false }));
var port = process.env.PORT || 8080;

//connect to mongo archive database
mongo.connect('mongodb://jesus_christ:jesuschrist@ds117590.mlab.com:17590/archive', function(err, client){
	if (err)	return console.log(err);
	db = client.db('archive');

	//listen to port
	app.listen(port, function(){
		console.log('listening on port '+port);
	})
})

app.get('/', function(req, res){
	if (req.session.user)
		res.redirect('/thesislist');
	else
		res.sendFile(__dirname + '/views/index.html')
})

app.get('/signupstudent', function(req, res){
	res.sendFile(__dirname + '/views/sign_up_student.html');
})

app.get('/signupfaculty', function(req, res){
	res.sendFile(__dirname + '/views/sign_up_faculty.html');
})

app.get('/login', function(req, res){
	res.sendFile(__dirname + '/views/login.html');
})

app.get('/thesislist', function(req, res){
	if (req.session.user=='staffnaimul')
		res.sendFile(__dirname + '/views/thesisliststaff.html');
	else if (req.session.user && !isNaN(Number(req.session.user)))
		res.sendFile(__dirname + '/views/thesisliststudent.html');
	else if (req.session.user)
		res.sendFile(__dirname + '/views/thesislistfaculty.html');
	else
		res.sendFile(__dirname + '/views/unthesislist.html');
})

app.get('/addthesis', function(req, res){
	if (req.session.user=='staffnaimul')	
		res.sendFile(__dirname + '/views/addthesis.html');
	else	
		res.redirect('/');
})

app.get('/showthesis', function(req, res){
	res.sendFile(__dirname + '/views/thesis_details.html');
})

app.get('/profile', function(req, res){
	if (req.session.user && !isNaN(Number(req.session.user)))
		res.sendFile(__dirname + '/views/profilestudent.html');
	else if (req.session.user=='staffnaimul')
		res.sendFile(__dirname + '/views/profilestaff.html');
	else if (req.session.user && isNaN(Number(req.session.user)) && req.session.user!='staffnaimul')
		res.sendFile(__dirname + '/views/profilefaculty.html');
	else if (!req.session.user)
		res.redirect('/');
})

app.get('/stat', function(req, res){
	res.sendFile(__dirname + '/views/chart.html');
})

app.get('/mythesis', function(req, res){
	res.sendFile(__dirname + '/views/mythesis.html');
})

app.get('/editthesis', function(req, res){
	if (req.session.user!=undefined && req.session.user!='staffnaimul')
		res.sendFile(__dirname + '/views/editthesis.html');
	else
		res.redirect('/');
})

app.get('/viewstudent', function(req, res){
	res.sendFile(__dirname + '/views/viewstudent.html');
})

app.get('/viewfaculty', function(req, res){
	res.sendFile(__dirname + '/views/viewfaculty.html');
})

app.get('/search', function(req, res){
	res.sendFile(__dirname + '/views/search.html');
})

app.get('/addcurthesis', function(req, res){
	if (!isNaN(Number(req.session.user)))
		res.sendFile(__dirname + '/views/addcurthesis.html');
	else
		res.redirect('/thesislist');
})

app.get('/mycurthesis', function(req, res){
	if (req.session.user && req.session.user!='staffnaimul' && isNaN(Number(req.session.user)))
		res.sendFile(__dirname + '/views/mycurrentthesis.html');
	else 
		res.redirect('/');
})

app.get('/editcurthesisstudent', function(req, res){
	if (req.session.user && !isNaN(Number(req.session.user)))
		res.sendFile(__dirname + '/views/editcurthesisstudent.html');
	else
		res.redirect('/');
})

app.get('/editcurthesissupervisor', function(req, res){
	if (req.session.user && req.session.user!='staffnaimul' && isNaN(Number(req.session.user)))
		res.sendFile(__dirname + '/views/editcurthesissupervisor.html');
	else
		res.redirect('/');
})

app.get('/issue', function(req, res){
	if (req.session.user=='staffnaimul')
		res.sendFile(__dirname + '/views/issue.html');
	else
		res.redirect('/');
})

app.post('/signuppost', function(req, res){
	var name = req.body.name;
	var id = Number(req.body.id);
	var stat = req.body.stat;
	var cur; if (stat=='yes') cur=true; else cur = false;
	if (cur==true)	var level = Number(req.body.level); else var level = null;
	if (cur==false)	var year = Number(req.body.year); else var year = null;
	var phone = req.body.phone;
	var email = req.body.email;
	var pass = req.body.pass;

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
                        var obj = { _id:id, name:name, current:cur, 
                        	year:year, level:level, phone:phone, email:email, password:pass };
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

app.post('/signupfacultypost', function(req, res){
	var name = req.body.name;
	var rank = req.body.rank;
	var dept = req.body.dept;
	var varsity = req.body.varsity;
	var id = req.body.id;
	var phone = req.body.phone;
	var email = req.body.email;
	var pass = req.body.pass;

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
                        var obj = { _id:id, name:name, designation:rank, department: dept, 
                        	university: varsity, phone:phone, email:email, password:pass };
                        
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

app.post('/loginpost', function(req, res){
    var name = req.body.name;
    var pass = req.body.pass;
    if (isNaN(Number(name))){
    	if (name=='staffnaimul'){
    		db.collection('staff').find({}).toArray(function(err, doc){
    			if (err)	res.send({error: err});
		        else if (doc.length==0)  res.send({error:'nouser'});
		        else {
		            bcrypt.compare(pass, doc[0].password, function(e, ress){
		                if (e)  res.send({error:e});
		                else if (ress==false) res.send({error:'wrongpass'});
		                else if (ress==true) {
		                	req.session.user=name;
		                    res.send(doc[0]);
		                }
		            });
		       	}
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
		                	req.session.user=name;
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
	                	req.session.user=name;
	                    res.send(doc[0]);
	                }
	            });
	       	}
	    });    	
    }
});

app.get('/logout', function(req, res){
	req.session.destroy(function(err){
		if (err)	res.send({error: err});
		else res.redirect('/');
	});
})

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

app.post('/thesislistpost', function(req, res){
	var obj = {abstract:0, isIssued:0, year:0, by:0, 
		pdf:0, keywords:0, location:0, publishInfo:0 };
	if (req.session.user){
		db.collection('theses').find({}).project(obj).toArray(function(err, doc){
			if (err)
				res.send({error: err});
			else {
				res.send(doc);
			}
		})
	}
	else {
		db.collection('theses').find({ 'publishInfo.isPublished' : true }).project(obj).toArray(function(err, doc){
			if (err)
				res.send({error: err});
			else {
				res.send(doc);
			}
		})
	}
})

app.post('/studentthesislistpost', function(req, res){
	var obj = {abstract:0, isIssued:0, year:0, by:0, 
		pdf:0, keywords:0, location:0, publishInfo:0 };
	db.collection('theses').find({}).project(obj).toArray(function(err, doc){
		if (err)
			res.send({error: err});
		else {
			db.collection('students').find({_id:Number(req.session.user)}).toArray(function(err, docu){
				if (err)	res.send({error: err});
				else res.send({ user:docu[0], doc:doc });
			})
		}
	})
})

app.post('/facultythesislistpost', function(req, res){
	var obj = {abstract:0, isIssued:0, year:0, by:0, 
		pdf:0, keywords:0, location:0, publishInfo:0 };
	db.collection('theses').find({}).project(obj).toArray(function(err, doc){
		if (err)
			res.send({error: err});
		else {
			res.send(doc);
		}
	})
})

app.post('/mythesispost', function(req, res){
	var id = req.body.id;
	var obj = {abstract:0, isIssued:0, year:0, by:0, 
		pdf:0, keywords:0, location:0, publishInfo:0 };
	if (isNaN(Number(id))){
		db.collection('theses').find({ supervisor: { $in : [ id ] } }).project(obj).toArray(function(err, doc){
			if (err)
				res.send({error: err});
			else {
				res.send(doc);
			}
		});
	}
	else {
		db.collection('theses').find({ authors: { $in : [ Number(id) ] } }).project(obj).toArray(function(err, doc){
			if (err)
				res.send({error: err});
			else {
				res.send(doc);
			}
		});
	}
});

app.post('/showthesispost', function(req, res){
	var id = req.body.id;
	db.collection('theses').find({_id: oid(id)}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else if (doc.length==0)	res.send({error: 'nomatch'});
		else {
			doc[0].user = req.session.user;
			res.send(doc[0]);
		}
	})
})

app.post('/addthesispost', upload.single('the-file'), function(req, res){
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
	else obj.publishInfo = { isPublished:false, publication:'', date: '' };
	obj.isIssued = false;
	text(__dirname+'/papers/'+req.file.originalname, function (err, pages) {
	  if (err)	res.send({error: err});
	  else {
	  	var abstract = pages[4].split('\n');
	  	abstract.splice(0,1);
	  	abstract.splice(abstract.length-2,2);
	  	obj.abstract = abstract.join(' ');
	  	obj.pdf = req.file.originalname;
		db.collection('theses').insert(obj, function(err, doc){
			if (err)	res.send({error: err});
			else res.send({added:true});
		})
	  }
	})
})

app.get('/getpdf/:id', function(req, res){
	var id = req.params.id;
	db.collection('theses').find({_id:oid(id)}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else res.download(__dirname+'/papers/'+doc[0].pdf);
	})
})

app.post('/editthesispost', function(req, res){
	var id = req.body.id;
	var title = req.body.title;
	var category = req.body.category;
	var keywords = JSON.parse(req.body.keywords);
	var publication = req.body.publication;
	var date = req.body.date;
	var abstract = req.body.abstract;
	var obj = { title, category, keywords, abstract, publishInfo: { isPublished:false, publication: '', date: '' } };
	if (publication!=''){
		obj.publishInfo.isPublished = true;
		obj.publishInfo.publication = publication;
		obj.publishInfo.date = date;
	}
	else {
		obj.publishInfo.isPublished = false;
		obj.publishInfo.publication = '';
		obj.publishInfo.date = '';
	}
	db.collection('theses').update({_id: oid(id)}, { $set: obj }, function(err, doc){
		if (err)	res.send({error: err});
		else res.send({updated: true});
	})
})

app.post('/statpost', function(req, res){
	var arr = [];
	var arrays = {
		category : [],
		publication : [ [ 'Published', 0 ], [ 'Not Published', 0 ] ]
	}
	var obj = {
		title: 0, supervisor: 0, authors: 0,
		year: 0, batch: 0, abstract: 0, pdf: 0,
		keywords: 0, location: 0, isIssued: 0
	};
	db.collection('theses').find({}).project(obj).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else {
			for (var i=0; i<doc.length; i++){
				if (arr.includes(doc[i].category)){
					var idx = arr.indexOf(doc[i].category) + 1;
					arr[idx]++;
				}
				else {
					arr.push(doc[i].category);
					arr.push(1);
				}
				if (doc[i].publishInfo.isPublished==true){
					arrays.publication[0][1]++;
				}
				else
					arrays.publication[1][1]++;
			}
			for (var i=0; i<arr.length; i+=2){
				arrays.category.push([ arr[i], arr[i+1] ]);
			}
			res.send(arrays);
		}
	})
})

app.post('/studentprofilepost', function(req, res){
	var id = Number(req.body.id);
	db.collection('students').find({_id: id}).project({password: 0}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else res.send(doc[0]);
	})
})

app.post('/facultyprofilepost', function(req, res){
	var id = req.body.id;
	db.collection('faculties').find({_id: id}).project({password: 0}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else res.send(doc[0]);
	})
})

app.post('/staffprofilepost', function(req, res){
	var id = req.body.id;
	db.collection('staff').find({_id: id}).project({password: 0}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else res.send(doc[0]);
	})
})

app.post('/editstudentprofilepost', function(req, res){
	var id = Number(req.body.id);
	var name = req.body.name;
	var status = req.body.status;
	var level = Number(req.body.level);
	var year = Number(req.body.year);
	var phone = req.body.phone;
	var email = req.body.email;
	var obj = { name, phone, email };
	if (status=='yes')	{ obj.current=true; obj.level = level; obj.year = ''; }
	else { obj.current=false; obj.year = year; obj.level = ''; }
	db.collection('students').update({_id: id}, { $set: obj }, function(err, doc){
		if (err)	res.send({error: err});
		else res.send({updated: true});
	})
})

app.post('/editfacultyprofilepost', function(req, res){
	var id = req.body.id;
	var name = req.body.name;
	var designation = req.body.designation;
	var university = req.body.university;
	var phone = req.body.phone;
	var email = req.body.email;
	var obj = { name, phone, email, designation, university };
	db.collection('faculties').update({_id: id}, { $set: obj }, function(err, doc){
		if (err)	res.send({error: err});
		else res.send({updated: true});
	})
})

app.post('/editstaffprofilepost', function(req, res){
	var id = req.body.id;
	var name = req.body.name;
	var responsibility = req.body.resp;
	var phone = req.body.phone;
	var email = req.body.email;
	var obj = { name, phone, email, responsibility };
	db.collection('staff').update({_id: id}, { $set: obj }, function(err, doc){
		if (err)	res.send({error: err});
		else res.send({updated: true});
	})
})

app.post('/changestudentpropicpost', upload.single('the-file'), function(req, res){
	var id = Number(req.body.id);
	db.collection('students').update({_id: id}, { $set: { picture: req.file.originalname } }, function(err, doc){
		if (err)	res.send({error: err});
		else res.redirect('/studentprofile');
	})
})

app.post('/changefacultypropicpost', upload.single('the-file'), function(req, res){
	var id = req.body.id;
	db.collection('faculties').update({_id: id}, { $set: { picture: req.file.originalname } }, function(err, doc){
		if (err)	res.send({error: err});
		else res.redirect('/facultyprofile');
	})
})

app.post('/changestaffpropicpost', upload.single('the-file'), function(req, res){
	var id = req.body.id;
	db.collection('staff').update({_id: id}, { $set: { picture: req.file.originalname } }, function(err, doc){
		if (err)	res.send({error: err});
		else res.redirect('/staffprofile');
	})
})

app.post('/searchpost', function(req, res){
	var val = req.body.val;
	val = val.toLowerCase();
	if (req.session.user){
		db.collection('theses').find({}).project({ abstract:0, pdf:0 }).toArray(function(err, doc){
			if (err)	res.send(err);
			else {
				var obj = [];
				for (var i=0; i<doc.length; i++){
					for (var j=0; j<doc[i].keywords.length; j++)
						doc[i].keywords[j] = doc[i].keywords[j].toLowerCase();
					for (var j=0; j<doc[i].authors.length; j+=2){
						if (doc[i].authors[j]==Number(val))
							obj.push(doc[i]);
					}
					if (doc[i].title.toLowerCase().includes(val) && !obj.includes(doc[i]))
						obj.push(doc[i]);
					if (doc[i].supervisor[1].toLowerCase().includes(val)  && !obj.includes(doc[i]))
						obj.push(doc[i]);
					if (doc[i].keywords.includes(val) && !obj.includes(doc[i]))
						obj.push(doc[i]);
					if (doc[i].category.toLowerCase()==val  && !obj.includes(doc[i]))
						obj.push(doc[i]);
					if (doc[i].year==Number(val)  && !obj.includes(doc[i]))
						obj.push(doc[i]);
					if ('cse '+doc[i].batch==val && !obj.includes(doc[i]))
						obj.push(doc[i]);
				}
				res.send(obj);
			}
		})
	}
	else {
		db.collection('theses').find({ 'publishInfo.isPublished' : true }).project({ abstract:0, pdf:0 }).toArray(function(err, doc){
			if (err)	res.send(err);
			else {
				var obj = [];
				for (var i=0; i<doc.length; i++){
					for (var j=0; j<doc[i].keywords.length; j++)
						doc[i].keywords[j] = doc[i].keywords[j].toLowerCase();
					for (var j=0; j<doc[i].authors.length; j+=2){
						if (doc[i].authors[j]==Number(val))
							obj.push(doc[i]);
					}
					if (doc[i].title.toLowerCase().includes(val) && !obj.includes(doc[i]))
						obj.push(doc[i]);
					if (doc[i].supervisor[1].toLowerCase().includes(val)  && !obj.includes(doc[i]))
						obj.push(doc[i]);
					if (doc[i].keywords.includes(val) && !obj.includes(doc[i]))
						obj.push(doc[i]);
					if (doc[i].category.toLowerCase()==val  && !obj.includes(doc[i]))
						obj.push(doc[i]);
					if (doc[i].year==Number(val)  && !obj.includes(doc[i]))
						obj.push(doc[i]);
					if ('cse '+doc[i].batch==val && !obj.includes(doc[i]))
						obj.push(doc[i]);
				}
				res.send(obj);
			}
		})
	}
})

app.post('/searchfieldpost', function(req, res){
	var project = { designation:0, department:0, university:0, phone:0, email:0, password:0 };
	var obj = { faculties: [], categories: [], batches: [] };
	db.collection('faculties').find({}).project(project).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else {
			for (var i=0; i<doc.length; i++){
				obj.faculties.push(doc[i]._id);
				obj.faculties.push(doc[i].name);
			}
			var project = { _id:0, title:0, abstract:0, keywords:0, supervisor:0, authors:0,
							  year:0, pdf:0, location:0, publishInfo:0, isIssued:0 };
			db.collection('theses').find({}).project(project).toArray(function(err, doc){
				if (err)	res.send({error: err});
				else {
					for (var i=0; i<doc.length; i++){
						if (!obj.categories.includes(doc[i].category))
							obj.categories.push(doc[i].category);
						if (!obj.batches.includes(doc[i].batch))
							obj.batches.push(doc[i].batch);
					}
					res.send(obj);
				}
			})
		}
	})
})

app.post('/advancedsearchpost', function(req, res){
	var title = req.body.title;
	var id = Number(req.body.id);
	var name = req.body.name;
	var keyword = req.body.keyword;
	var supervisor = req.body.supervisor;
	var category = req.body.category;
	var batch = Number(req.body.batch);
	var obj= {};
	if (title!='')	obj.title = { $regex: title, $options: 'i' };
	if (id!='')		obj.authors = id;
	if (name!='')	obj.authors = { $regex: name, $options: 'i' };
	if (keyword!='')	obj.keywords = keyword;
	if (supervisor!='')	obj.supervisor = supervisor;
	if (category!='')	obj.category = category;
	if (batch!='')	obj.batch = 15;
	if (!req.session.user)
		obj.publishInfo = { isPublished : false, publication: '', date: '' };
	db.collection('theses').find(obj).project({ abstract:0, pdf:0 }).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else res.send(doc);
	})
})

app.post('/addcurthesispost', function(req, res){
	var title = req.body.title;
	var category = req.body.category;
	var supervisor = JSON.parse(req.body.supervisor);
	var students = JSON.parse(req.body.students);
	db.collection('curthesis').insert({title,category,supervisor,authors:students, updates:[]}, function(err, doc){
		if (err)	res.send({error: err});
		else {
			res.send({added:true});
		}
	})
})

app.post('/mycurthesispost', function(req, res){
	var id = req.session.user;
	db.collection('curthesis').find({ supervisor:id }).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else res.send(doc);
	})
})

app.post('/editcurthesisstudentpost', function(req, res){
	db.collection('curthesis').find({authors:Number(req.session.user)}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else if (doc.length==0)	res.send({error: 'nomatch'});
		else res.send(doc[0]);
	})
})

app.post('/updatecurthesisstudent', function(req, res){
	var id = req.body.id;
	var edit = req.body.edit;
	var author = req.body.name;
	var date = new Date();
	var date = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
	var obj = { author, date, edit, feedback: '' };
	db.collection('curthesis').update({_id:oid(id)}, { $push: { updates: obj } }, function(err, doc){
		if (err)	res.send({error: err});
		else res.send({updated:true});
	})
})

app.post('/editcurthesissupervisorpost', function(req, res){
	var id = req.body.id;
	db.collection('curthesis').find({_id: oid(id)}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else if (doc.length==0)	res.send({error: 'nomatch'});
		else res.send(doc[0]);
	})
})

app.post('/updatecurthesissupervisor', function(req, res){
	var id = req.body.id;
	var feedback = req.body.feedback;
	db.collection('curthesis').find({_id:oid(id)}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else if (doc.length==0)	res.send({error: 'nomatch'});
		else {
			var arr = doc[0].updates;
			arr[arr.length-1].feedback += feedback;
			db.collection('curthesis').update({_id:oid(id)}, { $set: { updates : arr } }, function(err, doc){
				if (err)	res.send({error: err});
				else res.send({updated:true});
			})
		}
	})
})

app.post('/issuepost', function(req, res){
	db.collection('issues').find({}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else res.send(doc);
	})
})

app.post('/addissue', function(req, res){
	var title = req.body.title;
	var student = Number(req.body.student);
	var code = req.body.code;
	var date = req.body.date;
	db.collection('theses').find({'location.code':code}).toArray(function(err, doc){
		if (err)	res.send({error: err});
		else if (doc.length==0)	res.send({error: 'nomatch'});
		else if (doc[0].isIssued==true) res.send({error: 'issued'});
		else {
			db.collection('issues').insert({ code, title, student, date, returned:false, retdate:'' }, function(err, doc){
				if (err)	res.send({error: err});
				else {
					db.collection('theses').update({'location.code':code}, { $set: { isIssued:true } }, function(err, doc){
						if (err)	res.send({error: err});
						else res.send({inserted:true});
					})
				}
			})
		}
	})
})