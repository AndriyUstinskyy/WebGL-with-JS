let scene, camera, renderer ,canvas , cubeTexture , controls , cube;

let balls = [];

const BALL_COUNT = 2;

function createWorld() {

    renderer.setClearColor(0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 300);

    var light = new THREE.DirectionalLight();
    light.position.set(0, 0, 1);
    camera.position.set(25, 40, 50);
    camera.lookAt(scene.position);
    camera.add(light);
    scene.add(camera);

    cubeTexture = new THREE.ImageUtils.loadTexture("textures/homero.gif"  );

    let materials = [
        new THREE.MeshPhongMaterial( {  map: cubeTexture ,opacity: 0.5 , transparent: true ,polygonOffset: true  ,  polygonOffsetUnits: 1 , polygonOffsetFactor: 1  , side : THREE.DoubleSide}),
        new THREE.MeshPhongMaterial( {  map: cubeTexture,opacity: 0.5 , transparent: true ,   polygonOffset: true  , polygonOffsetFactor: 1 ,  polygonOffsetUnits: 1 , side : THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({ map: cubeTexture, opacity:0.5 , transparent: true ,  polygonOffset: true  ,  polygonOffsetUnits: 1 ,  polygonOffsetFactor: 1 ,  side : THREE.DoubleSide}),
        new THREE.MeshPhongMaterial( {  map: cubeTexture , opacity: 0.5 , transparent: true  ,  polygonOffset: true ,  polygonOffsetUnits: 1 ,  polygonOffsetFactor: 1 ,  side : THREE.DoubleSide}),
        new THREE.MeshPhongMaterial( {  map: cubeTexture,opacity: 0.5 ,  transparent: true , polygonOffset: true ,  polygonOffsetUnits: 1 , polygonOffsetFactor: 1 ,  side : THREE.DoubleSide}),
        new THREE.MeshPhongMaterial( { color: 0xB5B1AE, opacity: 0.5 ,  transparent: true ,polygonOffset: true ,  polygonOffsetUnits: 1 , polygonOffsetFactor: 1 ,  side : THREE.DoubleSide})
    ];
    cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), materials);

    scene.add(cube);

    var edgeGeometry = new THREE.EdgesGeometry(cube.geometry);
    cube.add(new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({color: 0xffffff})));


    var geom = new THREE.SphereGeometry(1, 20, 12);
    for (var i = 0; i < BALL_COUNT; i++) {
        var ball = {};
        balls.push(ball);

        ball.obj = new THREE.Mesh(
            geom,
            new THREE.MeshPhongMaterial( {
                color: Math.floor(Math.random() * 0x1000000),
                specular:0x080808,
                shininess: 32
            })
        );

        ball.x = 18*Math.random() - 9;
        ball.y = 18*Math.random() - 9;
        ball.z = 18*Math.random() - 9;
        ball.dx = Math.random() * 6 + 2;
        ball.dy = Math.random() * 6 + 2;
        ball.dz = Math.random() * 6 + 2;
        if (Math.random() < 0.5)
            ball.dx = -ball.dx;
        if (Math.random() < 0.5)
            ball.dy = -ball.dy;
        if (Math.random() < 0.5)
            ball.dz = -ball.dz;

        ball.obj.position.set( ball.x, ball.y, ball.z);
        scene.add(ball.obj);
    }
}
function render() {
    renderer.render(scene, camera);
}

function updateForFrame() {
    var dt = clock.getDelta();
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];

        ball.x += ball.dx * dt;
        ball.y += ball.dy * dt;
        ball.z += ball.dz * dt;

        if (ball.x > 9) {
            ball.x -= 2*(ball.x - 9);
            ball.dx = -Math.abs(ball.dx);
        }
        else if (ball.x < -9) {
            ball.x += 2*(-9 - ball.x);
            ball.dx = Math.abs(ball.dx);
        }
        if (ball.y > 9) {
            ball.y -= 2*(ball.y - 9);
            ball.dy = -Math.abs(ball.dy);
        }
        else if (ball.y < -9) {
            ball.y += 2*(-9 - ball.y);
            ball.dy = Math.abs(ball.dy);
        }
        if (ball.z > 9) {
            ball.z -= 2*(ball.z - 9);
            ball.dz = -Math.abs(ball.dz);
        }
        else if (ball.z < -9) {
            ball.z += 2*(-9 - ball.z);
            ball.dz = Math.abs(ball.dz);
        }
        ball.obj.position.set(ball.x, ball.y, ball.z);
    }
}

var clock;
function keyPressed(e){
    switch(e.key) {
        case 'ArrowUp':
            cube.rotation.x -= 0.05;
            break;
        case 'ArrowDown':
            cube.rotation.x += 0.05;
            break;
        case 'ArrowLeft':
            cube.rotation.y -= 0.05;
            break;
        case 'ArrowRight':
            cube.rotation.y += 0.05;
            break;
        case 'r':
            camera.position.z -= 2;
            break;
        case 'f':
            camera.position.z += 2;
            break;
        case 'q':
            cubeTexture.rotation += 0.01;
            break;
        case 'e':
            cubeTexture.rotation -= 0.01;

    }
    e.preventDefault();
    render();
}
function doFrame() {
    updateForFrame();
    controls.update();
    document.addEventListener('keydown', keyPressed);
    let a = new THREE.Vector2( 0.5,0.5 );
    cubeTexture.center = a;
    cubeTexture.rotation += 0.01;
    cubeTexture.needsUpdate = true;
    //cube.rotation. += 0.01;
    render();

    requestAnimationFrame(doFrame);
}
function doResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {
    try {
        try {
            renderer = new THREE.WebGLRenderer();
        }
        catch (e) {
            document.body.innerHTML="<h3><b>Sorry, WebGL is required but is not available.</b><h3>";
            return;
        }
        canvas = renderer.domElement;
        renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener("resize", doResize, false);
        document.body.appendChild(canvas);
        clock = new THREE.Clock();
        createWorld();
        controls = new THREE.TrackballControls(camera, canvas);
        controls.noPan = true;
        controls.noZoom = true;
        requestAnimationFrame(doFrame);
    }
    catch (e) {
        document.body.innerHTML = "<h3><b>Sorry, an error occurred:<br>" + e + "</b></h3>";
    }
}