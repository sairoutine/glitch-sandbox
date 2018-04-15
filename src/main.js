const Veda = require("vedajs").default;
const canvas = document.getElementById('canvas-webgl');
const glslify = require('glslify');
const veda = new Veda({});
const debounce = require('js-util/debounce');

const id = Math.floor(Math.random() * 2) + 1;
const video_path = `./movie/movie${id}.mp4`;
veda.loadTexture('texture', video_path);
veda.setCanvas(canvas);
veda.loadFragmentShader(glslify('./glsl/postEffect.fs'));

const resizeWindow = () => {
	canvas.width = document.body.clientWidth;
	canvas.height = window.innerHeight;
	veda.resize(canvas.width, canvas.height);
}

window.addEventListener('resize', debounce(() => {
	resizeWindow();
}), 1000);

resizeWindow();

veda.play();
