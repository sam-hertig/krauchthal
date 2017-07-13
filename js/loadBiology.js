function loadBiology(module) {

	var boxMat = module.materials.rnaMat1;
	var boxGeom = new THREE.BoxGeometry(10, 10, 10);
	var testCube = new THREE.Mesh(boxGeom, boxMat);
	module.scene.add(testCube);

	return module;
}