function loadCas9(module) {

    var scale = 10;
    var center = new THREE.Vector3(0, 0, 0);

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

    loadMolProm('models/crisprV5.1_hires_4cmp.json').then(function(geom_mats_obj) {
        var mol = new THREE.Mesh(geom_mats_obj.geom, geom_mats_obj.mats);
        //var mol = new THREE.Object3D();
        //mol.visible = false;
        module.cas9.add(mol);
        module.cas9Confs['4cmp'] = mol;
        return loadMolProm('models/crisprV5.1_rna.json');
    }).then(function(geom_mats_obj) {
        var mol = new THREE.Mesh(geom_mats_obj.geom, module.materials.rnaMat1);
        //var mol = new THREE.Object3D();
        module.rna.add(mol);
    //     return loadMolProm('models/crisprV5.1_dna.json');
    // }).then(function(geom_mats_obj) {
    //     var mol = new THREE.Mesh(geom_mats_obj.geom, module.materials.rnaMat1);
    //     //var mol = new THREE.Object3D();
    //     module.rna.add(mol);
        return loadMolProm('models/crisprV5.1_hires_4zt0.json');
    }).then(function(geom_mats_obj) {
        var mol = new THREE.Mesh(geom_mats_obj.geom, geom_mats_obj.mats);
        //var mol = new THREE.Object3D();
        mol.visible = false;
        module.cas9.add(mol);
        module.cas9Confs['4zt0'] = mol;
        return loadMolProm('models/crisprV5.1_hires_5f9r.json');
    }).then(function(geom_mats_obj) {
        var mol = new THREE.Mesh(geom_mats_obj.geom, geom_mats_obj.mats);
        //var mol = new THREE.Object3D();
        module.cas9.add(mol);
        mol.visible = false;
        module.cas9Confs['5f9r'] = mol;
        mol.geometry.computeBoundingSphere();
        if (mol.geometry !== undefined) {
            center = mol.geometry.boundingSphere.center.clone();
            center.multiplyScalar(scale).negate();
        }
    }).catch(function(error) {
        console.log('Failed to load one or more molecules.');
    }).then(function() {
        module.cas9.children.forEach(function(conf) { 
            if (conf instanceof THREE.Mesh) {

                conf.position.copy(center);
                conf.scale.set(scale,scale,scale);

                conf.material[0].fog = false;
                
                conf.brownianDisplacement = 0;
                conf.brownianJumpiness = 100; 

                // "bake" transformations to allow brownian motion around 0,0,0:
                conf.updateMatrix();
                conf.geometry.applyMatrix( conf.matrix );
                conf.position.set( 0, 0, 0 );
                conf.rotation.set( 0, 0, 0 );
                conf.scale.set( 1, 1, 1 );
                conf.updateMatrix();

            }
        });
        module.rna.children.forEach(function(fixRna) {   // don't use traverse because otherwise floppy RNA will also be transformed 
            if (fixRna instanceof THREE.Mesh) {

                fixRna.position.copy(center);
                fixRna.scale.set(scale,scale,scale);              

            }
        });

   //      if (debug) {
   //      	var control = new THREE.TransformControls(module.camera, module.renderer.domElement);
   //      	control.attach(module.cas9);
   //      	module.scene.add(control);
			// window.addEventListener( 'keydown', function ( event ) {
			// 	switch ( event.keyCode ) {
			// 		case 81: // Q
			// 			control.setSpace( control.space === "local" ? "world" : "local" );
			// 			break;
			// 		case 17: // Ctrl
			// 			control.setTranslationSnap( 100 );
			// 			control.setRotationSnap( THREE.Math.degToRad( 15 ) );
			// 			break;
			// 		case 87: // W
			// 			control.setMode( "translate" );
			// 			break;
			// 		case 69: // E
			// 			control.setMode( "rotate" );
			// 			break;
			// 		case 82: // R
			// 			control.setMode( "scale" );
			// 			break;
			// 		case 187:
			// 		case 107: // +, =, num+
			// 			control.setSize( control.size + 0.1 );
			// 			break;
			// 		case 189:
			// 		case 109: // -, _, num-
			// 			control.setSize( Math.max( control.size - 0.1, 0.1 ) );
			// 			break;
			// 	}
			// });
			// window.addEventListener( 'keyup', function ( event ) {
			// 	switch ( event.keyCode ) {
			// 		case 17: // Ctrl
			// 			control.setTranslationSnap( null );
			// 			control.setRotationSnap( null );
			// 			break;
			// 	}
			// });        	    
   //      }

        // Finalize
        module.scene.add(module.cas9);
        module.scene.add(module.rna);
		module.transitionState(0, 0);
        module.scene.visible = true;
    });

    return module;
}