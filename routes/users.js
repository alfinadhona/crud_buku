var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

app.get('/',function(req,res){
    //render to views/index.ejs template file
    res.render('./index')
})

//Tampilkan Data
app.get('/tampil', function(req,res,next){
    //mengambil data dari database secara descending
    req.db.collection('buku').find().sort({"_id":-1}).toArray(function(err,result){
       
        if(err){
            req.flash('error', err)
            res.render('user/list',{
                title: 'Daftar Siswa',
                data: ''
            })
    } else {
        //menampilkan views list.ejs
        res.render('user/list',{
            title: 'Daftar Buku',
            data: result
        })
       }
    })
})

//tampilkan form input
app.get('/add', function(req, res, next){
    //tampilkan views add.ejs
    res.render('user/add', {
        title: 'TAMBAH DATA',
        judul: '',
        penulis: '',
        penerbit: '',
        harga: ''
    })
})

//Proses input data
app.post('/add', function(req,res,next){
    req.assert('judul', 'Judul is required').notEmpty()
    req.assert('penulis','Penulis is required').notEmpty()
    req.assert('penerbit', 'Penerbit is required').notEmpty()
    req.assert('harga', 'Harga is numeric').notEmpty()

    var errors = req.validationErrors()

    if(!errors){
        var user = {
            judul: req.sanitize('judul').escape().trim(),
            penulis: req.sanitize('penulis').escape().trim(),
            penerbit: req.sanitize('penerbit').escape().trim(),
            harga: req.sanitize('harga').escape().trim()
        }

        req.db.collection('buku').insert(user, function(err,result){
            if (err){
                req.flash('error', err)

                //render to views/user/add.ejs
                res.render('user/add',{
                    title: 'TAMBAH DATA',
                    judul: user.judul,
                    penulis: user.penulis,
                    penerbit: user.penerbit,
                    harga: user.harga
                })
            } else{
                req.flash('Berhasil', 'Data berhasil ditambah!')

                //redirect to user list page
                res.redirect('/tampil')
            }
        })
    }
    else{ //display errors to user
        var error_msg = ''
        errors.forEach(function(error){
            error_msg += error.msg +'<br>'
        })
        req.flash('error', error_msg)

        res.render('user/add',{
            title: 'TAMBAH DATA',
                    judul: user.judul,
                    penulis: user.penulis,
                    penerbit: user.penerbit,
                    harga: user.harga
        })
    }
})

//show edit user form
app.get('/edit/(:id)', function(req,res,next){
    var o_id = new ObjectId(req.params.id)
    req.db.collection('buku').find({"_id": o_id}).toArray(function(err,result){
        if(err) return console.log(err)

        //jika data tidak ada
        if(!result){
            req.flash('error', 'User not found with id = '+req.params.id)
            res.redirect('/users')
        }
        else{ //jika data ada
        //tampilkan views/user/edit.ejs
            res.render('user/edit',{
                title: 'EDIT DATA',
                //data: rows[0],
                id: result[0]._id,
                judul: result[0].judul,
                penulis: result[0].penulis,
                penerbit: result[0].penerbit,
                harga: result[0].harga
            })
        }
    })
})

//EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next){
    req.assert('judul', 'Judul is required').notEmpty()
    req.assert('penulis','Penulis is required').notEmpty()
    req.assert('penerbit', 'Penerbit is required').notEmpty()
    req.assert('harga', 'Harga is numeric').notEmpty()

    var errors = req.validationErrors()

    if(!errors) {
    
    var user = {
         judul: req.sanitize('judul').escape().trim(),
            penulis: req.sanitize('penulis').escape().trim(),
            penerbit: req.sanitize('penerbit').escape().trim(),
            harga: req.sanitize('harga').escape().trim()
    }

    var o_id = new ObjectId(req.params.id)
    req.db.collection('buku').update({"_id": o_id}, user, function(err, result){
        if (err){
            req.flash('error', err)

            //renser to views/user/edit.ejs
            res.render('user/edit',{
                    title: 'EDIT DATA',
                    id : req.params.id,
                    judul : req.body.judul,
                    penulis : req.body.penulis,
                    penerbit : req.body.penerbit,
                    harga : req.body.harga
                })
        } else {
            req.flash('Berhasil','Data berhasil diupdate')
            res.redirect('/tampil')   
        }
    })
    } else { //Display error to user
        var error_msg = ''
        errors.forEach(function(error){
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        
        res.render('user/edit', {
            title: 'EDIT DATA',
            id : req.params.id,
                    judul : req.body.judul,
                    penulis : req.body.penulis,
                    penerbit : req.body.penerbit,
                    harga : req.body.harga
        })
    }
})

//DELETE USER
app.delete('/delete/(:id)', function(req, res, next){
    var o_id = new ObjectId(req.params.id)
    req.db.collection('buku').remove({"_id":o_id}, function(err, result){
    if(err){
        req.flash('error', err)
        //redirect halaman tampil data
        res.redirect('/users')
    } else {
        req.flash('berhasil', 'Data berhasil dihapus')
        //redirect halaman tampil data
        res.redirect('/tampil')
    }
})
})

module.exports = app
