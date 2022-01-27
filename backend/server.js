const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const jwtSecret = "parassaxenasaxenaparas"
const PORT = 8899;
const mongoose = require('mongoose');
const multer = require("multer");
const path = require('path');
const db = "mongodb://localhost:27017/invoice";
const app = express();
const nodemailer = require('nodemailer')
app.use(express.static('../invoice/public/images/'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors());
// function to connect with database
const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true });
        console.log('mongobd connected');
    }
    catch (err) {
        console.log(err.message)
    }
}
//function to store profile
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../invoice/public/images/')
    },
    filename: (req, file, cb) => {
        const filename = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, filename)
    }
})
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            req.fileValidationError = "Forbidden extension"
            cb(null, false, req.fileValidationError);
        }
    }
});
var uploadpdf = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            req.fileValidationError = "Forbidden extension"
            cb(null, false, req.fileValidationError);
        }
    }
});
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'nstcoders@gmail.com',
        pass: 'nstcoders1234'
    }
});
// middleware for function verification
function autenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token)
    if (token == null) {
        res.json({ "err": 1, "msg": "First Login" })
    }
    else {
        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                res.json({ "err": 1, "msg": "Don't Try to Hack" })
            }
            else {
                next();
            }
        })
    }
}
//api call for registration
const logModel = require('./db/loger');
app.post('/api/adduser', (req, res) => {
    // console.log(req.body)
    let ins = new logModel({ name: req.body.name, cname: req.body.cname, email: req.body.email, phone: req.body.phone, pass: req.body.pass, address: req.body.address, logo: "" });
    ins.save((err) => {
        if (err) { res.send("Email Already Exist") }
        else { res.send('User Registered') }
    })
})
//api call for login
app.post('/api/getuser', (req, res) => {
    logModel.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
            res.json({ "err": true, "msg": "Email or password is not correct" })
        }
        else if (data == null) {
            res.json({ "err": true, "msg": "Enter Registered Email" })
        }
        else {
            // console.log(data)
            if (req.body.pass != data.pass) {
                res.json({ "err": true, "msg": "Password Not match" })
            }
            else {
                let payload = {
                    name: data.name,
                    cname: data.cname,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    logo: data.logo
                }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
                res.json({ "err": false, "msg": "Login Success", "token": token })
            }

        }
    })

})
const invoiceModel = require('./db/invoice');
//api call for add invoice
app.post('/api/addinvoice', (req, res) => {
    // console.log(req.body)
    let ins = new invoiceModel(req.body);
    ins.save((err) => {
        if (err) { console.log(err); res.send("something went Wrong") }
        else { res.send('Invoice added') }
    })
})
//api call for fetch records
app.get('/api/getinvoice/:id', autenticateToken, (req, res) => {
    let id = req.params.id;
    // console.log(id)
    invoiceModel.find({ email: id }, (err, data) => {
        res.send(data)
    })

})
//api call for update records
app.put('/api/updaterecords', async (req, res) => {
    let id = req.body._id
    // console.log(id)
    let up = await invoiceModel.findOneAndUpdate({ _id: id }, { status: "PAID" })
    up.save();
    res.send('done')
})
// api call for update profile
app.post('/api/image/:email', upload.single('file'), async (req, res) => {
    let imagePath = '/images/' + req.file.filename;
    let up = await logModel.findOneAndUpdate({ email: req.params.email }, { logo: imagePath, cname: req.body.cname, address: req.body.cadd })
    up.save();
})
// api call for dashboard
app.get('/api/getdash/:email', autenticateToken, async (req, res) => {
    let a = { totalamount: 0, totalinvoice: 0, paidamount: 0, paidinvoice: 0, unpaidamount: 0, unpaidinvoice: 0 };
    invoiceModel.find({ email: req.params.email }, (err, data) => {
        data.map((val => {
            a.totalamount += val.total
            a.totalinvoice += 1;
            if (val.status == 'UNPAID') {
                a.unpaidamount += val.total;
                a.unpaidinvoice += 1;
            }
            // console.log(a.totalamount)
        }))
        a = { ...a, paidamount: a.totalamount - a.unpaidamount, paidinvoice: a.totalinvoice - a.unpaidinvoice };
        res.json(a);
    })

})
//sending mail
app.post("/api/mail/:email", uploadpdf.single('file'), (req, res) => {
    if (req.fileValidationError) {
        res.send({ error: 'type invalid' })
    }
    else {
        console.log(req.file.destination);
        let pdfpath = req.file.destination + req.file.filename;
        var mailOption = {
            from: "parasravi123@gmail.com",
            to: req.params.email,
            //to:"parassaxena206@gmail.com"
            subject: 'attachment',
            html: `<b>welcome</b>`,
            attachments: [
                { path: pdfpath }
            ]
        };
        setTimeout(() => {
            transporter.sendMail(mailOption)

        }, 2000);
    }
})
connectDB();
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`work on ${PORT}`)
})