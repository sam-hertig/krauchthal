function setup3D(module) {

    // Scene 
    var scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0xffffff, 0.002); //0.001
    if (!debug) {
        scene.fog = new THREE.Fog(0xffffff, 250, 300);    
    }
    

    // Renderer
    var renderer = new THREE.WebGLRenderer();
    // renderer.setClearColor(scene.fog.color);
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    var container = document.getElementById('webgl-container');
    container.appendChild(renderer.domElement);

    // Camera
    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 50000 );   
    camera.position.set(10, 10, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // var cameraUp = new THREE.Vector3(-0.35, -0.31, 0.88); // cooler Flug
    var cameraUp = new THREE.Vector3(-0.55, 0.56, 0.61);
    camera.up.copy(cameraUp);
    scene.add(camera);

    // Lights   
    var ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);
    var camLight = new THREE.PointLight(0xffffff, 0.4);
    camLight.position.copy(camera.position); 
    camera.add(camLight);
    

    // Camera Controls
    var controls = new THREE.TrackballControls(camera, renderer.domElement);
    if (!debug) {
        controls.noPan = true;      
        //controls.maxDistance = 200;
    }
    controls.zoomSpeed = 0.5;
     
    
    // Resize
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // Clock
    var clock = new THREE.Clock(true);  

    // Stats
    if (debug) {
        var stats = new Stats();
        container.appendChild(stats.dom);        
    }

    // Helper Box with transform controls:
    if (debug) {
        var boxGeom = new THREE.BoxGeometry(10, 10, 10);
        var boxMat = new THREE.MeshLambertMaterial({color: 0x888888});
        var boxMesh = new THREE.Mesh(boxGeom, boxMat);
        scene.add(boxMesh);
        var transControls = new THREE.TransformControls(camera, renderer.domElement);
        transControls.attach(boxMesh);
        scene.add(transControls);    
        module.box = boxMesh;
    }    

    // Helper function for creating white sprites that can mask unwanted spots
    module.createFogCaps = function(vertices, size) {
        var caps = new THREE.Object3D();
        vertices.forEach(function(v) {
            var spriteMap = new THREE.TextureLoader().load("textures/fogCap.png");
            var spriteMaterial = new THREE.SpriteMaterial({
                map: spriteMap,
                color: 0xffffff,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                // depthTest: false,
                fog: false,
                rotation: 0,                
            });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.copy(v);
            sprite.scale.set(size, size, size);
            caps.add(sprite);
        });
        return caps;
    }
  

    // Add properties to module:
    module.clock = clock;
    module.scene = scene; 
    module.renderer = renderer;
    module.camera = camera;
    module.cameraUp = cameraUp;
    module.controls = controls;
    module.stats = stats;

    // Main 3D objects:
    module.cas9 = new THREE.Object3D();
    module.rna = new THREE.Object3D();
    module.floppyRna = null;
    module.cas9Confs = {};    
    module.dna = new THREE.Object3D();

    // Methods
    module.animateNucleus = function () {};
    module.animateBubbles = function () {};
    module.animateBgSprites = function () {};
    module.brownianMotion = function () {};

    module.scene.visible = false;

    return module;

}