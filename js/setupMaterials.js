function setupMaterials(module) {


    module.nucMatUniforms = {  
        time: { type: "f", value: 0.0 },
        speed: { type: "f", value: 0.2 },
        darkening: { type: "f", value: 0 }, //nucleusDarkness
        scale: { type: "f", value: 20 }, 
        contrast: { type: "f", value: 0.2 },       
    };


	module.materials = {

		rnaMat1 : new THREE.MeshPhongMaterial({ 
		    color : 0xDDABFF,
		    specular : 0xFFFFFF,
		    shininess: 5, 
		    side : THREE.DoubleSide, 
		    shading: THREE.SmoothShading
		}),

		rnaMat1m : new THREE.MeshPhongMaterial({ 
		    color : 0xDDABFF,
		    specular : 0xFFFFFF,
		    shininess: 5,
		    morphTargets : true, 
		    morphNormals : true, 
		    side : THREE.DoubleSide, 
		    shading: THREE.SmoothShading
		}),

		dnaMat1m : new THREE.MeshPhongMaterial({ 
		    color : 0x8900E6,
		    specular : 0xFFFFFF,
		    shininess: 10,
		    morphTargets : true, 
		    morphNormals : true, 
		    side : THREE.DoubleSide, 
		    shading: THREE.SmoothShading
		}),

		dnaMat1 : new THREE.MeshPhongMaterial({ 
		    color : 0x8900E6,
		    specular : 0xFFFFFF,
		    shininess: 10,     
		    side : THREE.DoubleSide, 
		    shading: THREE.SmoothShading
		}),

		dnaMat2m : new THREE.MeshPhongMaterial({ 
		    color : 0x2600E6,
		    specular : 0xFFFFFF,
		    shininess: 10,
		    morphTargets : true, 
		    morphNormals : true, 
		    side : THREE.DoubleSide, 
		    shading: THREE.SmoothShading
		}),

		dnaMat2 : new THREE.MeshPhongMaterial({ 
		    color : 0x2600E6,
		    specular : 0xFFFFFF,
		    shininess: 10,    
		    side : THREE.DoubleSide, 
		    shading: THREE.SmoothShading
		}),


		dnaMat3 : new THREE.MeshPhongMaterial({ 
		    color : 0x333333,
		    specular : 0xFFFFFF,
		    shininess: 10,     
		    side : THREE.DoubleSide, 
		    shading: THREE.SmoothShading
		}),

	    innerNucleusMat : new THREE.ShaderMaterial( {  
	        uniforms:       module.nucMatUniforms,
	        vertexShader:   document.getElementById('nucleus-vertex').textContent,
	        fragmentShader: document.getElementById('nucleus-fragment').textContent,
	    }),   

	    npcHolesMat : new THREE.MeshBasicMaterial({
	        color: 0x555555,
	        fog: false
	    }),

	    npcMat : new THREE.MeshLambertMaterial({
	        color: 0xbbbbbb, 
	        fog: false
	    }),

	};

	return module;
}