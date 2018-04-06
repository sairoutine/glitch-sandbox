
const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');
const normalizeVector2 = require('./normalizeVector2');
const BackgroundImage = require('./BackgroundImage.js');
const PostEffect = require('./PostEffect.js');

const canvas = document.getElementById('canvas-webgl');

const renderer = new THREE.WebGLRenderer({
	antialias: false,
	canvas: canvas,
});

const renderBack1 = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
const scene = new THREE.Scene();
const sceneBack = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const cameraBack = new THREE.PerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 10000);
const clock = new THREE.Clock();

const vectorTouchStart = new THREE.Vector2();
const vectorTouchMove = new THREE.Vector2();
const vectorTouchEnd = new THREE.Vector2();

let isDrag = false;

const bgImg = new BackgroundImage();
const postEffect = new PostEffect(renderBack1.texture);

const resizeWindow = () => {
	canvas.width = document.body.clientWidth;
	canvas.height = window.innerHeight;
	cameraBack.aspect = document.body.clientWidth / window.innerHeight;
	cameraBack.updateProjectionMatrix();
	bgImg.resize();
	postEffect.resize();
	renderBack1.setSize(document.body.clientWidth, window.innerHeight);
	renderer.setSize(document.body.clientWidth, window.innerHeight);
}
const render = () => {
	const time = clock.getDelta();
	renderer.render(sceneBack, cameraBack, renderBack1);
	postEffect.render(time);
	renderer.render(scene, camera);
}
const renderLoop = () => {
	render();
	requestAnimationFrame(renderLoop);
}
const touchStart = (isTouched) => {
	isDrag = true;
};
const touchMove = (isTouched) => {
	if (isDrag) {
		// nothing to do
	}
};
const touchEnd = (isTouched) => {
	isDrag = false;
};
const on = () => {
	window.addEventListener('resize', debounce(() => {
		resizeWindow();
	}), 1000);
	canvas.addEventListener('mousedown', function (event) {
		event.preventDefault();
		vectorTouchStart.set(event.clientX, event.clientY);
		normalizeVector2(vectorTouchStart);
		touchStart(false);
	});
	document.addEventListener('mousemove', function (event) {
		event.preventDefault();
		vectorTouchMove.set(event.clientX, event.clientY);
		normalizeVector2(vectorTouchMove);
		touchMove(false);
	});
	document.addEventListener('mouseup', function (event) {
		event.preventDefault();
		vectorTouchEnd.set(event.clientX, event.clientY);
		normalizeVector2(vectorTouchEnd);
		touchEnd(false);
	});
	canvas.addEventListener('touchstart', function (event) {
		event.preventDefault();
		vectorTouchStart.set(event.touches[0].clientX, event.touches[0].clientY);
		normalizeVector2(vectorTouchStart);
		touchStart(event.touches[0].clientX, event.touches[0].clientY, true);
	});
	canvas.addEventListener('touchmove', function (event) {
		event.preventDefault();
		vectorTouchMove.set(event.touches[0].clientX, event.touches[0].clientY);
		normalizeVector2(vectorTouchMove);
		touchMove(true);
	});
	canvas.addEventListener('touchend', function (event) {
		event.preventDefault();
		vectorTouchEnd.set(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		normalizeVector2(vectorTouchEnd);
		touchEnd(true);
	});
}

const init = () => {
	renderer.setSize(document.body.clientWidth, window.innerHeight);
	renderer.setClearColor(0x555555, 1.0);
	cameraBack.position.set(1000, 1000, 1000);
	cameraBack.lookAt(new THREE.Vector3());

	bgImg.init(() => {
		sceneBack.add(bgImg.obj);
		scene.add(postEffect.obj);
	})

	on();
	resizeWindow();
	renderLoop();
}
init();
