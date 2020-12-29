const express = require('express');

//bring in mongoose
const mongoose = require('mongoose');

//method-override
const methodOverride = require('method-override');

const Data = require('./models/Data');

const dataRouter = require('./routes/data');

const app = express();

//connect to mongodb
mongoose.connect('mongodb+srv://master:Ducanh1234567890@cluster0.tgcly.mongodb.net/test?authSource=admin&replicaSet=atlas-12b9do-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

//set template engine

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

//route for main page

app.get('/', async (req, res) => {

    let dataItem = await Data.find().sort({timeCreated: 'desc'}) ;

    res.render('index', { dataItem: dataItem});
});


app.use(express.static("public"));
app.use('/data', dataRouter);

app.listen(process.env.PORT || 6969);