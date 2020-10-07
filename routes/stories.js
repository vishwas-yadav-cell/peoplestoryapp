const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

// show add page:
// route get /stories/add
router.get('/add', (req, res) => {
    res.render('stories/add', { image: req.user.image, displayName: req.user.displayName });
});

// adding stories:
// route post /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
})

// get all the public stories:
// router get /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();
        res.render('stories/index', { stories, image: req.user.image, displayName: req.user.displayName });
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
})

// update stories:
// router get /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean();
        console.log(story);
        if (!story) {
            return res.render('error/404');
        }

        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', { story, image: req.user.image, displayName: req.user.displayName });
        }

    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
})

// update story:
// route put /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {

    try {
        let story = await Story.findById(req.params.id).lean();
        if (!story) {
            return res.render('error/404');
        }

        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            });
            res.redirect('/dashboard');
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500');
    }
});

// DELETE story:
// route delete -> /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById({ _id: req.params.id });

        if (!story) {
            res.render('error/404');
        }
        if (story.user != req.user.id) {
            res.redirect('/dashboard');
        }
        else {
            await Story.findByIdAndDelete(req.params.id);
            res.redirect('/dashboard');
        }

    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
})

module.exports = router;