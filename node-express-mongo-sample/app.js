var express = require('express')
var bodyParser = require('body-parser')
var path = require('path');
var expressValidator = require('express-validator')
var mongojs = require('mongojs')
var db = mongojs('mongodb://eric:yoltoorshul777@ds117251.mlab.com:17251/foods', ['foods'])
var ObjectId = mongojs.ObjectId

var app = express()

// View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('port', (process.env.PORT || 8080))
// Body Parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Set static path
app.use(express.static(path.join(__dirname, 'public')))

// Global Vars
app.use(function(req, res, next) {
    res.locals.errors = null
    next()
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}))

// SetUp Routes
app.get('/', function (req, res) {
    db.foods.find(function (err, docs) {
	    res.render('index', {
        title: 'Foods',
        foods: docs
        })
    })
})

app.post('/foods/add', function (req, res) {

    req.checkBody('name', 'Name is Required').notEmpty()
    req.checkBody('category', 'Last Name is Required').notEmpty()
    req.checkBody('servingSize', 'Serving Size is Required').notEmpty()
    req.checkBody('caloriesPerServingSize', 'calories is Required').notEmpty()
    req.checkBody('meal', 'meal is Required').notEmpty()

    var errors = req.validationErrors()

    if (errors) {
        db.foods.find(function (err, docs) {
            res.render('index', {
                title: 'Foods',
                foods: docs,
                errors: errors
            })
        })
    }
	else{
        var food = {
            name: req.body.name,
            category: req.body.category,
            servingSize: req.body.servingSize,
            caloriesPerServingSize: req.body.caloriesPerServingSize,
            meal: req.body.meal
        }
        
        // insert the new food into the database
        db.foods.insert(food, function (err, result) {
            if (err) {
                console.log(err)
            }
            res.redirect('/')
        })
    }
})


app.delete('/foods/delete/:id', function(req, res) {
    db.foods.remove( { _id: ObjectId(req.params.id) }, function (err, result) {
        if (err) {
            console.log(err)
			console.log("There was an error")
        }
		console.log("Delete function called")
        res.redirect('/')
		
    })
})
app.get('/foods/update/:id', function (req, res) {
    db.foods.find( { _id: ObjectId(req.params.id) }, function (err, docs) {
	    res.render('update-foods', {
        food: docs[0]
        })
    })
})

app.put('/foods/update', function (req, res) {
    var food = {
        "_id": ObjectId(req.body.id),
        "name": req.body.name,
        "category": req.body.category,
        "servingSize": req.body.servingSize,
        "caloriesForServingSize": req.body.caloriesForServingSize,
        "meal": req.body.meal
    }
    db.foods.save(food, function (err, result) {
        if (err) {
            console.log(err)
        }
        res.redirect('/')
    })
})
app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'))
})