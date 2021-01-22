const express=require('express');
const bodyparser=require('body-parser');
const request=require('request');
const crypto=require('crypto');
const key='password'
const algo='aes256'
const ejs=require('ejs');
const models=require('./Model/modells.js')
const post=require('./Model/postss.js')
const { urlencoded } = require('body-parser');
const app=express()
app.use(bodyparser.json())
const mongoose=require('mongoose');
const { readdirSync } = require('fs');

//database connection
mongoose.connect('mongodb://localhost:27017',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:'models',
}).then(()=>{
        console.log("connected");
});



const encoder=bodyparser.urlencoded({
    extended:true
});
app.set('view engine','ejs');


//routes
app.get('/',function(req,res){
    
    post.findOne({}).sort('-like').exec((err,user)=>{
        if(err)
        {
            console.log("error")
        }
        else{
            models.find({_id:user.loginid},(err,result)=>{
                if(err){
                    res.send("error occured")
                }
                else{
                    console.log("print"+result)
                    result=result[0];
                    res.render('Home',{user,result});
                }
            })
        }
    })
})
app.get('/Register',encoder,function(req,res){
    res.render('Register');
})
app.post('/Register',encoder,function(req,res){
    var d = new Date();
    console.log(req.body.email);
    var cipher=crypto.createCipher(algo,key);
    var encrypted=cipher.update(req.body.password,'utf8','hex')
    +cipher.final('hex');
    console.log("check 1"+req.body._id);
    Input(req.body,encrypted,d);
    res.redirect('/Login');
})
app.get('/Login',function(req,res){
    
    res.render('Login');
})
app.post('/Login',encoder,function(req,res){
    models.findOne({email:req.body.email}).then((dat)=>{
        console.log("check "+dat)
        const dicipher=crypto.createDecipher(algo,key);
        const decrypt=dicipher.update(dat.password,'hex','utf8')+dicipher.final('utf8');
        console.log("decript" +decrypt)
        if(decrypt==req.body.password)
        {
            console.log("user exist "+dat.Name);
            //your(dat._id,res);
            id=dat._id
            res.render('vofp',{id})
        }
        else{
            res.redirect('/Login');
        }
    })
})
app.get('/adminLogin/:id',function(req,res){
            post.find({},(err,user)=>{
                if(err)
                {
                    console.log("error")
                }
                else{
                    res.render('adminLogin',{user,id:req.params.id})
                }
            })
        }
)
app.get('/adminLogin',function(req,res){
    post.find({},(err,user)=>{
        if(err)
        {
            console.log("error")
        }
        else{
            res.render('adminLogin1',{user})
        }
    })
}
)
app.get('/delete/:id',function(req,res){

    post.findByIdAndDelete({_id:req.params.id},(err,resul)=>{
        if(err)
        {
            console.log("error"+err);
        }
        else{
            models.find({_id:resul.loginid},(err,re)=>{
                if(err){
                    console.log("error in post"+err)
                }
                else{
                    post.find({loginid:resul.loginid},(err,resu)=>{
                        if(err){
                            console.log("error in post"+err)
                        }
                        else{
                            console.log("succes"+resu,re[0])
                            re=re[0]
                            res.render('yourpost',{resu,re})
                        }
                    })
                }
                }
            )
        }
    })
})

app.get('/update/:id',function(req,res){
    c=req.params.id;
    post.findById(c).exec((err,data)=>{
        if(err){
            res.send("error found")
        }
        else{
            console.log("data"+data)
            res.render('updatepost',{data});
        }
    })
})
app.post('/update',encoder,function(req,res){
    console.log("gi"+req.body._id)
    post.findByIdAndUpdate(req.body._id,
        {post:req.body.post}
    ).exec((err,resul)=>{
        if(err){
            console.log("error"+err)
        }
        else{
            models.find({_id:resul.loginid},(err,re)=>{
                if(err){
                    console.log("error in post"+err)
                }
                else{
                    post.find({loginid:resul.loginid},(err,resu)=>{
                        if(err){
                            console.log("error in post"+err)
                        }
                        else{
                            console.log("succes"+resu,re[0])
                            re=re[0]
                            res.render('yourpost',{resu,re})
                        }
                    })
                }
                }
            )
            //res.redirect('yourpost',{resu,});
        }
    })
})
app.get('/like/:id',encoder,function(req,res){
    //console.log(check.email)
    c=req.params.id;
    post.findById(c).exec((err,data)=>{
        if(err){
            res.send("error found")
        }
        else{
            res.render('like',{data});
        }
    })
})
app.post('/like',encoder,function(req,res){
    console.log('like'+req.body.like)
    post.findByIdAndUpdate(req.body._id,{
        like:parseInt(req.body.like)+parseInt('1')
    }).exec((err,result)=>{
        if(err){
            console.log("error"+err)
        }
        else{
            res.redirect('/adminLogin');
        }
    })
})

app.get('/enterpost/:id',function(req,res){
    var dataid=req.params.id
    console.log("checking"+id)
    res.render('enterpost',{id})
})
app.post('/enterpost',encoder,function(req,res){
    const postinfo=new post({
        loginid:req.body.loginid,
        post:req.body.post,
        like:0
    })
    postinfo.save().then((ress)=>{
        console.log("success"+ress);
        res.render('vofp',{id:ress.loginid});
    })
    .catch(err=>console.log(err));
})
app.get('/showpost/:id',function(req,res){
    
    models.find({_id:req.params.id},(err,re)=>{
        if(err){
            console.log("error in post"+err)
        }
        else{
            post.find({loginid:req.params.id},(err,resu)=>{
                if(err){
                    console.log("error in post"+err)
                }
                else{
                    console.log("succes"+resu,re[0])
                    re=re[0]
                    res.render('yourpost',{resu,re})
                }
            })
        }
        }
    )
})
app.get('/vofp/:id',function(req,res){
    res.render('vofp',{id:req.params.id});
})

app.get('/owner/:id',function(req,res){
    models.find({_id:req.params.id},(err,result)=>{
        if(err){
            console.log("error");
        }
        else{
            console.log("owner"+result)
            result=result[0]
            res.render('owner',{result})
        }
    })
    //res.render('owner',{id:req.params.id})
})

app.get('/home1/:id',function(req,res){
    post.findOne({}).sort('-like').exec((err,user)=>{
        if(err)
        {
            console.log("error")
        }
        else{
            models.find({_id:user.loginid},(err,result)=>{
                if(err){
                    res.send("error occured")
                }
                else{
                    result=result[0];
                    result=result.Name;
                    console.log("hihhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"+result.Name)
                    res.render('home1',{user,id:req.params.id,result});
                }
            })
        }
    })
})
app.get('/admin',function(req,res){
    res.render('admin');
})
app.post('/admin',encoder,function(req,res){
    if(req.body.email=="himidis9@gmail.com" && req.body.password=="rsasa")
    {
        res.redirect('/adminLogin')
    }
    else{
        res.redirect('/admin');
    }
})
app.get('/logout',function(req,res){
    res.redirect('/login');
})


app.get('/airpolution',function(req,res){
    res.render('airpoll');
})
app.post('/airpoll',encoder,function(req,res){
    console.log("place "+req.body.place);
    var url3='https://api.waqi.info/feed/'+req.body.place+'/?token=133aa6c3eec1188ac2514f39145822e3e6f21aa8'
        request({url:url3,json:true},(error,geodata)=>{
            if(error)
            {
                res.send("error occured")
            }
            else{
                console.log(JSON.stringify(geodata.body.data.forecast));
            }
        })
    })
function Input(a,encrypted,d){

    const data=new models({
        email:a.email,
        password:encrypted,
        Name:a.Name,
        time:d,
        like:0
    })
    data.save().then(()=>{
        console.log("success");
    })
    .catch(err=>console.log(err));
}


function your(abc,r){
    post.find({loginid:abc},(err,resu)=>{
        if(err){
            console.log("error occured in post"+err)
        }
        else{
            console.log(resu)
            r.render('yourpost',{resu})
        }
    })
}

models.findOne({}).sort('-like').exec((err,user)=>{
    if(err)
    {
        console.log("error")
    }
    else{
        console.log(user)
    }
})
app.listen(5000);
