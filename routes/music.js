const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const path = require('path');
const { Music, validate } = require('../models/music');



router.post('/', auth, async (req, res) => {
    if (!req.files) return res.status(400).send('coverImage is not allow to be empty.')

    let { title, artist, coverImage } = req.body;
    const img = req.files.coverImage;
    coverImage = Date.now() + '_' + Math.round(Math.random() * 1E9) + path.extname(img.name);

    const { error } = validate({ ...req.body, coverImage });
    if (error) return res.status(400).send(error.details[0].message);
    const music = new Music({ title, artist, coverImage });

    try {
        // save image to local storage. in real life image save to remote server like aws s3, digital ocean space..
        img.mv('uploads/' + coverImage);

        await music.save();
        res.send(music)
    } catch (ex) {
        res.status(400).send(ex.message);
    }

    res.send(error);
});

router.get('/', async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    try {

        const [{ totalCount: [{ count }], items }] = await Music.aggregate([{
            "$facet": {
                "totalCount": [
                    { "$count": 'count' },
                ],
                "items": [
                    { "$sort": { 'createdAt': - 1 } },
                    { "$skip": skip },
                    { "$limit": limit }
                ]
            }
        }]);

        res.send({ count, items })
    } catch (ex) {
        res.status(400).send(ex.message)
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const music = await Music.findById(id);
        res.send(music);

    } catch (ex) {
        res.status(400).send(ex.message)
    }

});


router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    if (!req.files) return res.status(400).send('coverImage is not allow to be empty.')
    const img = req.files.coverImage;
    let { title, artist, coverImage } = req.body;

    try {

        const oldMusic = await Music.findById(id);
        if (!oldMusic) return res.status('No record found with the given id.')
        coverImage = oldMusic.coverImage;


        const { error } = validate({ ...req.body, coverImage });
        if (error) return res.status(400).send(error.details[0].message);

        img.mv('uploads/' + coverImage);

        const music = await Music.findByIdAndUpdate(id, {
            $set: { title, artist, coverImage }
        }, { new: true })
        res.send(music)
    } catch (ex) {
        res.status(400).send(ex.message);
    }

    res.send(error);
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const music = await Music.findByIdAndDelete(id);

    if (!music) return res.status(400).send('No document found with the id or it has been deleted.');

    res.send(music)
});



module.exports = router;