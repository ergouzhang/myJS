//THREEJS RELATED VARIABLES 
var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane, cameraControls,box,
    gobalLight, shadowLight, backLight,
    renderer,
    container,
    controls,
    colliderSystem,box1,box2,
    colliders;


//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH, windowHalfX, windowHalfY,
    mousePos = { x: 0, y: 0 },
    oldMousePos = { x: 0, y: 0 },
    ballWallDepth = 28;
let moveForward = false

//3D OBJECTS VARIABLES

var hero;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = 1;
    farPlane = 2000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.x = 0;
    camera.position.z = 300;
    camera.position.y = 250;
    camera.lookAt(scene.position)
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMapEnabled = true;
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    hero = new THREE.Mesh(geometry, material);
    scene.add(hero);    

    var geometry2 = new THREE.BoxGeometry(10, 10, 10);
    geometry2.computeBoundingBox()
    var material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    box = new THREE.Mesh(geometry2, material2);
    scene.add(box);
    box.position.x = 50   
    
    box1 = new THREE.Box3().setFromObject(hero);
    box2 = new THREE.Box3().setFromObject(box);


    // CONTROLS
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.copy(hero.position)
    cameraControls.enablePan = false
    window.addEventListener('resize', handleWindowResize, false);
    document.addEventListener('keydown', onKeyDown, false)
}


function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}


function onKeyDown (event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = true;
            break;
        case 37: // left
        case 65: // a
            moveLeft = true; break;
        case 40: // down
        case 83: // s
            moveBackward = true;
            break;
        case 39: // right
        case 68: // d
            moveRight = true;
            break;
        case 32: // space
            if (canJump === true) velocity.y += 350;
            canJump = false;
            break;
    }
};
function onKeyUp (event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = false;
            break;
        case 37: // left
        case 65: // a
            moveLeft = false;
            break;
        case 40: // down
        case 83: // s
            moveBackward = false;
            break;
        case 39: // right
        case 68: // d
            moveRight = false;
            break;
    }
};

function createLights() {
    globalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    shadowLight.position.set(200, 200, 200);
    shadowLight.castShadow = true;
    shadowLight.shadowDarkness = .2;
    shadowLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;

    backLight = new THREE.DirectionalLight(0xffffff, .4);
    backLight.position.set(-100, 100, 100);
    backLight.castShadow = true;
    backLight.shadowDarkness = .1;
    backLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;

    scene.add(globalLight);
    scene.add(shadowLight);
    scene.add(backLight);
}

function createFloor() {
    floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), new THREE.MeshBasicMaterial({ color: 0x6ecccc }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
}


function loop() {
    if (moveForward) {
        moveForward = false;
        hero.position.x +=10;
        camera.position.x +=10
        cameraControls.target.copy(hero.position)

        box1.setFromObject(hero)        

        if (box2 && box1.intersectsBox(box2)) {
            box2 = null
            hero.scale.x +=2
            scene.remove(box)

        }
    }
    render();
    requestAnimationFrame(loop);
}


function render() {
    renderer.render(scene, camera);
}

window.addEventListener('load', init, false);

function init(event) {
    initScreenAnd3D();
    createLights();
    createFloor();
    loop();
}

