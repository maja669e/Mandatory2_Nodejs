if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const users = [];

const passport = require('passport');

const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const flash = require('express-flash');
const session = require('express-session');

app.use(express.static("public"));


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

/* Import and use routes */
const adminRouter = require("./routers/admin.js");
const contactRouter = require("./routers/contact.js");
const cvRouter = require("./routers/cv.js");
const dashboardsRouter = require("./routers/dashboards.js");
const projectsRouter = require("./routers/projects.js");

app.use(adminRouter.router);
app.use(contactRouter.router);
app.use(cvRouter.router);
app.use(dashboardsRouter.router);
app.use(projectsRouter.router);


const {
    createPage
} = require("./render.js");
const {
    urlencoded
} = require("express");

/* Ready the pages */
const adminPage = createPage("admin.html");
const contactPage = createPage("./contact/contact.html");
const frontPage = createPage("index.html");
const CVPage = createPage("cv.html");
const dashboardsPage = createPage("dashboards.html");
const projectsPage = createPage("projects.html");



app.get("/", (req, res) => {
    res.send(frontPage);
});

//app.set('view-engine', 'ejs');

app.get("/admin", (req, res) => {
    res.send(adminPage);
});


app.use(express.urlencoded({
    extended: false
}));

app.post('/admin', passport.authenticate('local', {
succesRedirect: '/dashboards',
failureRedirect: '/admin',
failureFlash: true

}));


app.get("/contact", (req, res) => {
    res.send(contactPage);
});


app.post('/', (req, res) => {
    console.log(req.body);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'majabijedic06@gmail.com',
            pass: 'password123!'
        }
    })

    const mailOptions = {
        from: req.body.email,
        to: 'majabijedic06@gmail.com',
        subject: `Message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.send('success');
        }
    })
});

app.get("/cv", (req, res) => {
    res.send(CVPage);
});

app.get("/dashboards", /*checkAuthenticated,*/ (req, res) => {
    res.send(dashboardsPage);
});

app.get("/projects", (req, res) => {
    res.send(projectsPage);
});



function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/admin')
};


const PORT = process.env.PORT || 8080;

app.listen(PORT, (error) => {
    console.log("Server is running on", PORT);
});