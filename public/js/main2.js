var container, stats;
var camera, scene, renderer;
var group;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	container.appendChild( info );
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 150, 500 );
	scene.add( camera );
	var light = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( light );
	group = new THREE.Group();
	group.position.y = 50;
	scene.add( group );



	// Arc circle
	var arcShape = new THREE.Shape();
	arcShape.moveTo( 50, 10 );
	arcShape.absarc( 10, 10, 40, 0, Math.PI*2, false );

	var loader = new THREE.TextureLoader();
	var texture = loader.load( "textures/UV_Grid_Sm.jpg" );
	var texture2 = loader.load( "textures/UV_Grid_Sm.jpg" );
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 0.008, 0.008 );

	texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
	texture2.repeat.set( 0.028, 0.058 );


	var extrudeSettings = {curveSegments: 40, amount: 4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

	addShape( arcShape,      extrudeSettings, 0xffffff,  0,  70, 0, 0, 0, 0, 1 );


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	stats = new Stats();
	container.appendChild( stats.dom );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

	

	function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
		var geometry = new THREE.ShapeGeometry( shape );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } ) );
		mesh.position.set( x, y, z - 69 );
		mesh.rotation.set( rx, ry, rz );
		mesh.scale.set( s, s, s );
		group.add( mesh );

		var geometry = new THREE.ShapeGeometry( shape );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture2 } ) );
		mesh.position.set( x, y, z - 77 );
		mesh.rotation.set( rx, ry, rz );
		mesh.scale.set( s, s, s );
		group.add( mesh );

		// extruded shape
		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
		mesh.position.set( x, y, z - 75 );
		mesh.rotation.set( rx, ry, rz );
		mesh.scale.set( s, s, s );
		group.add( mesh );
	}
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseDown( event ) {
	event.preventDefault();
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );
	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}
function onDocumentMouseUp( event ) {
	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentMouseOut( event ) {
	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentTouchStart( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
	}
}
function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
	}
}
function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}
function render() {
	group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
	renderer.render( scene, camera );
}