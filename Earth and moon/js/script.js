window.onload = function () {
    const width = window.innerWidth ;
    const height = window.innerHeight;
    const cvs = document.getElementById("canvas");
    cvs.setAttribute('width' , width);
    cvs.setAttribute('height' , height);

    const renderer = new THREE.WebGLRenderer({canvas : cvs});
    renderer.setClearColor(0x000000);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45 , width/height , 0.1 , 5000);
    camera.position.set(0 , 0, 1000);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    let geometry = new THREE.SphereGeometry(200 , 40,40 );
    let material = new THREE.MeshBasicMaterial({color : 0x007FFF , wireframe : true});
    const mesh = new THREE.Mesh(geometry , material);

    scene.add(mesh);

    geometry = new THREE.SphereGeometry(40 , 20 ,20 );
    material = new THREE.MeshBasicMaterial({color : 0x5D8AA8 , wireframe : true});
    const mesh2 = new THREE.Mesh(geometry , material);
    const MNposz = 500;
    mesh2.position.z = MNposz;

    const loop1 = mesh.geometry.parameters.radius + 300 +40;
    scene.add(mesh2);



    let v = 10;
    function rebote(){
        if((mesh.position.x +mesh.geometry.parameters.radius *3)  == width)
            v = -10;
        else if((mesh.position.x - mesh.geometry.parameters.radius *3)  == width * -1)
            v = 10;
        mesh.position.x += v;
    }
    let xmove = 1;
    let zmove = 1;
    let ymove = 1;
    function MoonMove(){
        if( mesh2.position.z > 0 && mesh2.position.x == 0 ){
            xmove = 4;
            zmove = -4;
            ymove = 0.7;
        }
        else if(mesh2.position.z == 0 && mesh2.position.x > 0){
            xmove = -4;
            zmove = -4;
            ymove = -0.7;
        }
        else if(mesh2.position.z < 0 && mesh2.position.x == 0){
            zmove = 4;
            xmove = -4;
            ymove = -0.7;
        }
        else if(mesh2.position.x < 0 && mesh2.position.z == 0){
            xmove = 4;
            zmove = 4;
            ymove = 0.7;
        }

        mesh2.position.x += xmove ;
        mesh2.position.z += zmove  ;
        mesh2.position.y += ymove;

    }
    function loop(){
        //rebote();
        mesh.rotation.y += 0.005;
        mesh.rotation.x += 0.0005;
        mesh.rotation.z += 0.005;

        mesh2.rotation.y += 0.005;
        mesh2.rotation.x += 0.0005;
        mesh2.rotation.z += 0.005;
        MoonMove();
        renderer.render(scene ,camera);
        requestAnimationFrame(function(){loop();});
    }
    loop();

};