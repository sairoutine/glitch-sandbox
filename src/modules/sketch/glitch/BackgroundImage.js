const THREE = require('three/build/three.js');
const glslify = require('glslify');

export default class BackgroundImage {
  constructor() {
    this.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(document.body.clientWidth, window.innerHeight),
      },
      imageResolution: {
        type: 'v2',
        value: new THREE.Vector2(2048, 1356),
      },
      texture: {
        type: 't',
        value: null,
      },
    };
    this.obj = null;
  }
  init(callback) {
    //video要素とそれをキャプチャするcanvas要素を生成
    const video = document.createElement('video');
	const id = Math.floor(Math.random() * 2) + 1;
    video.src = `./movie/movie${id}.mp4`;
    video.loop = true;
    video.load();
    video.oncanplaythrough = () =>{
      video.play();
	  var videoTexture = new THREE.VideoTexture( video );
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.needsUpdate = true;

	  this.uniforms.texture.value = videoTexture;
      this.obj = this.createObj();
      callback();
	}
	  /*
    const loader = new THREE.TextureLoader();
    loader.load(
      '/image/tsugu.jpg',
      (tex) => {
      this.uniforms.texture.value = tex;
      this.obj = this.createObj();
      callback();
    })
	*/
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../glsl/sketch/glitch/backgroundImage.vs'),
        fragmentShader: glslify('../../../glsl/sketch/glitch/backgroundImage.fs'),
      })
    );
  }
  resize() {
    this.uniforms.resolution.value.set(document.body.clientWidth, window.innerHeight);
  }
}
