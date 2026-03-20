const express = require('express');

function authMiddleware(req, res, next) {
    if (req.session && req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}
module.exports = authMiddleware;