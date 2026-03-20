require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const { db, initDatabase } = require('./config/database');
const publicRoutes = require('./routes/public/');
const adminRoutes = require('./routes/admin/');
const Page = require('./models/Page');
const auth = require('./middleware/auth');


//========================= INICJALIZACJA
const app = express();
const PORT = process.env.PORT || 3000;
initDatabase();

//========================= MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

//========================= VIEW TEMPLATE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

//========================= GLOBALNE ZMIENNE DLA WIDOKÓW
app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear();
    res.locals.siteName = 'Złomotron';
    res.locals.publicPages = Page.getAllPublic();
    next();
});

//========================= ROUTES

// Strona główna (MUSI być PRZED publicRoutes!)
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Złomotron - Strona Główna'
    });
});


// POZOSTALE STRONY VVV

app.use('/admin', adminRoutes)
//app.use definiuje sciezke dla /admin i podstron

// Dynamiczne strony (/:slug)
app.use('/', publicRoutes);


// 404 handler (ZAWSZE NA KOŃCU!)
app.use((req, res) => {
    return res.status(404).render('404', {
            title: 'Nie ma takiej strony!!!',
            redirect: 3
        });
});

//========================= START SERWERA
app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na http://localhost:${PORT}`);
    console.log(`Ścieżka bazy danych: ${path.join(__dirname, 'database/site.db')}`);
});
