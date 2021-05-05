const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogs');
const authRoutes = require('./routes/auth');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const seedDb = require('./seed');

const PORT = process.env.PORT || 3000;

// Connect to DB
mongoose
  .connect('mongodb://localhost:27017/blogApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB is Connected');
  })
  .catch((err) => {
    console.error('Error: ');
    console.log(err);
  });

// Middlewares (App Level)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname + '/public')));

app.use(
  session({
    secret: 'gangadharheeshaktimanhai',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

// Initialize passport and sessions for storing user's info
app.use(passport.initialize());
app.use(passport.session());

// configuring passport to use local strategy
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

// seedDb();

// Routes
app.use(blogRoutes);
app.use(authRoutes);

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
