const scene = new THREE.Scene();

scene.background = new THREE.Color( 0x808080 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new THREE.OrbitControls( camera, renderer.domElement );
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

var mixer;
var clock = new THREE.Clock();

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(30, 20, 0);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(-30, 20, 0);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(0, 20, 30);
scene.add(light3);

const light4 = new THREE.DirectionalLight(0xffffff, 1);
light4.position.set(0, 20, -30);
scene.add(light4);

const loader = new THREE.GLTFLoader();
		
let campos = findGetParameter('campos').split(',');
camera.position.set( parseInt(campos[0]), parseInt(campos[1]), parseInt(campos[2]) );


controls.update();
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.update();

    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
}
animate();

let get_model = findGetParameter('model');
let modelPath = "";

const modelPaths = {
	"1": 'models/gltf/1_yok.gltf',
	"2": 'models/gltf/2_paokob.gltf',
    "3": 'models/gltf/3_takkow.gltf',
    "4": 'models/gltf/4_katongtak.gltf'
}

loader.load(modelPaths[get_model],
	// called when the resource is loaded
	function ( gltf ) {

		document.getElementById('loverlay').style.display = "none";
	
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => { console.log(clip); mixer.clipAction(clip).play(); });
        gltf.scene.children.forEach(c => { c.frustumCulled = false; c.renderOrder=1;})

        gltf.scene.traverse(( object ) => {
            object.frustumCulled = false;      
        } );

        gltf.scene.frustumCulled = false;
        scene.add(gltf.scene);

		animate();
	},
	function ( xhr ) {	
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);
	
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function back() {
	window.location.href = "/";
}