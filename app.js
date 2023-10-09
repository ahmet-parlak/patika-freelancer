const express = require('express');
const session = require('express-session');
const monggose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
require('dotenv').config();

const pageRouter = require('./routes/pageRoute');
const projectRouter = require('./routes/projectRoute');

//App
const app = express();

//DB Connection
monggose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(`✔️  MongoDB connection is successful`))
  .catch((err) => console.log(`❌ MongoDB connection is failed\n${err}`));

//Configration
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

//Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'my_keyboar_cat',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(fileUpload());
app.use(methodOverride('_method', ['GET', 'POST']));

//Routes
app.use('/', pageRouter);
app.use('/project', projectRouter);

//Listen
const port = process.env.PORT ?? 5000;
app.listen(port, () => console.log(`🚀 The server running at port ${port}`));
