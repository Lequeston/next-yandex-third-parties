const { task, series, parallel, watch, src, dest } = require('gulp');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');
const tsProjectDeclarations = ts.createProject('tsconfig.json', {
  declaration: true,
  emitDeclarationOnly: true,
});

task('clean', async function () {
  const { deleteAsync } = await import('del');
  return deleteAsync(['dist']);
});

task('compile:typescript', function () {
  return tsProject.src().pipe(tsProject()).js.pipe(dest('dist'));
});

task('copy:declarations', function () {
  return tsProjectDeclarations.src().pipe(tsProjectDeclarations()).dts.pipe(dest('dist'));
});

task('copy:assets', function () {
  return src(['src/**/*.json', 'src/**/*.md', 'src/**/*.txt']).pipe(dest('dist'));
});

task('watch:files', function () {
  watch('src/**/*.ts', series('compile:typescript', 'copy:declarations'));
  watch(['src/**/*.json', 'src/**/*.md', 'src/**/*.txt'], task('copy:assets'));
});

task('compile', parallel('compile:typescript', 'copy:declarations', 'copy:assets'));
task('build', series('clean', 'compile'));
task('watch', series('compile', 'watch:files'));

task('default', series('build'));
