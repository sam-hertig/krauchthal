if (! Detector.webgl) {
    Detector.addGetWebGLMessage();
}    

var stats, camera, controls, scene, renderer;
var postprocessing = {};
var clock, deltaTime, particleSystem;
var uniforms;
var tcontrol;
var center;
var T = 0;
var p5 = new p5();
var uniforms;

var pdb4CMP, pdb4ZTO, pdb5F9R, gRNA; 

// Create RNA material 1
var rnaMat1 = new THREE.MeshPhongMaterial({ 
    color : 0x0000FF,
    specular : 0xFFFFFF,
    shininess: 10, 
    side : THREE.DoubleSide, 
    shading: THREE.SmoothShading
});
var rnaMat2 = new THREE.MeshPhongMaterial({ 
    color : 0x0000FF,
    specular : 0xFFFFFF,
    shininess: 10,
    morphTargets : true, 
    morphNormals : true, 
    side : THREE.DoubleSide, 
    shading: THREE.SmoothShading
});

// Create DNA material
var dnaMat1 = new THREE.MeshPhongMaterial({ 
    color : 0x9900AA,
    specular : 0xFFFFFF,
    shininess: 10,
    morphTargets : true, 
    morphNormals : true, 
    side : THREE.DoubleSide, 
    shading: THREE.SmoothShading
});
var dnaMat2 = new THREE.MeshPhongMaterial({ 
    color : 0x9900AA,
    specular : 0xFFFFFF,
    shininess: 10,
    // morphTargets : true, 
    // morphNormals : true,     
    side : THREE.DoubleSide, 
    shading: THREE.SmoothShading
});

init();


function init() {

    // Clock
    clock = new THREE.Clock(true);

    // Scene and Renderer
    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0xffffff, 0.002); //0.001
    scene.fog = new THREE.Fog(0xffffff, 80, 3000000); // 300
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 50000 );   
    camera.up.set(0.3,0.9,0.2);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); 
    //camera.position.set(-79, -44, 122);
    camera.position.set(0, 0, 150);
    scene.add(camera);

    // Lights
    var ambLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambLight);
    var camLight = new THREE.DirectionalLight(0xffffff, 0.5);
    camLight.position.set(0, 0, 0); 
    camLight.lookAt(new THREE.Vector3(0, 0, 0));
    camera.add(camLight);

    // Load cas9 5f9r
    var loader1 = new THREE.JSONLoader();
    loader1.load('models/crisprV2.3.json', function (geometry, materials) {


        pdb5F9R = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
        //test1.receiveShadow = true;
        //test1.castShadow = true;
        scene.add(pdb5F9R);
        pdb5F9R.scale.set(10,10,10);


        // Center mol
        pdb5F9R.geometry.computeBoundingSphere();
        center = pdb5F9R.geometry.boundingSphere.center.clone();
        center.multiplyScalar(10).negate();
        pdb5F9R.position.copy(center);  
 
        // Load RNA
        var loader2 = new THREE.JSONLoader();
        loader2.load('models/crisprV2.2e.json', function (geometry, materials) {
            gRNA = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            gRNA.material = rnaMat1;
            gRNA.scale.set(10,10,10);     
            scene.add(gRNA);   
            gRNA.position.copy(center);
        });

        // Load cas9 4zt0
        var loader3 = new THREE.JSONLoader();
        loader3.load('models/crisprV2.4.4zt0.json', function (geometry, materials) {
            pdb4ZTO = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            pdb4ZTO.scale.set(10,10,10);     
            scene.add(pdb4ZTO);   
            pdb4ZTO.position.copy(center);
            pdb4ZTO.visible = false;
        });

        // Transform Controls (delete later...)
        // tcontrol = new THREE.TransformControls(camera, renderer.domElement);
        // tcontrol.attach(pdb5F9R);
        // scene.add(tcontrol);

        animate();

    });



    // Camera Controls
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.maxDistance = 25000; //250
    controls.zoomSpeed = 0.5;
    //controls.noPan = true;

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
    window.addEventListener('resize', onWindowResize, false);
    // window.addEventListener('orientationchange', onWindowResize, false); firefox and chrome on iOS????

    // Bubbles
    particleSystem = createParticleSystem();
    scene.add(particleSystem);

    // Floppy RNA
    var rna = createFloppyRNA();
    scene.add(rna);

    // DNA
    var dna = createDNA();
    scene.add(dna);

    // // cut DNA part 1
    // var dnaPart1 = createDNApart1();
    // scene.add(dnaPart1);

    // // cut DNA part 2
    // var dnaPart2 = createDNApart2();
    // scene.add(dnaPart2);

    // Nucleus
    var nucleus = createNucleus();
    nucleus.scale.set(4, 4, 4);
    scene.add(nucleus);    

    // Transform Controls (delete later...)
    // tcontrol = new THREE.TransformControls(camera, renderer.domElement);
    // tcontrol.addEventListener('change', onTransform); //render
    // function onTransform() {
    //   console.log('----');
    //   console.log(this.object.position.x, this.object.position.y, this.object.position.z);
    //   console.log(this.object.rotation.x, this.object.rotation.y, this.object.rotation.z);
    //   console.log(this.object.scale.x, this.object.scale.y, this.object.scale.z);
    // } 
    //var posBall = new THREE.Mesh((new THREE.SphereGeometry(0.1)), new THREE.MeshLambertMaterial({color: 0xff0000}));
    //rna.add(posBall);
    //tcontrol.attach(posBall);
    // tcontrol.attach(pdb5F9R);
    // scene.add(tcontrol);

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
            case 77: //m
                animateDNA(dna.children[0], 3000);
                animateDNA(dna.children[1], 3000);
                animateDNA(rna.children[0], 3000);
                break;
            case 78: //n
                conformationalChange(pdb5F9R, pdb4ZTO);
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


function createNucleus() {

    var positions = [];
    var radius = 1500; // 3000
    var nrOfNpc = 100; // 2000
    var npcRadius = 30; // 60
    var holeRadius = npcRadius*1.2;

    var outerNucleusMat = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa, 
        fog: false
    });

    // var innerNucleusMat = new THREE.MeshLambertMaterial({
    //     color: 0xaaaaaa, 
    //     side: THREE.BackSide,
    //     fog: false
    // });
    var loader = new THREE.TextureLoader();
    var bg = loader.load("textures/perlin_noise.jpg");
    uniforms = {  
        time: { type: "f", value: 0.0 },
        speed: { type: "f", value: 0.2 },
        resolution: { type: "f", value: 10.0 },
        color: { type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
        image: { type: 't', value: bg },
        brightness: { type: "f", value: 1.0 },       
    };
    var innerNucleusMat = new THREE.ShaderMaterial( {  
        uniforms:       uniforms,
        vertexShader:   document.getElementById('nucleus-vertex').textContent,
        fragmentShader: document.getElementById('nucleus-fragment').textContent,
        fog: false
    });    

    var holesMat = new THREE.MeshBasicMaterial({
        color: 0x555555,
        fog: false
    });

    var outerNucleusGeom = new THREE.Geometry();

    var membraneGeom = new THREE.SphereGeometry(radius, 32, 32);
    var membraneMesh = new THREE.Mesh(membraneGeom);
    membraneMesh.updateMatrix();
    outerNucleusGeom.merge(membraneMesh.geometry, membraneMesh.matrix);

    var npcGeom = new THREE.Geometry();
    var subunitGeom = new THREE.SphereGeometry(npcRadius, 8, 8);
    var subunitMesh = new THREE.Mesh(subunitGeom);
    var i;
    for (i=0; i<8; i++) {
        subunitMesh.position.x = holeRadius*Math.cos(i*Math.PI/4);
        subunitMesh.position.y = holeRadius*Math.sin(i*Math.PI/4);
        subunitMesh.updateMatrix();
        npcGeom.merge(subunitMesh.geometry, subunitMesh.matrix);
    }
    var npcMesh = new THREE.Mesh(npcGeom);

    var holesGeom = new THREE.Geometry();
    var holeGeom = new THREE.PlaneGeometry(holeRadius, holeRadius);
    var holeMesh = new THREE.Mesh(holeGeom);


    var j, x, y, z, pos, dial;
    var zVec = new THREE.Vector3(0, 0, 1);
    var quat = new THREE.Quaternion();
    var Theta = 0, Phi =0;

    for (j=0; j<nrOfNpc; j++) {

        x = Math.sin(Phi) * Math.cos(Theta);
        y = Math.sin(Phi) * Math.sin(Theta);
        z = Math.cos(Phi); 
        pos = new THREE.Vector3(x, y, z);
        quat.setFromUnitVectors(zVec, pos);
        pos.multiplyScalar(radius);

        npcMesh.position.copy(pos);
        npcMesh.quaternion.copy(quat);
        npcMesh.updateMatrix();
        outerNucleusGeom.merge(npcMesh.geometry, npcMesh.matrix);

        holeMesh.position.copy(pos);
        holeMesh.quaternion.copy(quat);
        holeMesh.updateMatrix();
        holesGeom.merge(holeMesh.geometry, holeMesh.matrix);

        Theta = 2*Math.PI*Math.random();
        Phi = Math.acos(1 - 2*Math.random());    

    }     

    
    var outerNucleusBufferGeom = new THREE.BufferGeometry().fromGeometry(outerNucleusGeom);
    var holesBufferGeom = new THREE.BufferGeometry().fromGeometry(holesGeom);

    var outerNucleus = new THREE.Mesh(outerNucleusBufferGeom, outerNucleusMat);
    var holes = new THREE.Mesh(holesBufferGeom, holesMat);

    var innerNucleusBufferGeom = new THREE.SphereBufferGeometry(radius-npcRadius, 32, 32);
    var innerNucleus = new THREE.Mesh(innerNucleusBufferGeom, innerNucleusMat);
    innerNucleus.scale.set(-1, 1, 1);  
    innerNucleus.eulerOrder = 'XZY';    

    var nucleus = new THREE.Object3D();
    nucleus.add(outerNucleus, holes, innerNucleus);

    return nucleus;

    // var prev = window.performance.now();
    // now = window.performance.now();
    // console.log((now-prev)/1000);
    
}


function conformationalChange(pdb1, pdb2) {

    T+=10;
    
    var smoothness = 10; //0.01
    var maxDisplacement = (T<300) ? T*0.00333 : (2-(T*0.00333)); //10
    maxDisplacement = (maxDisplacement<0) ? 0 : 5*maxDisplacement;
    console.log(T, maxDisplacement);

    var xGen = (T*smoothness) + 17;
    var yGen = (T*smoothness) + 11;
    var zGen = (T*smoothness) + 82;
    
    var x = maxDisplacement * (2*p5.noise(xGen)-1);
    var y = maxDisplacement * (2*p5.noise(yGen)-1);
    var z = maxDisplacement * (2*p5.noise(zGen)-1);

    var displacement = new THREE.Vector3(x, y, z);

    pdb5F9R.position.addVectors(center, displacement);
    pdb4ZTO.position.addVectors(center, displacement);


    if (T>200 && T<400) {
        pdb1.visible = (0.5-Math.random() > 0);
        pdb2.visible = !pdb1.visible;
    }

    else if (T===400) {
        pdb1.visible = false;
        pdb2.visible = true;
    }

}




function createFloppyRNA() {

    // Create helix container
    rnaObj = new THREE.Object3D();
    rnaObj.position.set(1.353, -10.015, 5.629);
    rnaObj.rotation.set(1.241, 0.007, 0);    
    rnaObj.scale.set(4, 4, 4);

    // Gather vertices for unfolded shape
    var rnaPathObj = {
        doublehelix: false,
        points1: [
            new THREE.Vector3(-0.16370690695911244, -1.7376220683912846, -3.332705870590946),
            new THREE.Vector3(-0.5252711391915935, -1.394432904812714, -3.2939267742938227),
            new THREE.Vector3(-1.128,-0.423, -3.996),
            new THREE.Vector3(-2.556,-0.325, -5.499),
            new THREE.Vector3(-3.709,-0.989, -5.734),

            new THREE.Vector3(-6.268,-1.5, -7.382),
        ],
        points2: [
            new THREE.Vector3(-0.16370690695911244, -1.7376220683912846, -3.332705870590946),
            new THREE.Vector3(-0.5252711391915935, -1.394432904812714, -3.2939267742938227),
            new THREE.Vector3(-0.811, -0.348, -3.489),
            new THREE.Vector3(-1.055, 0.476, -4.041),
            new THREE.Vector3(-1.181, 0.564, -4.870),
            new THREE.Vector3(-1.381, -0.210, -5.886),
            new THREE.Vector3(-2.225, -1.356, -5.566),
            new THREE.Vector3(-2.851, -1.486, -4.991),
            new THREE.Vector3(-3.549, -1.143, -4.372),
        ],
        angleOffsets: [],
    }

    var pathObjList = [rnaPathObj];

    var extrudeQuality = 100;

    // Create Geometries:
    var rnaGeometries = createDNAgeometry(pathObjList, extrudeQuality);
    var rnaGeom1 = rnaGeometries[0];
    var rnaGeom2 = rnaGeometries[1];

    // Add Morph targets:
    rnaGeom1.morphTargets.push({ name: "A", vertices: rnaGeom1.vertices });
    rnaGeom1.morphTargets.push({ name: "B", vertices: rnaGeom2.vertices });    

   
    // Create Meshes:
    var rnaMesh1 = new THREE.Mesh(rnaGeom1, rnaMat2);
    rnaObj.add(rnaMesh1);

    // Compute Normals:
    rnaMesh1.geometry.computeVertexNormals();
    rnaMesh1.geometry.computeMorphNormals();    

    return rnaObj;
}




function createDNA() {

    // Create helix container
    dnaObj = new THREE.Object3D();
    dnaObj.position.set(1.353, -10.015, 5.629);
    dnaObj.rotation.set(1.241, 0.007, 0);    
    dnaObj.scale.set(4, 4, 4);

    // Gather vertices for unfolded shape
    var helixPoints1 = [
        new THREE.Vector3(-20, -20, -60),
        new THREE.Vector3(-14, 0, -12),
        new THREE.Vector3(-6, 0, -7),
    ];
    var helixPoints3 = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 10),
        new THREE.Vector3(10, 0, 20),
        new THREE.Vector3(-10, -10, 60),
    ]
    var dnaPathObj0 = {
        doublehelix: true,
        points1: helixPoints1.concat(helixPoints3),
        points2: [],
        angleOffsets: [0, 1.2*Math.PI],
    }    
    var dnaPathObj1 = {
        doublehelix: true,
        points1: [new THREE.Vector3(-20, -20, -61.5)].concat(helixPoints1),
        points2: [],
        angleOffsets: [0, 1.2*Math.PI],
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
            new THREE.Vector3(1.118, 0.156, -2.631), // CUT!
            new THREE.Vector3(0.797, -0.447, -1.266)
        ],
        points2: [
            new THREE.Vector3(-6.038, 1.588, -5.994),
            new THREE.Vector3(-4.099, 1.898, -4.379),
            new THREE.Vector3(-3.548, 1.709, -3.428),
            new THREE.Vector3(-2.992, 0.448, -2.603),
            new THREE.Vector3(-2.069, -0.090, -1.826), // CUT!
            new THREE.Vector3(-1.250, -0.096, -0.876)
        ],
        angleOffsets: [],
    }
    var dnaPathObj3 = {
        doublehelix: true,
        points1: helixPoints3.concat([new THREE.Vector3(-10, -10, 62)]),
        points2: [],
        angleOffsets: [0, 1.2*Math.PI],
    }
        
    
    var pathObjList1 = [dnaPathObj0];
    var pathObjList2 = [dnaPathObj1, dnaPathObj2, dnaPathObj3];

    var extrudeQuality = 1000;

    // Create Geometries:
    var dnaGeometries = createDNAgeometry(pathObjList1, extrudeQuality);
    var dnaGeom1 = dnaGeometries[0];
    var dnaGeom2 = dnaGeometries[1];

    // Add Morph targets:
    var dnaGeometriesMorphed1 = createDNAgeometry(pathObjList2, extrudeQuality);
    var dnaGeom1morphed1 = dnaGeometriesMorphed1[0];
    var dnaGeom2morphed1 = dnaGeometriesMorphed1[1];
    dnaGeom1.morphTargets.push({ name: "1", vertices: dnaGeom1.vertices });
    dnaGeom2.morphTargets.push({ name: "1", vertices: dnaGeom2.vertices });    
    dnaGeom1.morphTargets.push({ name: "2", vertices: dnaGeom1morphed1.vertices });
    dnaGeom2.morphTargets.push({ name: "2", vertices: dnaGeom2morphed1.vertices });
   
    // Create Meshes:
    var dnaMesh1 = new THREE.Mesh(dnaGeom1, dnaMat1);
    var dnaMesh2 = new THREE.Mesh(dnaGeom2, dnaMat1);
    dnaObj.add(dnaMesh1);
    dnaObj.add(dnaMesh2);

    // Compute Normals:
    dnaMesh1.geometry.computeVertexNormals();
    dnaMesh2.geometry.computeVertexNormals();
    dnaMesh1.geometry.computeMorphNormals();    
    dnaMesh2.geometry.computeMorphNormals(); 

    return dnaObj;
}




function createDNApart1() {

    // Create helix container
    dnaObj = new THREE.Object3D();
    dnaObj.position.set(1.353, -10.015, 5.629);
    dnaObj.rotation.set(1.241, 0.007, 0);    
    dnaObj.scale.set(4, 4, 4);

    // Gather vertices for unfolded shape
    var helixPoints1 = [
        new THREE.Vector3(-20, -20, -60),
        new THREE.Vector3(-14, 0, -12),
        new THREE.Vector3(-6, 0, -7),
    ];

   
    var dnaPathObj1 = {
        doublehelix: true,
        points1: [new THREE.Vector3(-20, -20, -61.5)].concat(helixPoints1),
        points2: [],
        angleOffsets: [0, 1.2*Math.PI],
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
            new THREE.Vector3(1.118, 0.156, -2.631), // CUT!
        ],
        points2: [
            new THREE.Vector3(-6.038, 1.588, -5.994),
            new THREE.Vector3(-4.099, 1.898, -4.379),
            new THREE.Vector3(-3.548, 1.709, -3.428),
            new THREE.Vector3(-2.992, 0.448, -2.603),
            new THREE.Vector3(-2.069, -0.090, -1.826), // CUT!
        ],
        angleOffsets: [],
    }

            
    var pathObjList = [dnaPathObj1, dnaPathObj2];

    var extrudeQuality = 500;

    // Create Geometries:
    var dnaGeometries = createDNAgeometry(pathObjList, extrudeQuality);
    var dnaGeom1 = dnaGeometries[0];
    var dnaGeom2 = dnaGeometries[1];
   
    // Create Meshes:
    var dnaMesh1 = new THREE.Mesh(dnaGeom1, dnaMat2);
    var dnaMesh2 = new THREE.Mesh(dnaGeom2, dnaMat2);
    dnaObj.add(dnaMesh1);
    dnaObj.add(dnaMesh2);

    // Compute Normals just to make stuff look smooth:
    dnaMesh1.geometry.computeVertexNormals();
    dnaMesh2.geometry.computeVertexNormals();

    return dnaObj;
}

function createDNApart2() {

    // Create helix container
    dnaObj = new THREE.Object3D();
    dnaObj.position.set(1.353, -10.015, 5.629);
    dnaObj.rotation.set(1.241, 0.007, 0);    
    dnaObj.scale.set(4, 4, 4);

    // Gather vertices for unfolded shape   
    var dnaPathObj2 = {
        doublehelix: false,
        points1: [
            new THREE.Vector3(1.118, 0.156, -2.631), // CUT!
            new THREE.Vector3(0.797, -0.447, -1.266)
        ],
        points2: [
            new THREE.Vector3(-2.069, -0.090, -1.826), // CUT!
            new THREE.Vector3(-1.250, -0.096, -0.876)
        ],
        angleOffsets: [],
    }
    var helixPoints3 = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 10),
        new THREE.Vector3(10, 0, 20),
        new THREE.Vector3(-10, -10, 60),
    ]
    var dnaPathObj3 = {
        doublehelix: true,
        points1: helixPoints3.concat([new THREE.Vector3(-10, -10, 62)]),
        points2: [],
        angleOffsets: [0, 1.2*Math.PI],
    }      

    var pathObjList = [dnaPathObj2, dnaPathObj3];

    var extrudeQuality = 500;

    // Create Geometries:
    var dnaGeometries = createDNAgeometry(pathObjList, extrudeQuality);
    var dnaGeom1 = dnaGeometries[0];
    var dnaGeom2 = dnaGeometries[1];
   
    // Create Meshes:
    var dnaMesh1 = new THREE.Mesh(dnaGeom1, dnaMat2);
    var dnaMesh2 = new THREE.Mesh(dnaGeom2, dnaMat2);
    dnaObj.add(dnaMesh1);
    dnaObj.add(dnaMesh2);

    // Compute Normals just to make stuff look smooth:
    dnaMesh1.geometry.computeVertexNormals();
    dnaMesh2.geometry.computeVertexNormals();

    return dnaObj;
}


function createDNAgeometry(pathObjList, extrusionSteps) {

    // DNA properties (type B):
    var radius = 1.0; //nm
    var pitch = 3.32; //nm
    var basesPerTurn = 8; // theoretically 10.5, but 8 looks ok
    var resolution = 8; // 8 looks ok

    // create helix cross-sectional geometry:
    var helixShape = new THREE.Shape();
    var longSide = 0.22; //0.2
    var shortSide = 0.065; //0.07
    helixShape.ellipse(0, 0, longSide/2, shortSide/2, 0, 2*Math.PI, true, 0.4*Math.PI);

    // Function to check how to tie parts together:
    function checkCrossing(oldList1, newList1, oldList2, newList2) {
        var crossing = false;
        if (oldList1.length>0) {
            var dist11 = oldList1[oldList1.length-1].distanceTo(newList1[0]);
            var dist12 = oldList1[oldList1.length-1].distanceTo(newList2[0]);
            var dist21 = oldList2[oldList2.length-1].distanceTo(newList1[0]);
            var dist22 = oldList2[oldList2.length-1].distanceTo(newList2[0]);
            var distII = dist11 + dist22;
            var distX = dist12 + dist21;
            crossing = (distX<distII) ? true : false;                        
        }
        return crossing;
    }        

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
            var temp1vertices = [];
            var temp2vertices = [];
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
                temp1vertices.push(currentSummed1.clone());
                temp2vertices.push(currentSummed2.clone());
                if (baseNr>0) {
                    currentTangent.subVectors(currentBackBone, previousBackBone).normalize();
                    currentQuat.setFromUnitVectors(zVec, currentTangent);    
                }
                previousBackBone = currentBackBone.clone();
            }
            // Figure out how to connect ends:
            var crossing = checkCrossing(strand1vertices, temp1vertices, strand2vertices, temp2vertices);
            if (crossing) {
                strand1vertices = strand1vertices.concat(temp2vertices);
                strand2vertices = strand2vertices.concat(temp1vertices);
            } else {
                strand1vertices = strand1vertices.concat(temp1vertices);
                strand2vertices = strand2vertices.concat(temp2vertices);                
            }

        } else {
            // Simply add vertices to strand vertices, ensuring closest ends are connected:
            var crossing = checkCrossing(strand1vertices, obj.points1, strand2vertices, obj.points2);
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
    var helixSpline1 = new THREE.CatmullRomCurve3(strand1vertices);
    var helixSpline2 = new THREE.CatmullRomCurve3(strand2vertices);
    console.log('Strand lengths:', helixSpline1.getLength(), helixSpline2.getLength());
    var helixGeom1 = new THREE.ExtrudeGeometry(helixShape, { steps : extrusionSteps, extrudePath : helixSpline1 });
    var helixGeom2 = new THREE.ExtrudeGeometry(helixShape, { steps : extrusionSteps, extrudePath : helixSpline2 });
    
    // Return list of the two strand geometries:
    return [helixGeom1, helixGeom2];

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
    }

    tween.onUpdate(transition);
    tween.easing(TWEEN.Easing.Quadratic.InOut);
    tween.start();

}


function createParticleSystem() {
    // The number of particles in a particle system is not easily changed.
    var particleCount = 1000;
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
    var loader = new THREE.TextureLoader();
    var texture = loader.load("textures/circle.png");  
    var particleMaterial = new THREE.PointsMaterial(
            {color: 0xffffff, 
             size: 4,
             map: texture,
             blending: THREE.NormalBlending, //AdditiveBlending, NormalBlending
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
    requestAnimationFrame(animate);
    controls.update();
    stats.update();
    animateParticles();
    TWEEN.update();

    uniforms.time.value += deltaTime;

    render();
    //window.scrollTo(0, 0); // iOS... PERHAPS force landscape mode?
}


function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    // setTimeout(function(){ 
    //     window.scrollTo(0, 0); // for iOS DOESNT WORK...
    // }, 500);
}


    
    

function render() {
    renderer.render( scene, camera );
}
