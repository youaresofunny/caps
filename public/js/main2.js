'use strict';

Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = '/js/ammo.js';

var initScene, render, createShape, loader,createCap,
	renderer, render_stats, physics_stats, scene, light, ground, ground_material, camera;
	var shape,material;

initScene = function() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.setClearColor( 0xffffff, 0);
	document.body.appendChild( renderer.domElement );
	
	render_stats = new Stats();
	render_stats.domElement.style.position = 'absolute';
	render_stats.domElement.style.top = '0px';
	render_stats.domElement.style.zIndex = 100;
	document.body.appendChild( render_stats.domElement );
	
	physics_stats = new Stats();
	physics_stats.domElement.style.position = 'absolute';
	physics_stats.domElement.style.top = '50px';
	physics_stats.domElement.style.zIndex = 100;
	document.body.appendChild( physics_stats.domElement );
	
	scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
	scene.setGravity(new THREE.Vector3( 0, -98, 0 ));
	scene.addEventListener(
		'update',
		function() {
			scene.simulate( undefined, 2 );
			physics_stats.update();
		}
	);
	
	camera = new THREE.PerspectiveCamera(
		35,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.set( 202.766905338907,173.18437131185414,108.13566913502217);
	camera.lookAt( scene.position );
	scene.add( camera );

	var light = new THREE.PointLight( 0xffffff, 0.5 );
	camera.add( light );
	
	// Light
	light = new THREE.DirectionalLight( 0xFFFFFF );
	light.position.set( 20, 40, -15 );
	light.target.position.copy( scene.position );
	light.castShadow = true;
	light.shadow.camera.left = -60;
	light.shadow.camera.top = -60;
	light.shadow.camera.right = 60;
	light.shadow.camera.bottom = 60;
	light.shadow.camera.near = 20;
	light.shadow.camera.far = 200;
	light.shadow.bias = -.0001
	light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
	scene.add( light );
	// Loader
	loader = new THREE.TextureLoader();
	
	// Materials
	ground_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: loader.load( 'images/rocks.jpg' ) }),
		.2, // high friction
		.6 // low restitution
	);
	ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
	ground_material.map.repeat.set( 2.5, 2.5 );
	
	// Ground
	ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(150, 1, 150),
		//new THREE.PlaneGeometry(50, 50),
		ground_material,
		0 // mass
	);
	ground.receiveShadow = true;
	scene.add( ground );


	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 1, 0 );
	controls.update();
	for (var i = 0; i<5; i++){
		createCap();
	}
	render();
};

createCap = function() {
	var cylinder_geometry = new THREE.CylinderGeometry( 10, 10, 1, 100 );
	material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ opacity: 1, transparent: false }),
			.8, // medium friction
			.0 // medium restitution
		); 
	shape = new Physijs.CylinderMesh(cylinder_geometry, material,0.3);
	shape.material.color.setRGB( Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100 );
	shape.castShadow = true;
	shape.receiveShadow = true;


	shape.setLinearVelocity(new THREE.Vector3(300, 300, 0));
    shape.setAngularVelocity(new THREE.Vector3(0, 0, 0));
	
	shape.position.set(
		Math.random() * 30 - 15,
		Math.random() * 100 + Math.random() * 50,
		Math.random() * 30 - 15
	);
	
	shape.rotation.set(
		Math.random() * Math.PI,
		Math.random() * Math.PI,
		Math.random() * Math.PI
	);
	scene.add( shape );
};

render = function() {
	requestAnimationFrame( render );
	scene.simulate();
	renderer.render( scene, camera );
	render_stats.update();
};

window.onload = initScene;