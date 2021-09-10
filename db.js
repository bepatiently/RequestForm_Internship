const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const upload = require('express-fileupload')

var sql = require('mssql');


app.use(bodyParser.urlencoded({ extended: false }))

app.use("/lib", express.static('./lib/'));

app.get('/', function(req, res) {
    res.sendFile('Untitled.html', { root: __dirname })
});

var config = {

    user: 'D',
    password: 'D',
    server: '00',
    port: 3000,
    database: 'C',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }

}

async function dbConnect() {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(config)
        console.log("DATABSE CONNECTION INITIATED")
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function closeDatabase() {
    try {
        await sql.close();
        console.log("Database Connection has been closed")
    } catch (err) {
        console.log(err);
        throw err;
    }
}

dbConnect() // Initiate database connection

app.post('/submit', async function(req, res) {
    try {
        console.log("_______________________________________")
        console.log(req.body);
        let fldAppType = ""

        fldAppType = req.body.true;


        let fldReqType = ""
        if (req.body.mobil !== undefined) {
            if (fldReqType === "") {
                fldReqType = fldReqType.concat(req.body.mobil)
            } else {
                fldReqType = fldReqType.concat(",")
                fldReqType = fldReqType.concat(req.body.mobil)
            }
        }
        if (req.body.plc !== undefined) {
            if (fldReqType === "") {
                fldReqType = fldReqType.concat(req.body.plc)
            } else {
                fldReqType = fldReqType.concat(",")
                fldReqType = fldReqType.concat(req.body.plc)
            }
        }
        if (req.body.web !== undefined) {
            if (fldReqType === "") {
                fldReqType = fldReqType.concat(req.body.web)
            } else {
                fldReqType = fldReqType.concat(",")
                fldReqType = fldReqType.concat(req.body.web)
            }
        }
        if (req.body.automata !== undefined) {
            if (fldReqType === "") {
                fldReqType = fldReqType.concat(req.body.automata)
            } else {
                fldReqType = fldReqType.concat(",")
                fldReqType = fldReqType.concat(req.body.automata)
            }
        }
        if (req.body.hmi !== undefined) {
            if (fldReqType === "") {
                fldReqType = fldReqType.concat(req.body.hmi)
            } else {
                fldReqType = fldReqType.concat(",")
                fldReqType = fldReqType.concat(req.body.hmi)
            }
        }
        console.log("_______________________________________")
        var request = new sql.Request();
        var query = "INSERT INTO dbo.tbl(fldRegistrationNo, fldName, fldSurname, fldDepartment, fldAppName, fldAppRequest, fldReqReason, fldReqType, fldAppType, fldExplanation, fldBugs ) VALUES (" + req.body.fldRegistrationNo + ",'" + req.body.fldName + "','" + req.body.fldSurname + "','" + req.body.fldDepartment + "','" + req.body.fldAppName + "','" + req.body.fldAppRequest + "','" + req.body.fldReqReason + "','" + fldReqType + "','" + fldAppType + "','" + req.body.fldExplanation + "','" + req.body.fldBugs + "')"

        try {
            var result = await request.query(query);
        } catch (err) {
            throw err;
        }

        if (req.files) {

            console.log(req.file);
            var file = req.files.file
            var filename = file.name
            console.log(filename);

            file.mv('./istek' + filename, function(err) {

                if (err) {
                    res.send(err)
                } else {
                    res.send("File Uploaded");
                }

            })
        }
        // res.render('Untitled-1', { title: 'data saved', message: 'data saved', data: result })
        res.send(result);

    } catch (err) {
        throw err;
    }
})


app.get("/dbContent", async function(req, res) {
    try {
        // console.log(req.body);
        var query = "SELECT * FROM dbo.tbl"
        var result = await sql.query(query);
        console.log(result);
        // res.render('Untitled-1', { title: 'data saved', message: 'data saved', data: result })
        res.send(result);
    } catch (err) {
        throw err;
    }
});

app.listen(port, () => console.log(`App is listening to port ${port}!`))