lowLag.init();
lowLag.load("/sound/yay.mp3");
lowLag.load("/sound/jump.mp3");
lowLag.load("/sound/kick.mp3");
lowLag.load("/sound/clap.mp3");
lowLag.load("/sound/blow.mp3");
lowLag.load("/sound/walk.mp3");

let pre_Sec = 0;

// Scene
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
/*
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.update();

    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );

    if(!mixer || !mixer.time) return;

    const animationTime = mixer.time;
    const frameIndex = Math.floor(animationTime*FRAME_RATE);

  //  if(mixer && mixer.time)
    console.log(frameIndex);
}
animate();*/
let get_model = findGetParameter('model');

switch(parseInt(get_model)) {
    case 1:
        setVOAudio("./sound/vo1.mp3");
        break;
    case 2:
        setVOAudio("./sound/vo2.mp3");
        break;
    case 3:
        setVOAudio("./sound/vo3.mp3");
        break;
    case 4:
        setVOAudio("./sound/vo4.mp3");
        break;
}

function setVOAudio(url) {
    document.getElementById("vo_a").innerHTML =    `<audio autoplay controls>
    <source id="vo_input" src="${url}" type="audio/mpeg">
    </audio>`;
}

let delta = 0;
// 30 fps
let interval = 1 / 240;

function animate() {
  requestAnimationFrame(animate);
  delta += clock.getDelta();

   if (delta  > interval) {
       
        try {
            if(mixer && mixer._actions[0] && mixer._actions[0].time) {
                let currentTime = parseFloat(toFixed(mixer._actions[0].time, 1));

                if(currentTime !== pre_Sec) {

                    switch(parseInt(get_model)) {
                        case 1:
                            if(currentTime === 0.5 || currentTime === 3.6 || currentTime === 7) {
                                lowLag.play("/sound/jump.mp3");
                            }
                            else if(currentTime === 7.5) {
                                lowLag.play("/sound/yay.mp3");
                            }
                            break;
                        case 2:
                            if(currentTime === 2 || currentTime === 3 || currentTime === 4.2 || currentTime === 4.8) {
                                lowLag.play("/sound/kick.mp3");
                            }
                            else if(currentTime === 6) {
                                lowLag.play("/sound/yay.mp3");
                                lowLag.play("/sound/clap.mp3");
                            }
                            break;
                        case 3:
                            if(currentTime === 3.4 || currentTime === 4 || currentTime === 5.2 || currentTime === 5.8 || currentTime === 7) {
                                lowLag.play("/sound/blow.mp3");
                            }
                            else if(currentTime === 7.5) {
                                lowLag.play("/sound/yay.mp3");
                            }
                            break;
                        case 4:
                            if(currentTime === 0) {
                                lowLag.play("/sound/walk.mp3");
                            }
                            break;
                    }

                    //console.log(currentTime);

                }

                pre_Sec = currentTime;
            }
        } catch(err) {

        }

        if ( mixer ) mixer.update( delta );
        renderer.render( scene, camera );
	    controls.update();

       delta = delta % interval;
   }
}
animate();


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
        gltf.animations.forEach((clip) => { mixer.clipAction(clip).play(); });
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
	window.location.href = "/3D-Work/index.html";
}

function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

