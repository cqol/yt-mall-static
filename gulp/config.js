var app = './app';
var tmp = './.tmp';
var dist = './dist';

module.exports = {
	dir: {
		app: app,
		tmp: tmp,
		dist: dist
	},
	connect: {
		htmlDir: app + '/htmls',
		staticDir: tmp,
		fixtures: './fixtures'
	},
	copy: {
		javaPro: '../yt-mall',
		javaProDir: '../yt-mall/server/src/main/webapp',
		javavmDir:'../yt-mall/server/src/main/webapp/WEB-INF/aview',
		staticPro: '~/yt-mall-static',
	},
	velocity: {
		src: app + '/htmls',
		htmlDir: tmp + '/htmls',
		root: './app/htmls',
		encoding: 'utf-8',
		//global macro defined file
		macro: 'src/vm/tpl/global-macro/macro.vm',
		globalMacroPath: 'src/vm/tpl/global-macro',
		// test data root path
		dataPath: './fixtures'
	},
	jshint: {
		src: app + '/scripts/**/*.js',
		jshintrc: '.jshintrc'
	},
	styles: {
		src: [app + '/styles/*.scss', app + '/styles/*/*.scss'],
		watchSrc: app + '/styles/**',
		dest: tmp + '/styles',
		settings: {
			imagePath: '/images' // Used by the image-url helper
		}
	},
	fonts: {
		src: app + '/styles/font/**',
		dest: tmp + '/font',
	},
	images: {
		src: app + '/images/**',
		dest: tmp + '/images'
	},
	htmls: {
		src: app + '/htmls/**',
		dest: tmp
	},
	browserify: {
		baseDir: app + '/scripts/',
		// Support multiple glob pattern
		src: [app + '/scripts/*.js', app + '/scripts/*/*.js'],
		dest: tmp + '/scripts',
		extensions: ['.hbs', '.jsx', '.dot']
	},
	sprites: {
		src: './app/images/sprites/',
		imagesDest: './app/images/generated/',
		stylesDest: './app/styles/generated/',
		imgUrlRoot: '/images/generated/'
	},
	watch: {
		styles: 'app/styles/**',
		images: 'app/images/**',
		htmls: 'app/htmls/**',
		sprites: 'app/images/sprites/**',
		files: [
			'.tmp/**',
			'fixtures/**'
		]
	},
	production: {
		cdn: '${gulpPath}',
		htmlSrc: app + '/htmls/**/*.vm',
		imgSrc: app + '/images/**',
		cssSrc: tmp + '/styles/**/*.css',
		jsSrc: tmp + '/scripts/**/*.js',
		fontSrc: tmp + '/font/*',
		fontDest: dist + '/static/font',
		htmlDest: dist + '/htmls',
		refScripts: dist + '/htmls/scripts/**/*',
		refScriptsDir: dist + '/htmls/scripts',
		staticDest: dist + '/static',
		imgDest: dist + '/static/images',
		cssDest: dist + '/static/styles',
		jsDest: dist + '/static/scripts',
		dest: dist
	},
	ssh: {
		test: {
			sshConfig: {
				host: '120.26.80.217',
				port: 22,
				username: 'root',
				password: 'Weixinmall001'
			},
			path: '/home/www/yt-mall/',
			dist: dist + '/',
			folders: ['htmls', 'static']
		},
		deploy: {
			sshConfig: {
				host: '',
				port: 58022,
				username: '',
				password: ''
			},
			path: '',
			dist: dist + '/',
			folders: ['static']
		}
	}
};
