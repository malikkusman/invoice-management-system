const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const path = require('path');

// Routes
const invoiceRoutes = require('./routes/invoices.js');
const clientRoutes = require('./routes/clients.js');
const userRoutes = require('./routes/userRoutes.js');
const profile = require('./routes/profile.js');
const pdfTemplate = require('./documents/index.js');
const emailTemplate = require('./documents/email.js');

dotenv.config();

// Initialize express app
const app = express();
const PORT = 5000;
const DB_URL = "mongodb+srv://42khan0:Z4f0m2f5NWNwbfO0@mymongodb.8qowb.mongodb.net/?retryWrites=true&w=majority&appName=mymongodb";
if (!DB_URL) {
    console.error('DB_URL is not defined. Set the environment variable.');
    process.exit(1); // Exit if the DB URL is not provided
}

// Middleware
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// Routes
app.use('/invoices', invoiceRoutes);
app.use('/clients', clientRoutes);
app.use('/users', userRoutes);
app.use('/profiles', profile);

// // Nodemailer Transport Setup
// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

// // PDF creation options
// const options = { format: 'A4' };

// // Send PDF Invoice via email
// app.post('/send-pdf', (req, res) => {
//     const { email, company } = req.body;

//     pdf.create(pdfTemplate(req.body), options).toFile('invoice.pdf', (err) => {
//         if (err) return res.status(500).send('Failed to create PDF');

//         // Send the email with the PDF attachment
//         transporter.sendMail({
//             from: `Accountill <hello@accountill.com>`,
//             to: email,
//             replyTo: company.email,
//             subject: `Invoice from ${company.businessName || company.name}`,
//             text: `Invoice from ${company.businessName || company.name}`,
//             html: emailTemplate(req.body),
//             attachments: [{
//                 filename: 'invoice.pdf',
//                 path: path.join(__dirname, 'invoice.pdf')
//             }]
//         }, (mailErr) => {
//             if (mailErr) return res.status(500).send('Failed to send email.');
//             res.status(200).send('Email sent successfully!');
//         });
//     });
// });

// Create and send PDF invoice
app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
        if (err) return res.status(500).send('Failed to create PDF');
        res.status(200).send('PDF created successfully.');
    });
});

// Fetch the generated PDF
app.get('/fetch-pdf', (req, res) => {
    res.sendFile(path.join(__dirname, 'invoice.pdf'));
});

// Root route for server status
app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING');
});

// MongoDB connection and server start
mongoose.connect(DB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1); // Exit if MongoDB connection fails
    });

// Export for Vercel serverless function
module.exports = app;
