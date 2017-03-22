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

    // Create DNA material
    var dnaMat = new THREE.MeshPhongMaterial({ 
        color : 0x00FF00,
        specular : 0xFFFFFF,
        shininess: 10,
        morphTargets : true, 
        morphNormals : true, 
        side : THREE.DoubleSide, 
        shading: THREE.SmoothShading
    });

    // Create helix container
    dnaObj = new THREE.Object3D();
    dnaObj.position.set(1.353, -10.015, 5.629);
    dnaObj.rotation.set(1.241, 0.007, 0);    
    dnaObj.scale.set(4, 4, 4);

    // Gather vertices for unfolded shape
    var dnaPathObj1 = {
        doublehelix: true,
        points1: [
            new THREE.Vector3(-20, -20, -60),
            // new THREE.Vector3(-1/4, 0, -Math.sqrt(3)/2).multiplyScalar(10),
            new THREE.Vector3(-14, 0, -12),
            new THREE.Vector3(-6, 0, -7),
        ],
        points2: [],
        angleOffsets: [1.2*Math.PI, 1.2*Math.PI], //1.3
    }
    var dnaPathObj2 = {
        doublehelix: false,
        points1: [
            new THREE.Vector3(-3.933, -1.621, -6.295),
            new THREE.Vector3(-3.164, -0.027, -6.339),
            new THREE.Vector3(-2.998, 0.382, -5.407),
            new THREE.Vector3(-2.529, -0.349, -4.456),
            new THREE.Vector3(-1.750, -1.139, -4.390),
            new THREE.Vector3(-0.597, -1.505, -4.870),
            new THREE.Vector3(0.867, -0.986, -4.804),
            new THREE.Vector3(1.193, 0.164, -3.176),
            new THREE.Vector3(0.797, -0.447, -1.266)
        ],
        points2: [
            new THREE.Vector3(-6.038, 1.588, -5.994),
            new THREE.Vector3(-4.099, 1.898, -4.379),
            new THREE.Vector3(-3.548, 1.709, -3.428),
            new THREE.Vector3(-2.992, 0.448, -2.603),
            new THREE.Vector3(-2.069, -0.090, -1.826),
            new THREE.Vector3(-1.250, -0.096, -0.876)    
        ],
        angleOffsets: [],
    }
    var dnaPathObj3 = {
        doublehelix: true,
        points1: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 10),
            new THREE.Vector3(10, 0, 20),
            new THREE.Vector3(-10, -10, 60),
        ],
        points2: [],
        angleOffsets: [0, 1.2*Math.PI],
    }
    var pathObjList1 = [dnaPathObj1, dnaPathObj2, dnaPathObj3];


    
    function createDNAgeometry(pathObjList, extrusionSteps) {

        // DNA properties (type B):
        var radius = 1.0; //nm
        var pitch = 3.32; //nm
        var angleDiff = 1.2*Math.PI; // 11/6 ratio between groove widths
        var basesPerTurn = 8; // theoretically 10.5, but 8 looks ok
        var resolution = 8; // 8 looks ok

        // create helix cross-sectional geometry:
        var helixShape = new THREE.Shape();
        const longSide = 0.2;
        const shortSide = 0.07;
        helixShape.moveTo( -longSide/2, 0);
        helixShape.quadraticCurveTo(0, shortSide/2, longSide/2, 0);
        helixShape.quadraticCurveTo(0, -shortSide/2, -longSide/2, 0);

        // Loop over pathObjects:
        var strand1vertices = [];
        var strand2vertices = [];
        var i, obj;
        for (i=0; i<pathObjList.length; i++) {
            obj = pathObjList[i];
            if (obj.doublehelix) {
                // Create backbone curve:
                var bbCurve = new THREE.CatmullRomCurve3(obj.points1);
                // Spiral around backbone to create helices:
                var bbLength = bbCurve.getLength();
                var nrOfBases = Math.floor((bbLength/pitch)*basesPerTurn);
                var backBoneVertices = bbCurve.getSpacedPoints(nrOfBases);
                var baseNr, angle, x,y,z;
                var currentQuat = new THREE.Quaternion();
                var currentBackBone = new THREE.Vector3();
                var currentDial1 = new THREE.Vector3();
                var currentSummed1 = new THREE.Vector3();
                var currentDial2 = new THREE.Vector3();
                var currentSummed2 = new THREE.Vector3();    
                var currentTangent = new THREE.Vector3();
                var previousBackBone = new THREE.Vector3();
                var zVec = new THREE.Vector3(0, 0, 1);
                for (baseNr=0; baseNr<nrOfBases; baseNr++) {
                    angle1 = baseNr*2*Math.PI/basesPerTurn + obj.angleOffsets[0];
                    angle2 = angle1 + obj.angleOffsets[1];
                    currentDial1 = new THREE.Vector3(radius * Math.cos(angle1), radius * Math.sin(angle1), 0);
                    currentDial1.applyQuaternion(currentQuat);
                    currentDial2 = new THREE.Vector3(radius * Math.cos(angle2), radius * Math.sin(angle2), 0);
                    currentDial2.applyQuaternion(currentQuat);        
                    currentBackBone = backBoneVertices[baseNr];
                    currentSummed1.addVectors(currentBackBone, currentDial1);
                    currentSummed2.addVectors(currentBackBone, currentDial2);
                    strand1vertices.push(currentSummed1.clone());
                    strand2vertices.push(currentSummed2.clone());
                    if (baseNr>0) {
                        currentTangent.subVectors(currentBackBone, previousBackBone).normalize();
                        currentQuat.setFromUnitVectors(zVec, currentTangent);    
                    }
                    previousBackBone = currentBackBone.clone();
                }
            } else {
                // Simply add vertices to strand vertices, ensuring closest ends are connected:
                var crossing = false;
                if (strand1vertices.length>0) {
                    const dist11 = strand1vertices[strand1vertices.length-1].distanceTo(obj.points1[0]);
                    const dist12 = strand1vertices[strand1vertices.length-1].distanceTo(obj.points2[0]);
                    const dist21 = strand2vertices[strand2vertices.length-1].distanceTo(obj.points1[0]);
                    const dist22 = strand2vertices[strand2vertices.length-1].distanceTo(obj.points2[0]);
                    const distII = dist11 + dist22;
                    const distX = dist12 + dist21;
                    crossing = (distX<distII) ? true : false;
                }
                if (crossing) {
                    strand1vertices = strand1vertices.concat(obj.points2);
                    strand2vertices = strand2vertices.concat(obj.points1);
                } else {
                    strand1vertices = strand1vertices.concat(obj.points1);
                    strand2vertices = strand2vertices.concat(obj.points2);                
                }
            }

        }

        // Extrude both strands:
        const helixSpline1 = new THREE.CatmullRomCurve3(strand1vertices);
        const helixSpline2 = new THREE.CatmullRomCurve3(strand2vertices);
        const helixGeom1 = new THREE.ExtrudeGeometry(helixShape, { steps : extrusionSteps, extrudePath : helixSpline1 });
        const helixGeom2 = new THREE.ExtrudeGeometry(helixShape, { steps : extrusionSteps, extrudePath : helixSpline2 });
        
        // Return list of the two strand geometries:
        return [helixGeom1, helixGeom2];

    }

    const helixGeometries = createDNAgeometry(pathObjList1, 2000);

    const dnaMesh1 = new THREE.Mesh(helixGeometries[0], dnaMat);
    const dnaMesh2 = new THREE.Mesh(helixGeometries[1], dnaMat);

    dnaObj.add(dnaMesh1);
    dnaObj.add(dnaMesh2);

    //scene.add(dnaObj);
    return dnaObj;
}


























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


function createParticleSystem() {
    // The number of particles in a particle system is not easily changed.
    var particleCount = 10;
    // Particles are just individual vertices in a geometry
    // Create the geometry that will hold all of the vertices
    var particles = new THREE.Geometry();
    // Create the vertices and add them to the particles geometry
    for (var p = 0; p < particleCount; p++) {
        // This will create all the vertices in a range of -200 to 200 in all directions
        var x = Math.random() * 400 - 200;
        var y = Math.random() * 400 - 200;
        var z = Math.random() * 400 - 200;   
        // Create the vertex
        var particle = new THREE.Vector3(x, y, z);
        // Add the vertex to the geometry
        particles.vertices.push(particle);
    }
    // Create the material that will be used to render each vertex of the geometry
    var particleMaterial = new THREE.PointsMaterial(
            {color: 0xffffff, 
             size: 40,
             map: THREE.ImageUtils.loadTexture("textures/cas9sprite1.png"),
             blending: THREE.NormalBlending, //AdditiveBlending
             transparent: true,
             opacity: 0.5,
             depthTest: true
            });
    // Create the particle system
    particleSystem = new THREE.Points(particles, particleMaterial);
    return particleSystem;  
}


function animateParticles() {
    var verts = particleSystem.geometry.vertices;
    for(var i = 0; i < verts.length; i++) {
        var vert = verts[i];
        if (vert.y > 200) {
            vert.y = Math.random() * 400 - 200;
        }
        vert.y = vert.y + (3.0 * deltaTime);

    }
    particleSystem.geometry.verticesNeedUpdate = true;
    particleSystem.rotation.y -= 0.03 * deltaTime;
}



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
