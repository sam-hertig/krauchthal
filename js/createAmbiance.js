function createAmbiance(module) {

    function createFogCaps() {
        var capsGeom = new THREE.Geometry();            
        capsGeom.vertices = [
            new THREE.Vector3(132.47850306191188, 112.87494579739156, -188.99734163163194),
            new THREE.Vector3(-132.28641467717367, -212.01072905633762, 52.681448121595665),
            new THREE.Vector3(0, -5000, 0),
            new THREE.Vector3(0, 5000, 0),
        ];
        var loader = new THREE.TextureLoader();
        var texture = loader.load("textures/dnaCap.png");  
        var capsMat = new THREE.PointsMaterial({
            color: 0xffffff, 
            size: 1000,
            sizeAttenuation: false,
            map: texture,
            blending: THREE.NormalBlending, //AdditiveBlending, NormalBlending
            transparent: true,
            opacity: 1,
            depthTest: true,
            fog: false,
        });
        return new THREE.Points(capsGeom, capsMat);
    }
    var caps = createFogCaps();
    module.scene.add(caps);



    var nrOfBubbles = 1000;
    var bubbleSphereRadius = 200;

    // Alternative: have only a small area of bubbles always in front of the camera,
    // and animate faster (and randomly) when camera is being moved
    function createBubbles(nrOfBubbles, radius) {
        var bubblesGeom = new THREE.Geometry();
        for (var p = 0; p < nrOfBubbles; p++) {
            var x = (2*Math.random()-1) * radius;
            var y = (2*Math.random()-1) * radius;
            var z = (2*Math.random()-1) * radius;   
            var bubblePos = new THREE.Vector3(x, y, z);
            bubblesGeom.vertices.push(bubblePos);
        }
        var loader = new THREE.TextureLoader();
        var texture = loader.load("textures/circle.png");  
        var bubbleMat = new THREE.PointsMaterial({
            color: 0xffffff, 
            size: 4,
            map: texture,
            blending: THREE.NormalBlending, //AdditiveBlending, NormalBlending
            transparent: true,
            opacity: 0.5,
            depthTest: true,
            fog: false,
        });
        return new THREE.Points(bubblesGeom, bubbleMat);
    }


    module.animateParticles = function(particleSystem) {
        var verts = particleSystem.geometry.vertices;
        for(var i = 0; i < verts.length; i++) {
            var vert = verts[i];
            if (vert.y > bubbleSphereRadius) {
                vert.y = (2*Math.random()-1) * bubbleSphereRadius;
            }
            vert.y = vert.y + (3.0 * module.deltaTime);
        }
        particleSystem.geometry.verticesNeedUpdate = true;
        particleSystem.rotation.y -= 0.03 * module.deltaTime;
    }

    module.bubbles = createBubbles(nrOfBubbles, bubbleSphereRadius);
    module.scene.add(module.bubbles);

    return module;
}