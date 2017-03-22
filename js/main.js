if (! Detector.webgl) {
    Detector.addGetWebGLMessage();
}    

var stats, camera, controls, scene, renderer;
var postprocessing = {};
var clock, deltaTime, particleSystem;
var uniforms;

init();
animate();

function init() {

    // Clock
    clock = new THREE.Clock(true);

    // Scene and Renderer
    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0xffffff, 0.002);
    scene.fog = new THREE.FogExp2(0xffffff, 0.001);
    // scene.fog = new THREE.Fog(0xffffff, 1, 2000);
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    var container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    // Camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );   
    camera.up.set(0.3,0.9,0.2);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); 
    camera.position.set(-79, -44, 122);
    scene.add(camera);

    // Lights
    var ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);
    var camLight = new THREE.DirectionalLight(0xffffff, 0.5);
    camLight.position.set(0, 0, 0); 
    camLight.lookAt(new THREE.Vector3(0, 0, 0));
    camera.add(camLight);

    // Load cas9
    var loader1 = new THREE.JSONLoader();
    loader1.load('models/crisprV2.2.json', function (geometry, materials) {

        var test1 = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        test1.receiveShadow = true;
        test1.castShadow = true;
        scene.add(test1);
        test1.scale.set(10,10,10);

        // Center mol
        test1.geometry.computeBoundingSphere();
        var center = test1.geometry.boundingSphere.center.clone();
        center.multiplyScalar(10);
        test1.position.copy(center.negate());  
 
        // Load RNA
        var loader2 = new THREE.JSONLoader();
        loader2.load('models/crisprV2.2b.json', function (geometry, materials) {
            test2 = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
            // test2.receiveShadow = true;
            // test2.castShadow = true;
            test2.scale.set(10,10,10);     
            scene.add(test2);   
            test2.position.copy(center);
        });         

    });



    // Camera Controls
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.maxDistance = 2000;
    controls.zoomSpeed = 0.5;

    // Shadows
    camLight.castShadow = true;
    camLight.shadow.mapSize.width = 2048;
    camLight.shadow.mapSize.height = 2048;
    var d = 50;
    camLight.shadow.camera.left = -d;
    camLight.shadow.camera.right = d;
    camLight.shadow.camera.top = d;
    camLight.shadow.camera.bottom = -d;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;    

    // Stats
    stats = new Stats();
    container.appendChild( stats.dom );
    
    // Resize
    window.addEventListener( 'resize', onWindowResize, false );

    // Bubbles
    //particleSystem = createParticleSystem();
    //scene.add(particleSystem);

    // DNA
    var dna = createDNA();
    scene.add(dna);
    //animateDNA(dna.children[0], 10000);

    // Transform Controls (delete later...)
    var tcontrol = new THREE.TransformControls( camera, renderer.domElement );
    tcontrol.addEventListener( 'change', onTransform ); //render
    function onTransform() {
        console.log('----');
        console.log(this.object.position.x, this.object.position.y, this.object.position.z);
        console.log(this.object.rotation.x, this.object.rotation.y, this.object.rotation.z);
        console.log(this.object.scale.x, this.object.scale.y, this.object.scale.z);
    } 
    
    
    // tcontrol.attach(dna);
    var posBall = new THREE.Mesh((new THREE.SphereGeometry(0.1)), new THREE.MeshLambertMaterial({color: 0xff0000}));
    dna.add(posBall);
    tcontrol.attach(posBall);
    scene.add(tcontrol);
    window.addEventListener( 'keydown', function ( event ) {
        switch ( event.keyCode ) {
            case 81: // Q
                tcontrol.setSpace( tcontrol.space === "local" ? "world" : "local" );
                break;
            case 17: // Ctrl
                tcontrol.setTranslationSnap( 100 );
                tcontrol.setRotationSnap( THREE.Math.degToRad( 15 ) );
                break;
            case 87: // W
                tcontrol.setMode( "translate" );
                break;
            case 69: // E
                tcontrol.setMode( "rotate" );
                break;
            case 82: // R
                tcontrol.setMode( "scale" );
                break;
            case 187:
            case 107: // +, =, num+
                tcontrol.setSize( tcontrol.size + 0.1 );
                break;
            case 189:
            case 109: // -, _, num-
                tcontrol.setSize( Math.max( tcontrol.size - 0.1, 0.1 ) );
                break;
        }
    });
    window.addEventListener( 'keyup', function ( event ) {
        switch ( event.keyCode ) {
            case 17: // Ctrl
                tcontrol.setTranslationSnap( null );
                tcontrol.setRotationSnap( null );
                break;
        }
    }); 


     



}




function createDNA() {

    var dnaMat = new THREE.MeshPhongMaterial({ 
        color : 0x00FF00,
        specular : 0xFFFFFF,
        shininess: 10,
        morphTargets : true, 
        morphNormals : true, 
        side : THREE.DoubleSide, 
        shading: THREE.SmoothShading
    });

    // create helix container
    helixObj = new THREE.Object3D();
    helixObj.position.set(1.353, -10.015, 5.629);
    helixObj.rotation.set(1.241, 0.007, 0);    
    helixObj.scale.set(4, 4, 4);


    // Interior single strand 1:
    var helixVertices1 = [
        new THREE.Vector3(-3.933, -1.621, -6.295),
        new THREE.Vector3(-3.164, -0.027, -6.339),
        new THREE.Vector3(-2.998, 0.382, -5.407),
        new THREE.Vector3(-2.529, -0.349, -4.456),
        new THREE.Vector3(-1.750, -1.139, -4.390),
        new THREE.Vector3(-0.597, -1.505, -4.870),
        new THREE.Vector3(0.867, -0.986, -4.804),
        new THREE.Vector3(1.193, 0.164, -3.176),
        new THREE.Vector3(0.797, -0.447, -1.266)
    ];

    // Interior single strand 1:
	var helixVertices2 = [
		new THREE.Vector3(-4.099, 1.898, -4.379),
		new THREE.Vector3(-3.548, 1.709, -3.428),
		new THREE.Vector3(-2.992, 0.448, -2.603),
		new THREE.Vector3(-2.069, -0.090, -1.826),
		new THREE.Vector3(-1.250, -0.096, -0.876)
	];


    // Doublehelix1:

    // DNA properties (type B):
    var radius = 1.0; //nm
    var pitch = 3.32; //nm
    var angleDiff = 1.2*Math.PI; //
    var basesPerTurn = 8; // theoretically 10.5, but 8 looks ok
    var resolution = 8; // 8 looks ok

    // create helix cross-sectional geometry:
    var helixShape = new THREE.Shape();
    var longSide = 0.2;
    var shortSide = 0.07;
    helixShape.moveTo( -longSide/2, 0);
    helixShape.quadraticCurveTo(0, shortSide/2, longSide/2, 0);
    helixShape.quadraticCurveTo(0, -shortSide/2, -longSide/2, 0);

    // create backbone path:
    var initDir = new THREE.Vector3(0, 0, 1); //initial direction (tangent)
    var bbCurve = new THREE.CatmullRomCurve3( [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 10),
        new THREE.Vector3(10, 0, 20),
        new THREE.Vector3(-10, -10, 60),
    ] );
    // var bbGeom = new THREE.Geometry();
    // bbGeom.vertices = bbCurve.getSpacedPoints(24);
    // var bbMat = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    // var bbObj = new THREE.Line( bbGeom, bbMat );
    // helixObj.add(bbObj);

    // spiral around backbone to create helices:
    var bbLength = bbCurve.getLength();
    var nrOfBases = Math.floor((bbLength/pitch)*basesPerTurn);
    var backBoneVertices = bbCurve.getSpacedPoints(nrOfBases);
    // var helixVertices1 = [];
    //var helixVertices2 = [];
    var baseNr, angle, x,y,z;
    var currentQuat = new THREE.Quaternion();
    var currentBackBone = new THREE.Vector3();
    var currentDial1 = new THREE.Vector3();
    var currentSummed1 = new THREE.Vector3();
    var currentDial2 = new THREE.Vector3();
    var currentSummed2 = new THREE.Vector3();    
    var currentTangent = new THREE.Vector3();
    var previousBackBone = new THREE.Vector3();
    for (baseNr=0; baseNr<nrOfBases; baseNr++) {
        angle1 = baseNr*2*Math.PI/basesPerTurn;
        angle2 = angle1 + angleDiff;
        currentDial1 = new THREE.Vector3(radius * Math.cos(angle1), radius * Math.sin(angle1), 0);
        currentDial1.applyQuaternion(currentQuat);
        currentDial2 = new THREE.Vector3(radius * Math.cos(angle2), radius * Math.sin(angle2), 0);
        currentDial2.applyQuaternion(currentQuat);        
        currentBackBone = backBoneVertices[baseNr];
        currentSummed1.addVectors(currentBackBone, currentDial1);
        currentSummed2.addVectors(currentBackBone, currentDial2);
        helixVertices1.push(currentSummed1.clone());
        helixVertices2.push(currentSummed2.clone());
        if (baseNr>0) {
            currentTangent.subVectors(currentBackBone, previousBackBone).normalize();
            currentQuat.setFromUnitVectors(initDir, currentTangent);    
        }
        previousBackBone = currentBackBone.clone();
    }    

    // extrude:
    var helixSpline1 = new THREE.CatmullRomCurve3(helixVertices1);
    var helixGeom1 = new THREE.ExtrudeGeometry(helixShape, { steps : nrOfBases*resolution, extrudePath : helixSpline1 });
    var helixSpline2 = new THREE.CatmullRomCurve3(helixVertices2);
    var helixGeom2 = new THREE.ExtrudeGeometry(helixShape, { steps : nrOfBases*resolution, extrudePath : helixSpline2 });
    //helixGeom1.morphTargets.push({ name: "1", vertices: helixGeom1.vertices });    
    // add other helix as morph target:
    //helixGeom1.morphTargets.push({ name: "2", vertices: helixGeom2.vertices });
    
    // create mesh:
    var helixMesh1 = new THREE.Mesh(helixGeom1, dnaMat);
    var helixMesh2 = new THREE.Mesh(helixGeom2, dnaMat);
    // helixMesh.castShadow = true;
    // helixMesh.receiveShadow = true;
    helixMesh1.geometry.computeVertexNormals();
    helixMesh1.geometry.computeMorphNormals();

    helixObj.add(helixMesh1);
    helixObj.add(helixMesh2);

    return helixObj;

    //Starting Point for last part of double helix: 
    //new THREE.Vector3(-6, 0, -7)

}




// function createDNA1() {

//     var dnaMat = new THREE.MeshPhongMaterial({ 
//         color : 0x0000FF,
//         specular : 0xFFFFFF,
//         shininess: 10,
//         morphTargets : true, 
//         morphNormals : true, 
//         side : THREE.DoubleSide, 
//     });

//     // create helix geometry:
//     var helix = new THREE.Curves.HelixCurve()
//     var helixGeom = new THREE.TubeGeometry(helix, 200, 1, 5, false);
//     helixGeom.morphTargets.push({ name: "coiled", vertices: helixGeom.vertices });    

//     // add melted helix as morph target:
//     var helixUncoiled = new THREE.CatmullRomCurve3([
//         new THREE.Vector3(0, 0, 0),
//         new THREE.Vector3(0, 0, 200)
//     ]);
//     var helixGeom2 = new THREE.TubeGeometry(helixUncoiled, 200, 1, 5, false);
//     helixGeom.morphTargets.push({ name: "extended", vertices: helixGeom2.vertices });
    
//     // create mesh:
//     var helixMesh = new THREE.Mesh(helixGeom, dnaMat);
//     helixMesh.castShadow = true;
//     helixMesh.receiveShadow = true;
//     helixMesh.scale.set(0.3, 0.3, 1);

//     helixMesh.geometry.computeVertexNormals();
//     helixMesh.geometry.computeMorphNormals();

//     return helixMesh;

// }


function animateDNA(mesh, t) {

    var currentParams = {
        morph : mesh.morphTargetInfluences[1]
    }
    var targetParams = {
        morph : 1-mesh.morphTargetInfluences[1]               
    };                

    var tween = new TWEEN.Tween(currentParams).to(targetParams, t);

    var transition = function() {
        mesh.morphTargetInfluences[1]=currentParams.morph;
        //console.log(mesh.morphTargetInfluences[1]);
    }

    tween.onUpdate(transition);
    tween.easing(TWEEN.Easing.Quadratic.InOut);
    tween.start();

}






// function createParticleSystem() {
//     // The number of particles in a particle system is not easily changed.
//     var particleCount = 10;
//     // Particles are just individual vertices in a geometry
//     // Create the geometry that will hold all of the vertices
//     var particles = new THREE.Geometry();
//     // Create the vertices and add them to the particles geometry
//     for (var p = 0; p < particleCount; p++) {
//         // This will create all the vertices in a range of -200 to 200 in all directions
//         var x = Math.random() * 400 - 200;
//         var y = Math.random() * 400 - 200;
//         var z = Math.random() * 400 - 200;   
//         // Create the vertex
//         var particle = new THREE.Vector3(x, y, z);
//         // Add the vertex to the geometry
//         particles.vertices.push(particle);
//     }
//     // Create the material that will be used to render each vertex of the geometry
//     var particleMaterial = new THREE.PointsMaterial(
//             {color: 0xffffff, 
//              size: 40,
//              map: THREE.ImageUtils.loadTexture("textures/cas9sprite1.png"),
//              blending: THREE.NormalBlending, //AdditiveBlending
//              transparent: true,
//              opacity: 0.5,
//              depthTest: true
//             });
//     // Create the particle system
//     particleSystem = new THREE.Points(particles, particleMaterial);
//     return particleSystem;  
// }


// function animateParticles() {
//     var verts = particleSystem.geometry.vertices;
//     for(var i = 0; i < verts.length; i++) {
//         var vert = verts[i];
//         if (vert.y > 200) {
//             vert.y = Math.random() * 400 - 200;
//         }
//         vert.y = vert.y + (3.0 * deltaTime);

//     }
//     particleSystem.geometry.verticesNeedUpdate = true;
//     particleSystem.rotation.y -= 0.03 * deltaTime;
// }



function animate() {
    deltaTime = clock.getDelta();
    requestAnimationFrame( animate );
    controls.update();
    stats.update();
    //animateParticles();
    TWEEN.update();
    render();
}


function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );

}


function render() {
    renderer.render( scene, camera );
}
