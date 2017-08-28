//INSTRUCTIONS: 

// 1. fill out the CMS. 
//     NB. Any changes to the folder structure will need to also be reflected in:
//       - the 'gulp deploy' taskrunner.
//       - the 'inject-style-' tag in the HTML.
//       - the embedded 'style' tag in the HTML.
// 2. Put your images in the src/assets/img/ file (or equivalent).
// 3. If you aren't going to put any CSS in the embedded style tag, comment it out or delete it.
//     NB. The folder structure you use will be echoed on the server.
// 4. use the 'cd' terminal command to go to the project folder (in the terminal)
// 5. type 'npm install gulp' into terminal to install gulp (you may need to install node/npm first)
// 6. type 'npm install' into terminal to install the gulp taskrunners in the package.json file
// 7. Type 'gulp' into the terminal (or whenever you want to work on the project).
// 8. DO NOT work in the .css file. DO work in the .scss file, the HTML <head> or inline.
// 9. Make your email, etc...
// 10. Kill the 'gulp' process by typing '[Ctrl] + c' into the terminal.
// 11. (optional) To send off an automatic litmus test, type 'gulp test' into terminal.
// 12. Type 'gulp build' into terminal. In the 'build' folder will be a new, lovely 'index.html' file for you to paste into litmus/mailchimp.


// **==========================================** CMS
var clientName = "Roche",
  projectName = "eCamp_emails_rxukpert00286m";
  jobNumber = "603071"; // for reference only

var path = {
  buildFolder : './build/',
  buildAssets : './build/assets/css/',
  buildIndex : './build/index.html',

  srcAssets : './src/assets/', // NB if you change this, you'll need to change the path manually in 'gulp deploy', and in the 'inject-style' in the HTML
  srcIndex : './src/index.html',
  scssPath : './src/assets/scss/style.scss',
  cssFolder : './src/assets/scss/css',

  ftpPath : '/' + clientName + '_' + jobNumber + '_' + projectName + '/assets/'
}

// var imageUrl = 'http://dev.tbwaworldhealth.london/email_images' + path.ftpPath;
var imageUrl = 'http://www.mfoster.co.uk/html_email/img/';

// **==========================================** end of CMS

var gulp = require('gulp'), // Gulp
  sass = require('gulp-sass'), // compile sass
  styleInject = require("gulp-style-inject"), // puts css file into head
  inline_css = require('gulp-inline-css'), // takes all style tags from ehad and makes inline. NB contains 'sass' and 'replace-path' taskrunners for concurrency
  gls = require('gulp-live-server'), // sets up dev server
  open = require('gulp-open'), // opens project in new browser window
  os = require('os'), // needed for gulp-open
  del = require('del'); // deletes build folder before new one made
  ftp = require( 'vinyl-ftp' ), //uploads to ftp server - succeeds gulp-ftp
  replace = require('gulp-replace-path'), // changes img paths from relative local to server absolute
  gutil = require('gulp-util'), // needed by vinyl-ftp & gulp-ftp
	litmus = require('gulp-litmus'), // uploads built project to litmus, in the 'checklist' section
  notify = require('gulp-notify'), // send me notifications to notification center

// **========================================== gulp commands

gulp.task('default',['sass','gulp-live-server', 'open','sass:watch']); // compiles SASS to CSS, opens page, livereloads, puts images on server, watches for sass updates.
// NB I have removed 'deploy' from the default task for now 
gulp.task('build', ['delete_build_dir','inline_css','replace-path']); // destroys build folder, rebuilds it, sass->css->head->inline, 
gulp.task('test', ['build','litmus']);

// **========================================== gulp live server 

gulp.task('gulp-live-server', function() {
 
  var server = gls.static('src', 8000);
  server.start();
 
  gulp.watch([path.scssPath, path.srcIndex], function (file) {
    server.notify.apply(server, [file]);
  });
});

// **========================================== gulp sass
 
gulp.task('sass', function () {
  sass_func();
});

var sass_func = function() {
  return gulp.src(path.scssPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.cssFolder))
}
 
gulp.task('sass:watch', function () {
  gulp.watch(path.scssPath, ['sass']);
});

// **========================================== moves CSS to head then (all) head CSS to inline

gulp.task('inline_css', function() {  
    sass_func()// this is the sass taskrunner
    
    .on('end', function () { // this is the inliner
      return gulp.src(path.srcIndex)
      
      .pipe(styleInject())
      .pipe(inline_css({ removeHtmlSelectors: true }))
      .pipe(gulp.dest(path.buildFolder))

      .on('end', function () { //this is the 'replace-path' taskrunner (for img URLs)
        replace_path_func()
      }) 
    });
  });
  // **========================================== gulp open

gulp.task('open', function(){
  gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:8000/'}));
});

// **========================================== del 

gulp.task('delete_build_dir', function() {
  del([path.buildFolder]).then(paths => {
  });
})

// **==========================================  gulp ftp

gulp.task( 'deploy', function () {
		replace_path_func();
    // var conn = ftp.create( {
    //     host:     '91.208.99.4',
    //     user:     'emails@dev.tbwaworldhealth.london',
    //     password: 'notAChancePal',
    //     parallel: 10,
    //     log:      gutil.log
    // } );
    // TODO: replace this with own sever details

    var globs = [
        path.srcAssets + 'img/**',
    ];

    var remoteFile = '.' + path.ftpPath;

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance
    return gulp.src( globs, { base: './src/assets/img', buffer: true } ) // this seems to affect the local source
      .pipe( conn.newer( path.ftpPath ) ) // only upload newer files
      .pipe( conn.dest( path.ftpPath ) );
});

// **========================================== gulp replace path

gulp.task('replace-path', function(){
  replace_path_func();
});

var replace_path_func = function() {
	gulp.src([path.buildIndex])
    .pipe(replace('./assets/img/', imageUrl))
    .pipe(gulp.dest(path.buildFolder));
}

// **========================================== gulp litmus

var config_litmus = {
    username: 'darren.howe@tbwa-pw.com',
    password: 'PW@Bank51de',
    url: 'https://tbwa-pw1.litmus.com',
    applications: [
      'appmail9','appmail10',
      'outlookcom','ffoutlookcom','chromeoutlookcom','ol2010','ol2011', 'ol2013','ol2016','windows10mail', //'outlookcom is explorer'
      'iphone6s','iphone6plus','ipad','ipadmini','iphone5s','iphone5sios8',
      'gmailnew','ffgmailnew','chromegmailnew','androidgmailapp','chromegoogleinbox',//'gmailnew' is explorer
      'thunderbirdlatest'
      // unused application names: 
      // 'appmail8','ol2000', 'ol2002', 'ol2003', 'ol2007','ol2015','googleapps','chromegoogleapps','iphone6','notes7','notes8','notes9','chromeyahoo','ffyahoo','yahoo',
    ]
}
 
gulp.task('litmus', function () {
    return gulp.src(path.srcIndex)
        .pipe(litmus(config_litmus))
        // .pipe(gulp.dest(path.buildFolder));
});

// **========================================== gulp logger
gulp.task('logger', function() {
  gutil.log(
    "buildfolder = " + path.buildFolder + 
    ", buildAssets = " +  path.buildAssets + 
    ", buildIndex = " + path.buildIndex +
  ", srcAssets = " + path.srcAssets +
  ", srcIndex = " + path.srcIndex +
  ", scss = " + path.scssPath +
  ", ftpPath = " + path.ftpPath
  );
})

// **========================================== construct build folder (custom)

// gulp.task('build_folders', function() {
//   return gulp.src(path.srcAssets + 'img/') // sets up placeholder folder so building can be done
//     .pipe(gulp.dest(path.buildFolder))
    
//     .on('end', function () { // this is the inliner
//       del([path.buildFolder + 'img/']); // deletes dummy folder, as it has no further use
//   });
// })

// **========================================== gulp notify

// gulp.src("./src/test.ext")
//   .pipe(notify("Hello Gulp!"));

