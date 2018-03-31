'use strict';
const canvas = document.getElementById('canvas-webgl');

const on = () => {
canvas.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});
canvas.addEventListener('selectstart', function (event) {
  event.preventDefault();
});
}


require('./init/glitch.js')();
