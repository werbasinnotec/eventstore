'use strict';

const eslint = require('gulp-eslint');
const cover = require('gulp-coverage');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const shell = require('gulp-shell');

const dropTestDB = require('./test/dropDatabase');

const paths = {
  analyze: [ '**/*.js', '!example/**/*.js', '!coverage/**/*.js', '!test/testPattern.js' ],
  tests: [ 'test/**/*Test.js', '!coverage/**/*.js' ]
};

/* eslint-disable no-process-exit */
gulp.task('test', () => {
  dropTestDB((err) => {
    if (err) {
      throw err;
    }
    return gulp.src(paths.tests, { read: false }).
      pipe(mocha({ timeout: 55000 })).
      once('error', function (err2) {
      /* eslint-disable no-console */
      console.log(err2.stack);
      /* eslint-enable no-console*/
      process.exit(1);
      }).
      once('end', function () {
      process.exit();
      });
  });
});

gulp.task('lint', () => {
  return gulp.src(paths.analyze).
		pipe(eslint({
      parserOptions: {
        ecmaVersion: 8
      }
    })).
    pipe(eslint.format()).
    pipe(eslint.failAfterError());
});

/* eslint-disable no-process-env */
gulp.task('coverage', function () {
  process.env.IS_TEST = true;
  process.env.LOG_LEVELS = 'info';

  return gulp.src(paths.tests, { read: false }).
    pipe(mocha({ timeout: 15000 })).
    pipe(cover.gather()).
    pipe(cover.format({ reporter: 'html', outFile: 'coverage.html' }, { reporter: 'json', outFile: 'coverage.json' })).
    pipe(gulp.dest('./coverage')).
    once('end', function () {
      process.exit();
    });
});

/* eslint-enable no-process-env */

gulp.task('default', shell.task([
  'gulp lint && ' +
	'gulp test'
]));
/* eslint-enable no-process-exit */
