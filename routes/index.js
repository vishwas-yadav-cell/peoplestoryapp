const router = require('express').Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Story = require('../models/Story');

// login
// route get /
router.get('/', ensureGuest, (req, res) => {
    res.render('Login', { layout: 'login' });
});

// dashboard
// route get /dashboard
router.get('/dashboard', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({user:req.user}).lean();
            return res.render('dashboard',{firstName: req.user.firstName,stories,image: req.user.image,displayName:req.user.displayName});
    } catch (err) {
        res.render('error/500');
    }
});

module.exports = router;