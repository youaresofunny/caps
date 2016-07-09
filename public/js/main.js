
'use strict';


var camera, scene, renderer, startTime, object, loader;
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
	spotLight.translateY(10);
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
			color: 0xEEEEEE,
			shininess: 100,
			side: THREE.DoubleSide,
			clipShadows: true
		} );
	
	var coin_sides_geo = new THREE.CylinderGeometry( 10.0, 10.0, 1.0, 100.0, 10.0, true );
	var coin_cap_geo = new THREE.Geometry();
	var r = 10.0;
	for (var i=0; i<100; i++) {
	  var a = i * 1/100 * Math.PI * 2;
	  var z = Math.sin(a);
	  var x = Math.cos(a);

	  var a1 = (i+1) * 1/100 * Math.PI * 2;
	  var z1 = Math.sin(a1);
	  var x1 = Math.cos(a1);
	  coin_cap_geo.vertices.push(
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(x*r, 0, z*r),
	    new THREE.Vector3(x1*r, 0, z1*r)
	  );
	  coin_cap_geo.faceVertexUvs[0].push([
	    new THREE.Vector2(0.5, 0.5),
	    new THREE.Vector2(x/2+0.5, z/2+0.5),
	    new THREE.Vector2(x1/2+0.5, z1/2+0.5)
	  ]);
	  coin_cap_geo.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2));
	}
	coin_cap_geo.computeBoundingSphere();
	coin_cap_geo.computeFaceNormals();

	loader = new THREE.TextureLoader();
	var coin_top_mat = new THREE.MeshLambertMaterial({ map: loader.load( 'images/cap.png' ) });
	var coin_bot_mat = new THREE.MeshLambertMaterial({ map: loader.load( 'images/front.png' ) });

	var coin_sides_mat = material;
	var coin_sides =
	  new THREE.Mesh( coin_sides_geo, coin_sides_mat );

	var coin_cap_top = new THREE.Mesh( coin_cap_geo, coin_top_mat );
	var coin_cap_bottom = new THREE.Mesh( coin_cap_geo, coin_bot_mat );
	coin_cap_top.position.y = 0.5;
	coin_cap_bottom.position.y = -0.5;
	coin_cap_top.rotation.x = Math.PI;

	var coin = new THREE.Object3D();
	coin.add(coin_sides);
	coin.add(coin_cap_top);
	coin.add(coin_cap_bottom);
	coin.translateY(20);
	coin.rotateX(Math.PI / 4)



	scene.add( coin );

	var ground = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 ),
			new THREE.MeshPhongMaterial( {
				color: 0xa0adaf, shininess: 150 } ) );
	ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
	ground.receiveShadow = true;
	scene.add( ground );
	// Renderer
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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