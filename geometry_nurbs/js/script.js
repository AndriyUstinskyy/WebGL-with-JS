let container, stats, camera, scene, renderer, group;

let targetRotation = 0, targetRotationOnMouseDown = 0, mouseX = 0, mouseXOnMouseDown = 0;

let windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 0, 150, 750 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x808080 );

    scene.add( new THREE.AmbientLight( 0x808080 ) );

    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    group = new THREE.Group();
    group.position.y = 50;
    scene.add( group );

    // NURBS curve

    var nurbsControlPoints = [];
    var nurbsKnots = [];
    var nurbsDegree = 3;

    for ( var i = 0; i <= nurbsDegree; i ++ ) {

        nurbsKnots.push( 0 );

    }

    for ( var i = 0, j = 14; i < j; i ++ ) {

        nurbsControlPoints.push(
            new THREE.Vector4(
                Math.random() * 400 - 200,
                Math.random() * 400,
                Math.random() * 400 - 200,
                1
            )
        );

        var knot = ( i + 1 ) / ( j - nurbsDegree );
        nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

    }
    var texture = new THREE.TextureLoader().load( 'textures/homero.gif' );

    var nurbsCurve = new THREE.NURBSCurve( nurbsDegree, nurbsKnots, nurbsControlPoints );

    var nurbsGeometry = new THREE.BufferGeometry();
    nurbsGeometry.setFromPoints( nurbsCurve.getPoints( 200 ) );

    var nurbsMaterial = new THREE.LineBasicMaterial( {color : 0x30D5C8  , width : 3 } );

    var nurbsLine = new THREE.Line( nurbsGeometry, nurbsMaterial );
    nurbsLine.position.set( 400, - 100, 0 );

    group.add( nurbsLine );

    var nurbsControlPointsGeometry = new THREE.BufferGeometry();
    nurbsControlPointsGeometry.setFromPoints( nurbsCurve.controlPoints );

    var nurbsControlPointsMaterial = new THREE.LineBasicMaterial( { color: 0x333333, opacity: 0.25, transparent: true } );

    var nurbsControlPointsLine = new THREE.Line( nurbsControlPointsGeometry, nurbsControlPointsMaterial );
    nurbsControlPointsLine.position.copy( nurbsLine.position );

    group.add( nurbsControlPointsLine );

    // NURBS surface

    var nsControlPoints = [
        [
            new THREE.Vector4 ( -200, -200, 100, 1 ),
            new THREE.Vector4 ( -200, -100, -200, 1 ),
            new THREE.Vector4 ( -200, 100, 250, 1 ),
            new THREE.Vector4 ( -200, 200, -100, 1 )
        ],
        [
            new THREE.Vector4 ( 0, -200, 0, 1 ),
            new THREE.Vector4 ( 0, -100, -100, 5 ),
            new THREE.Vector4 ( 0, 100, 150, 5 ),
            new THREE.Vector4 ( 0, 200, 0, 1 )
        ],
        [
            new THREE.Vector4 ( 200, -200, -100, 1 ),
            new THREE.Vector4 ( 200, -100, 200, 1 ),
            new THREE.Vector4 ( 200, 100, -250, 1 ),
            new THREE.Vector4 ( 200, 200, 100, 1 )
        ]
    ];
    var degree1 = 2;
    var degree2 = 3;
    var knots1 = [0, 0, 0, 1, 1, 1];
    var knots2 = [0, 0, 0, 0, 1, 1, 1, 1];
    var nurbsSurface = new THREE.NURBSSurface(degree1, degree2, knots1, knots2, nsControlPoints);


    function getSurfacePoint( u, v, target ) {

        return nurbsSurface.getPoint( u, v, target );

    }

    var geometry = new THREE.ParametricBufferGeometry( getSurfacePoint, 20, 20 );
    var material = new THREE.MeshLambertMaterial( { map: texture, side: THREE.DoubleSide , transparent: true , opacity: 0.7} );
    var object = new THREE.Mesh( geometry, material );
    object.position.set( - 200, 100, 0 );
    object.scale.multiplyScalar( 1 );
    group.add( object );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );


    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    window.addEventListener( 'resize', onWindowResize, false );
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