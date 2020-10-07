const router = require('express').Router();
const passport = require('passport');

// For auth with google:
// route get /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// For google auth callback:
// route get /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => res.redirect('/index'));

// For logout:
// route get /auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;