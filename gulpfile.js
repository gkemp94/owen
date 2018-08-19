var gulp = require("gulp");
var size = require('gulp-size');
// gulp plugins and utils
var gutil = require("gulp-util");
var livereload = require("gulp-livereload");
var postcss = require("gulp-postcss");
var sourcemaps = require("gulp-sourcemaps");
var zip = require("gulp-zip");

// postcss plugins
var autoprefixer = require("autoprefixer");
var colorFunction = require("postcss-color-function");
var cssnano = require("cssnano");
var customProperties = require("postcss-custom-properties");
var easyimport = require("postcss-easy-import");

// sass plugins
var sass = require("gulp-sass");

var swallowError = function swallowError(error) {
  gutil.log(error.toString());
  gutil.beep();
  this.emit("end");
};

var nodemonServerInit = function() {
  livereload.listen(1234);
};

gulp.task("build", ["sass"], function(/* cb */) {
  return nodemonServerInit();
});

gulp.task("sass", function() {
  var processors = [
    easyimport,
    customProperties,
    colorFunction(),
    autoprefixer({ browsers: ["last 2 versions"] }),
    cssnano()
  ];

  return gulp
    .src("assets/sass/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest("assets/css"));
});

gulp.task("watch", function() {
  gulp.watch("assets/sass/*.scss", ["sass"]);
});

gulp.task("default", ["build"], function() {
  gulp.start("watch");
});

gulp.task("zip", ['sass'], function() {
  var targetDir = "./";
  var themeName = require("./package.json").name;
  var version = require("./package.json").version;
  var fileName = themeName + "-" + version + ".zip";

  return gulp
    .src(["./**/**.{hbs,css,js,json}", "!./node_modules/**", "!./dist/**","!./gulpfile.js"])
    .pipe(size())
    .pipe(zip(fileName))
    .pipe(gulp.dest(targetDir));
});
