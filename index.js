const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const path = require('path');  // Use 'path' for __filename and __dirname

// Use path to get __filename and __dirname
const filename = __filename;
const dirname = path.dirname(filename);

const invoiceRoutes = require('./routes/invoices.js');
const clientRoutes = require('./routes/clients.js');
const userRoutes = require('./routes/userRoutes.js');
const profile = require('./routes/profile.js');
const pdfTemplate = require('./documents/index.js');
const emailTemplate = require('./documents/email.js');

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/invoices', invoiceRoutes);
app.use('/clients', clientRoutes);
app.use('/users', userRoutes);
app.use('/profiles', profile);

// NODEMAILER TRANSPORT FOR SENDING INVOICE VIA EMAIL
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

var options = { format: 'A4' };

// SEND PDF INVOICE VIA EMAIL
app.post('/send-pdf', (req, res) => {
    const { email, company } = req.body;

    pdf.create(pdfTemplate(req.body), options).toFile('invoice.pdf', (err) => {
        if (err) {
            res.send(Promise.reject());
        }

        // send mail with defined transport object
        transporter.sendMail({
            from: ` Accountill <hello@accountill.com>`, // sender address
            to: `${email}`, // list of receivers
            replyTo: `${company.email}`,
            subject: `Invoice from ${company.businessName ? company.businessName : company.name}`, // Subject line
            text: `Invoice from ${company.businessName ? company.businessName : company.name }`, // plain text body
            html: emailTemplate(req.body), // html body
            attachments: [{
                filename: 'invoice.pdf',
                path: `${dirname}/invoice.pdf`
            }]
        });

        res.send(Promise.resolve());
    });
});

// CREATE AND SEND PDF INVOICE
app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
        if (err) {
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    });
});

// SEND PDF INVOICE
app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/invoice.pdf`);
});

app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING');
});

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;


mongoose.connect(DB_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));


