function createAmbiance(module) {

    var nrOfBubbles = 500;
    var bubbleSphereRadius = 200;
    var nrOfBgSprites = 6;
    var bgSpriteSphereRadius = 1000;

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




    function createBgSprites(nrOfBgSprites, radius) {

        var initPositions = [];
        var Theta = 0, Phi =0;
        var x, y, z, pos;

        for (var j=0; j<nrOfBgSprites; j++) {

            x = Math.sin(Phi) * Math.cos(Theta);
            y = Math.sin(Phi) * Math.sin(Theta);
            z = Math.cos(Phi); 
            pos = new THREE.Vector3(x, y, z);
            pos.multiplyScalar(radius);
            initPositions.push(pos);

            Theta = 2*Math.PI*Math.random();
            Phi = Math.acos(1 - 2*Math.random());    

        }

        console.log(initPositions);

        return new THREE.Object3D();
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

    module.bgSprites = createBgSprites(nrOfBgSprites, bgSpriteSphereRadius);
    module.scene.add(module.bgSprites);

    return module;
}