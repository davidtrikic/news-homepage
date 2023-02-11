const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const consolidate = require('gulp-consolidate');
const iconfont = require('gulp-iconfont');
const postcss = require('gulp-postcss');
const gulpStylelint = require('@ronilaukkarinen/gulp-stylelint');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();


//scss to css task
gulp.task('scss', ()=> {
	return gulp.src('src/scss/main.scss')
		.pipe(sass())
		.pipe(postcss([autoprefixer('last 2 versions')]))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

//scss lint task
gulp.task('scss-lint', ()=> {
	return gulp.src('src/scss/**/*.scss')
		.pipe(gulpStylelint({
		reporters: [
			{
				formatter: 'string',
				console: true
			}
		]
	}));
});


//iconfont task
gulp.task('iconfont', ()=> {
	return gulp.src('src/svg/*.svg')
		.pipe(iconfont({
			fontName: 'iconfont',
			formats: ['ttf', 'eot', 'woff', 'woff2'],
			appendCodepoints: true,
			appendUnicode: false,
			normalize: true,
			fontHeight: 1000,
			centerHorizontally: true
		}))
		.on('glyphs', function (glyphs, options) {
			gulp.src('src/iconfont-template/iconfont.scss')
				.pipe(consolidate('underscore', {
					glyphs: glyphs,
					fontName: options.fontName,
					fontDate: new Date().getTime()
				}))
				.pipe(gulp.dest('src/scss/icon-font'));
		})
		.pipe(gulp.dest('src/fonts'));
});

// copy js files to dist
gulp.task('copy-js', ()=> {
	return gulp.src('src/js/*.js')
		.pipe(gulp.dest('dist/js'));
});

// copy html files to dist
gulp.task('copy-html', ()=> {
	return gulp.src('*.{html,ico}')
		.pipe(gulp.dest('dist'));
});

// copy font files to dist
gulp.task('copy-fonts', ()=> {
	return gulp.src('src/fonts/*.{ttf,woff,woff2,eof}')
		.pipe(gulp.dest('dist/fonts'));
});

// copy images files to dist
gulp.task('copy-images', ()=> {
	return gulp.src('images/*')
		.pipe(gulp.dest('dist/images'));
});

// browser sync task
gulp.task('watch', ()=> {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
	gulp.watch('src/**/*.scss', gulp.series('scss-lint', 'scss'));
	gulp.watch("*.html").on('change', browserSync.reload);
	gulp.watch("src/**/*.js").on('change', browserSync.reload);
});

//build project
gulp.task('project-build', gulp.series('iconfont', 'copy-fonts', 'scss-lint', 'scss', 'copy-js', 'copy-html', 'copy-images'));

//to run watch task type: gulp
gulp.task('default', gulp.series('watch'));

