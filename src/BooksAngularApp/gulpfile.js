/// <binding Clean='clean' />

var gulp = require("gulp"),
  rimraf = require("rimraf"),
  concat = require("gulp-concat"),
  cssmin = require("gulp-cssmin"),
  uglify = require("gulp-uglify"),
  project = require("./project.json"),
  fs = require("fs");

eval("var project = " + fs.readFileSync("./project.json"));

var paths = {
  webroot: "./" + project.webroot + "/",


  bower: "./bower_components/",
  lib: "./" + project.webroot + "/lib/",
  app: "./" + project.webroot + "/app/",
  srcapp: "./app/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

gulp.task("clean:js", function(cb) {
  rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {  
  rimraf(paths.concatCssDest, cb);
});

gulp.task("clean:lib", function (cb) {
  rimraf(paths.lib, cb);
});

gulp.task("clean", ["clean:js", "clean:css", "clean:lib"]);

gulp.task("min:js", function() {
  gulp.src([paths.js, "!" + paths.minJs], { base: "." })
    .pipe(concat(paths.concatJsDest))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task("min:css", function() {
  gulp.src([paths.css, "!" + paths.minCss])
    .pipe(concat(paths.concatCssDest))
    .pipe(cssmin())
    .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task("copy", ["clean"], function() {
  var bower = {
    "bootstrap": "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}",
    "bootstrap-touch-carousel": "bootstrap-touch-carousel/dist/**/*.{js,css}",
    "hammer.js": "hammer.js/hammer*.{js,map}",
    "jquery": "jquery/jquery*.{js,map}",
    "jquery-validation": "jquery-validation/jquery.validate.js",
    "jquery-validation-unobtrusive": "jquery-validation-unobtrusive/jquery.validate.unobtrusive.js",
    "angular": "angular/angular*.{js,map}",
    "angular-route": "angular-route/angular-route*.{js,map}",
    "angular-resource": "angular-resource/angular-resource*.{js,map}"
  };
  for (var destinationDir in bower) {
    gulp.src(paths.bower + bower[destinationDir])
      .pipe(gulp.dest(paths.lib + destinationDir));

  }

});

gulp.task("cleanappp", function(cb) {
  rimraf(paths.app, cb);

});

gulp.task("create:lib", function(cb) {
  gulp.src(paths.bower + "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}")
    .pipe(gulp.dest(paths.lib + "bootstrap"));
});


gulp.task("copyapp", ["cleanappp"], function() {
  var app = {
    "controllers": "controllers/booksController.js",
    "services": "services/booksServices*.js",
    "/": "app.js"
  };
  for (var destinationDir in app) {
    gulp.src(paths.srcapp + app[destinationDir])
      .pipe(gulp.dest(paths.app + destinationDir));
  }
});