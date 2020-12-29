//data routes

const { request } = require('express');
const express = require('express');

const Data = require('./../models/Data');

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({

    //destination for files
    destination: function (req, file, callback) {
        callback(null, './public/uploads/images');
    },

    //add back the extension
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

//upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    }
});



//post create

router.get('/create', (req, res) => {
    res.render('create');
});

router.post('/', upload.single('image'), async (req, res) => {
    // console.log(req.body);
    let data = new Data({
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        description: req.body.description,
        img: req.file.filename,
    });

    try {
        data = await data.save();
        console.log(data.id);
        console.log(data.slug);
        res.redirect('/');
    } catch (error) {
        res.send(error);
    }
});

router.get('/edit/:id', async (req, res) => {

    let data = await Data.findById(req.params.id);
    res.render('edit', { data: data });
})

//routes handle update
router.put('/:id', async (req, res) => {
    req.data = await Data.findById(req.params.id);
    let data = req.data;
    data.name = req.body.name,
        data.price = req.body.price,
        data.amount = req.body.amount,
        data.description = req.body.description

    try {
        data = await data.save();
        console.log(req.body);
        res.redirect(`/data/${data.slug}`);
    } catch (error) {
        res.send(error);
    }
});

//routes delete
router.delete('/:id', async (req, res) => {
    await Data.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

router.get('/search', async (req, res) => {
    var q = req.query.q;

    let Item = await Data.find().sort({ timeCreated: 'desc' })

    var matchItem = Item.filter((item) => {
        return item.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });

    res.render('index', { dataItem: matchItem });
    console.log(req.query);
});


//routes detail
router.get('/:slug', async (req, res) => {
    let data = await Data.findOne({ slug: req.params.slug });

    if (data) {
        res.render('detail', { data: data });
    } else {
        res.redirect('/');
    }
});

module.exports = router;