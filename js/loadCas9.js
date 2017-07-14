function loadCas9(module) {

    var scale = 10;
    var loadDNA = false;
    
    module.cas9 = {
        containerObject: new THREE.Object3D(),
        center: new THREE.Vector3()
    };


    // Load the three CAS9 structures, gRNA, and DNA:
    var loader_5f9r = new THREE.JSONLoader();
    loader_5f9r.load('models/crisprV3.2_5f9r.json', function (geometry, materials) {

        // Load 5f9r
        var pdb_5f9r = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
        pdb_5f9r.scale.set(scale,scale,scale);

        // Center mol
        pdb_5f9r.geometry.computeBoundingSphere();
        center = pdb_5f9r.geometry.boundingSphere.center.clone();
        center.multiplyScalar(scale).negate();
        pdb_5f9r.position.copy(center);
        //pdb_5f9r.visible = false;
        module.cas9.center = center;
        module.cas9.containerObject.add(pdb_5f9r);

        // Add container object to scene
        module.scene.add(module.cas9.containerObject);
 
        // Load guideRNA
        var loader_gRNA = new THREE.JSONLoader();
        loader_gRNA.load('models/crisprV3.2_rna.json', function (geometry, materials) {
            gRNA = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            gRNA.material = module.materials.rnaMat1;
            gRNA.scale.set(scale,scale,scale);        
            gRNA.position.copy(center);
            //gRNA.visible = false;
            module.cas9.containerObject.add(gRNA);
        });

        // Load DNA to align dynamic DNA (for debugging only)
        if (loadDNA) {
            var loader_gDNA = new THREE.JSONLoader();
            loader_gDNA.load('models/crisprV3.2_dna.json', function (geometry, materials) {
                gDNA = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
                gDNA.material = module.materials.dnaMat3;
                gDNA.scale.set(scale,scale,scale);     
                gDNA.position.copy(center);
                module.cas9.containerObject.add(gDNA);
            });            
        }
        
        // Load 4zt0
        var loader_4zt0 = new THREE.JSONLoader();
        loader_4zt0.load('models/crisprV3.2_4zt0.json', function (geometry, materials) {
            pdb_4zt0 = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            pdb_4zt0.scale.set(scale,scale,scale);     
            pdb_4zt0.position.copy(center);
            pdb_4zt0.visible = false;
            module.cas9.containerObject.add(pdb_4zt0);

            // Load 4cmp
            var loader_4cmp = new THREE.JSONLoader();
            loader_4cmp.load('models/crisprV3.2_4cmp.json', function (geometry, materials) {
                pdb_4cmp = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
                pdb_4cmp.scale.set(scale,scale,scale);     
                pdb_4cmp.position.copy(center);
                pdb_4cmp.visible = false;
                module.cas9.containerObject.add(pdb_4cmp);
            }); 

        });

    });

    return module;
}