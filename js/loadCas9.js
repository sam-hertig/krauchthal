function loadCas9(module) {

    var scale = 10;
    var center;
    
    module.cas9 = new THREE.Object3D();

    function loadMolProm(url) {
        return new Promise(function(succeed, fail) {
            var loader = new THREE.JSONLoader();
            loader.load(url, function(geometry, materials) {
                console.log('Done loading', url, '.');
                succeed({
                    geom: geometry, 
                    mats: materials
                });
            }, function(req) {
                console.log('Loading', url, '...');
            }, function(error) {
                fail(error);
            });
        })
    } 

    loadMolProm('models/crisprV3.2_4cmp.json').then(function(geom_mats_obj) {
        var mol = new THREE.Mesh(geom_mats_obj.geom, geom_mats_obj.mats);
        module.cas9.add(mol);
        mol.visible = false;
        return loadMolProm('models/crisprV3.2_rna.json');
    }).then(function(geom_mats_obj) {
        var mol = new THREE.Mesh(geom_mats_obj.geom, module.materials.rnaMat1);
        module.cas9.add(mol);
        //mol.visible = false;        
        return loadMolProm('models/crisprV3.2_4zt0.json');
    }).then(function(geom_mats_obj) {
        var mol = new THREE.Mesh(geom_mats_obj.geom, geom_mats_obj.mats);
        module.cas9.add(mol);
        mol.visible = false;      
        return loadMolProm('models/crisprV3.2_5f9r.json');
    }).then(function(geom_mats_obj) {
        var mol = new THREE.Mesh(geom_mats_obj.geom, geom_mats_obj.mats);
        module.cas9.add(mol);
        //mol.visible = false;      
        mol.geometry.computeBoundingSphere();
        center = mol.geometry.boundingSphere.center.clone();
        center.multiplyScalar(scale).negate();
    }).catch(function(error) {
        console.log('Failed to load one or more molecules.');
    }).then(function() {
        module.cas9.children.forEach(function(conf) {   // don't use traverse because otherwise floppy RNA will also be transformed 
            if (conf instanceof THREE.Mesh) {
                conf.position.copy(center);
                conf.scale.set(scale,scale,scale);
                conf.brownianDisplacement = 0;
                conf.brownianJumpiness = 1; 
                //conf.visible = false;
            }
        }); 
        module.scene.add(module.cas9);
    });



    return module;
}