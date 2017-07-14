function createNucleus(module) {

    var scale = 4;
    var radius = 1500; // 3000, 1500
    var nrOfNpc = 150; // 2000, 100
    var npcRadius = 30; // 60
    var holeRadius = npcRadius*1.2; 


    function createNucleus() {

        var positions = [];
        var allNpcsGeom = new THREE.Geometry();

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
            pos.multiplyScalar(radius+npcRadius/10);

            npcMesh.position.copy(pos);
            npcMesh.quaternion.copy(quat);
            npcMesh.updateMatrix();
            allNpcsGeom.merge(npcMesh.geometry, npcMesh.matrix);

            holeMesh.position.copy(pos);
            holeMesh.quaternion.copy(quat);
            holeMesh.updateMatrix();
            holesGeom.merge(holeMesh.geometry, holeMesh.matrix);

            Theta = 2*Math.PI*Math.random();
            Phi = Math.acos(1 - 2*Math.random());    

        }     
        
        var allNpcsBufferGeom = new THREE.BufferGeometry().fromGeometry(allNpcsGeom);
        var holesBufferGeom = new THREE.BufferGeometry().fromGeometry(holesGeom);

        var allNpcs = new THREE.Mesh(allNpcsGeom, module.materials.npcMat);
        var holes = new THREE.Mesh(holesBufferGeom, module.materials.holesMat);

        var innerNucleusBufferGeom = new THREE.SphereBufferGeometry(radius-npcRadius, 32, 32);
        var innerNucleus = new THREE.Mesh(innerNucleusBufferGeom, module.materials.innerNucleusMat);
        innerNucleus.scale.set(-1, 1, 1);
        innerNucleus.rotation.order = 'XZY';  

        var outerNucleusBufferGeom = new THREE.SphereBufferGeometry(radius, 32, 32);
        var outerNucleus = new THREE.Mesh(outerNucleusBufferGeom, module.materials.innerNucleusMat);  

        // var outlineMat = new THREE.MeshLambertMaterial({
        //     color: 0xffffff, 
        //     side: THREE.BackSide, 
        //     fog: false,
        //     transparent: true,
        //     opacity: 0.4
        // });
        // var outlineGeom = outerNucleusBufferGeom.clone();
        // var outline = new THREE.Mesh(outlineGeom, outlineMat);
        // outline.scale.set(1.003, 1.003, 1.003);

        var nucleus = new THREE.Object3D();
        nucleus.add(outerNucleus, allNpcs, holes, innerNucleus);

        nucleus.scale.set(scale, scale, scale);

        return nucleus;
        
    }



    module.nucleus = createNucleus();
    module.scene.add(module.nucleus);    


    return module;
}