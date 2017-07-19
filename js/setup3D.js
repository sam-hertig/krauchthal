function setup3D(module) {

    // Scene 
    var scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0xffffff, 0.002); //0.001
    scene.fog = new THREE.Fog(0xffffff, 250, 300); // 300

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
    camera.up.set(0.3,0.9,0.2);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); 
    camera.position.set(0, 0, 150);
    scene.add(camera);

    // Lights   
    var ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);
    var camLight = new THREE.DirectionalLight(0xffffff, 0.5);
    camLight.position.set(0, 0, 0); 
    camLight.lookAt(new THREE.Vector3(0, 0, 0));
    camera.add(camLight);

    // Camera Controls
    var controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.maxDistance = 200;
    controls.zoomSpeed = 0.5;
    controls.noPan = true;   
    
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
    var stats = new Stats();
    container.appendChild(stats.dom);

    // Helper Box with transform controls:
    // var boxGeom = new THREE.BoxGeometry(10, 10, 10);
    // var boxMat = new THREE.MeshLambertMaterial();
    // var boxMesh = new THREE.Mesh(boxGeom, boxMesh);
    // scene.add(boxMesh);
    // var transControls = new THREE.TransformControls(camera, renderer.domElement);
    // transControls.attach(boxMesh);
    // scene.add(transControls);    
    // module.box = boxMesh;

    // Add properties and methods to module:
    module.clock = clock;
    module.scene = scene; 
    module.renderer = renderer;
    module.camera = camera;
    module.controls = controls;
    module.stats = stats;
    return module;

}