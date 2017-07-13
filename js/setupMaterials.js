function setupMaterials(module) {

	module.materials = {};

	// Create RNA material 1
	module.materials.rnaMat1 = new THREE.MeshPhongMaterial({ 
	    color : 0xDDABFF,
	    specular : 0xFFFFFF,
	    shininess: 5, 
	    side : THREE.DoubleSide, 
	    shading: THREE.SmoothShading
	});
	module.materials.rnaMat1m = new THREE.MeshPhongMaterial({ 
	    color : 0xDDABFF,
	    specular : 0xFFFFFF,
	    shininess: 5,
	    morphTargets : true, 
	    morphNormals : true, 
	    side : THREE.DoubleSide, 
	    shading: THREE.SmoothShading
	});

	// Create DNA material 1 
	module.materials.dnaMat1m = new THREE.MeshPhongMaterial({ 
	    color : 0x8900E6,
	    specular : 0xFFFFFF,
	    shininess: 10,
	    morphTargets : true, 
	    morphNormals : true, 
	    side : THREE.DoubleSide, 
	    shading: THREE.SmoothShading
	});
	module.materials.dnaMat1 = new THREE.MeshPhongMaterial({ 
	    color : 0x8900E6,
	    specular : 0xFFFFFF,
	    shininess: 10,     
	    side : THREE.DoubleSide, 
	    shading: THREE.SmoothShading
	});
	module.materials.dnaMat3 = new THREE.MeshPhongMaterial({ 
	    color : 0x333333,
	    specular : 0xFFFFFF,
	    shininess: 10,     
	    side : THREE.DoubleSide, 
	    shading: THREE.SmoothShading
	});

	// Create DNA material 2
	module.materials.dnaMat2m = new THREE.MeshPhongMaterial({ 
	    color : 0x2600E6,
	    specular : 0xFFFFFF,
	    shininess: 10,
	    morphTargets : true, 
	    morphNormals : true, 
	    side : THREE.DoubleSide, 
	    shading: THREE.SmoothShading
	});
	module.materials.dnaMat2 = new THREE.MeshPhongMaterial({ 
	    color : 0x2600E6,
	    specular : 0xFFFFFF,
	    shininess: 10,    
	    side : THREE.DoubleSide, 
	    shading: THREE.SmoothShading
	});	

	return module;
}