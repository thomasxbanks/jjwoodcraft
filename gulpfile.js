// REQUIRE PACKAGES
// For Gulp
let gulp = require('gulp');
let runSequence = require('run-sequence');
let clean = require('gulp-clean');
let browserSync = require('browser-sync').create();
let strip = require('gulp-strip-comments');
let stripDebug = require('gulp-config-strip-debug');
let sourcemaps = require('gulp-sourcemaps');
let noop = require('gulp-noop');
let nodemon = require('gulp-nodemon');

// For Css
let sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var cssAlpha = require('postcss-sorting');

// For Js
let babel = require('gulp-babel');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');

// For Images
let imagemin = require('gulp-imagemin');

// For php
let htmlmin = require('gulp-htmlmin');

// Define I/O paths
let root = './';
let src = 'src/';
let dist = '../wp-content/themes/jjwoodcraft/';

let path = {
  css: {
    i: `${root + src}scss/**/*.scss`,
    o: `${root + dist}css/`,
  },
  js: {
    i: `${root + src}js/**/*.js`,
    o: `${root + dist}js/`,
  },
  img: {
    i: `${root + src}img/**/*`,
    o: `${root + dist}img/`,
  },
  php: {
    i: `${root + src}**/*.php`,
    o: `${root + dist}`,
  },
  templates: {
    i: `${root + src}templates/**/*.*`,
    o: `${root + dist}templates/`,
  },
  static: {
    i: `${root + src}static/**/*`,
    o: `${root + dist}static/`,
  },
  wordpress: {
    i: `${root + src}style.css`,
    o: `${root + dist}`,
  },
};

// Define options
let envProd = false;

let plugins = [];

let sassOptions = {
  errLogToConsole: !envProd,
  outputStyle: 'expanded',
};

let cssNanoOptions = {
  autoprefixer: true,
  discardComments: {
    removeAll: true,
  },
};

// TASKS
gulp.task('default', function(callback) {
  plugins = [cssAlpha()];
  runSequence('clean', 'php', 'css', 'js', 'img', 'templates', 'static', 'wordpress', callback);
});

// Watching for changes
gulp.task('watch', function(callback) {
  browserSync.init({
    proxy: 'http://localhost:8008',
    files: ['dist/**/*.*'],
    port: 1337,
  });
  const tasks = ['js', 'css', 'php', 'img', 'templates', 'static', 'wordpress'];
  tasks.forEach((task) => {
    gulp.watch(path[task].i, [task, browserSync.reload]);
  });
});

// Bundle everything up ready for dropping onto the server
// Destroy comments, remove console.log, remove comments, minify without sourcemaps - the works!
gulp.task('production', function(callback) {
  envProd = true;
  console.log('production build started');
  sassOptions.outputStyle = 'compressed';
  plugins = [cssnano(cssNanoOptions), cssAlpha()];
  runSequence('clean', 'css', 'js', 'img', 'php', 'templates', 'static', 'wordpress', () => {
    console.log('production build finished');
  });
});

// Delete the distribution folder
gulp.task('clean', function() {
  return gulp.src('./dist', { read: false }).pipe(clean());
});

// php files
gulp.task('php', function() {
  gulp
    .src([path.php.i])
    .pipe(envProd ? htmlmin({ collapseWhitespace: true }) : noop())
    .pipe(gulp.dest(path.php.o));
});

// EJS templates
gulp.task('templates', function() {
  gulp
    .src([path.templates.i])
    .pipe(envProd ? htmlmin({ collapseWhitespace: true }) : noop())
    .pipe(gulp.dest(path.templates.o));
});

// Images
gulp.task('img', function() {
  gulp
    .src([path.img.i])
    .pipe(envProd ? imagemin({ progressive: true }) : noop())
    .pipe(gulp.dest(path.img.o));
});

// Scss
gulp.task('css', function() {
  return gulp
    .src(path.css.i)
    .pipe(envProd ? noop() : sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(envProd ? noop() : sourcemaps.write())
    .pipe(postcss(plugins))
    .pipe(gulp.dest(path.css.o));
});

// Javascript
gulp.task('js', function() {
  gulp
    .src(path.js.i)
    .pipe(envProd ? noop() : sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(babel())
    .pipe(envProd ? uglify() : noop())
    .pipe(envProd ? stripDebug() : noop())
    .pipe(envProd ? strip() : noop())
    .pipe(envProd ? noop() : sourcemaps.write('.'))
    .pipe(gulp.dest(path.js.o));
});

// static
gulp.task('static', function() {
  gulp
    .src(path.static.i)
    .pipe(envProd ? stripDebug() : noop())
    .pipe(envProd ? strip() : noop())
    .pipe(gulp.dest(path.static.o));
});

// wordpress files
gulp.task('wordpress', function() {
  gulp.src([path.wordpress.i]).pipe(gulp.dest(path.wordpress.o));
});
