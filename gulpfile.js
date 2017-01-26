var gulp = require('gulp');
var conventionalChangelog = require('gulp-conventional-changelog');
var jsdoc = require("gulp-jsdoc");
var git = require('gulp-git');
var args = require('yargs').argv;

gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('document', ['changelog'], function () {
  return gulp.src("./src/MiniMat.js")
  .pipe(jsdoc('./docs'))
});

gulp.task('commit', ['document'], function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit(args.m));
});
