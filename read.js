var db = require("./db_config");

db.connect(function(err) {
    if (err) throw err;
    
    let sql = "SELECT * FROM siswa";
    db.query(sql, function (err, result) {
        if (err) throw err;
        // gunakan perulangan untuk menampilkan data
        console.log(`ID \t NAME \t\t ADDRESS \t\t CLASS`);
        console.log(`----------------------------------------------------------`);
        result.forEach(customer => {
            console.log(`${customer.id} \t ${customer.name} \t ${customer.address}`);
        });
    });
});

app.listen('8080', (e)=>{
    console.log(e);
})