'use strict';

Physijs.scripts.worker = '/js/physijs_worker.js';


var camera, scene, renderer, startTime, object;
var container, stats;
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	container.appendChild( info );


	camera = new THREE.PerspectiveCamera(
			90, window.innerWidth / window.innerHeight, 0.25, 1000 );
	camera.position.set( 11.441660950109432,31.978614483870004,6.166577442586645 );
	scene = new THREE.Scene();
	// Lights
	scene.add( new THREE.AmbientLight( 0x505050 ) );
	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.angle = Math.PI / 5;
	spotLight.penumbra = 0.2;
	spotLight.position.set( 11.441660950109432,31.978614483870004,6.166577442586645 );
	spotLight.castShadow = true;
	spotLight.shadow.camera.near = 3;
	spotLight.shadow.camera.far = 10;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	scene.add( spotLight );
	var dirLight = new THREE.DirectionalLight( 0x55505a, 1 );
	dirLight.position.set( 0, 3, 0 );
	dirLight.castShadow = true;
	dirLight.shadow.camera.near = 1;
	dirLight.shadow.camera.far = 10;
	dirLight.shadow.camera.right = 1;
	dirLight.shadow.camera.left = - 1;
	dirLight.shadow.camera.top	= 1;
	dirLight.shadow.camera.bottom = - 1;
	dirLight.shadow.mapSize.width = 1024;
	dirLight.shadow.mapSize.height = 1024;
	scene.add( dirLight );

	// Geometry
	var material = new THREE.MeshPhongMaterial( {
			color: 0x80ee10,
			shininess: 100,
			side: THREE.DoubleSide,
			clipShadows: true
		} ),
	geometry = new THREE.CylinderGeometry( 10, 10, 1, 60 );

	object = new THREE.Mesh( geometry, material );
	object.position.set(0,10,0);
	object.castShadow = true;
	scene.add( object );

	var ground = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 ),
			new THREE.MeshPhongMaterial( {
				color: 0xa0adaf, shininess: 150 } ) );
	ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
	ground.receiveShadow = true;
	scene.add( ground );
	// Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	window.addEventListener( 'resize', onWindowResize, false );
	document.body.appendChild( renderer.domElement );
	

	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 1, 0 );
	controls.update();
	stats = new Stats();
				container.appendChild( stats.dom );
	// Start
	startTime = Date.now();
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	var currentTime = Date.now(),
		time = ( currentTime - startTime ) / 1000;
	stats.update();
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
init();
animate();