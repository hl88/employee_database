

// adds necessary modules
var path = require("path");

var dataService = require("./data-service");

var express = require("express");

var multer = require("multer")

var bodyParser = require("body-parser");

var exphbs = require("express-handlebars");

// adds fs module to read files
var fs = require("fs");

var app = express();

// directs server to listen on port 8080
var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// serves static files in a directory named public
app.use(express.static('public'));

// parses application
app.use(bodyParser.urlencoded({ extended: true }))

const storage = multer.diskStorage({

  // sets up destination to /public/images/uploaded
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {

    // sets up file 
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// instructs multer to use the diskStorage function for naming files instead of the default
const upload = multer({ storage: storage });

// instructs server on how to handle HTML files that are formatted using handlebars
app.engine('.hbs', exphbs({

  extname: '.hbs',

  // ensures that when .hbs files are rendered, the result will be placed within the {{{body}}} placeholder of “main” layout
  defaultLayout: 'main',

  helpers: {
    // custom helper function replaces all existing navbar links 
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },

    // custom helper function provides ability to evaluate conditions for equality
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters"); 
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
        return options.fn(this);
      }
    }
  }
}));

// specifies view engine
app.set('view engine', '.hbs');

// adds the property activeRoute to app.locals whenever the route changes
// ensures that navigation bar shows the correct active item
app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, ""); next();
});

// sets up post route to /images/add
app.post("/images/add", upload.single("imageFile"), function (req, res) {

  // redirects to /images 
  res.redirect("/images");
});

// sets up post route to /employees/add
app.post("/employees/add", function (req, res) {

  // calls addEmployee() function passing in req.body 
  dataService.addEmployee(req.body).then(function (value) { res.redirect("/employees") } );
});

// displays data from form in the console when the user clicks "Update Employee"
app.post("/employee/update", (req, res) => { 
  console.log(req.body); 

  // invokes updateEmployee method
  // if promise is resolved, the then() callback executes the res.redirect("/employees") code
  dataService.updateEmployee(req.body).then(function(value) {
    res.redirect("/employees")
  })

  // if promise is rejected, then following message is rendered
  .catch(function(value) {
    res.render("employee", { message: "Invalid employee ID." });
  });
});

// sets up get route to /images
app.get("/images", function (req, res) {

  // reads the directory in /public/images
  fs.readdir(__dirname + "/public/images/uploaded", function (err, items) {

    // renders images
    res.render("images", { "images": items } );

  });
});

// sets up a 'route' to listen on the default url path 
app.get("/", function (req, res) {
  res.render("home");
});

// sets up another route to listen on /about
app.get("/about", function (req, res) {
  res.render("about");
});

// sets up a 'route' to listen on /add employee 
app.get("/employees/add", function (req, res) {
  res.render("addEmployee");
});

// sets up a 'route' to listen on /add image 
app.get("/images/add", function (req, res) {
  res.render("addImage");
});

// sets up new routes via query string
app.get("/employees", (req, res) => {

  // route for status
  if (req.query.status) {

    // calls getEmployeeByStatus function 
    // renders data if promise is resolved
    // if promise is rejected, then message is rendered
    dataService.getEmployeesByStatus(req.query.status).then(function (data) {
      res.render("employees", {employees: data});
    }).catch(function (err) {
      res.render("employees", { message: "no results" });
    });

    // route for department
  } else if (req.query.department) {

    // calls getEmployeeByDepartment function 
    // renders data if promise is resolved
    // if promise is rejected, then message is rendered
    dataService.getEmployeesByDepartment(req.query.department).then(function (data) {
      res.render("employees", {employees: data});
    }).catch(function (err) {
      res.render("employees", { message: "no results" });
    });

    // route for manager
  } else if (req.query.manager) {

    // calls getEmployeeByManager function 
    // renders data if promise is resolved
    // if promise is rejected, then message is rendered
    dataService.getEmployeesByManager(req.query.manager).then(function (data) {
      res.render("employees", {employees: data});
    }).catch(function (err) {
      res.render("employees", { message: "no results" });
    });

    // all other routes
  } else {

    // calls getAllEmployees function 
    // renders data if promise is resolved
    // if promise is rejected, then message is rendered
    dataService.getAllEmployees().then(function (data) {
      res.render("employees", {employees: data});
    }).catch(function (err) {
      res.render("employees", { message: "no results" });
    });
  }
});

// route for employee value
app.get("/employee/:value", function (req, res) {

  // calls getEmployeeByNum function 
  // renders data if promise is resolved
  // if promise is rejected, then message is rendered
  dataService.getEmployeeByNum(req.params.value).then(function (data) {
    res.render("employee", { employee: data });
  }).catch(function (err) {
    res.render("employee", {message:"no results"});
  });
});

// adds contents of departments.json to departmentData variable
app.get("/departments", function (req, res) {

  dataService.getDepartments().then(function (data) {

    // returns data for departments
    res.render("departments", {departments: data});

    // catches error
  }).catch(function (err) {

    // outputs error
    res.render("departments",{message:"no results"});
  });
});

// outputs 404 staturs error
app.get("*", function (req, res) {
  res.status(404).send("Page Not Found");
});

// calls initialze() which returns a promise
dataService.initialize().then(function () {

  // setup http server to listen on HTTP_PORT
  app.listen(HTTP_PORT, onHttpStart);

  // catches errors and outputs the error message to console
}).catch(function (err) {
  console.log(err);
});

