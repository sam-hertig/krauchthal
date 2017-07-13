if (! Detector.webgl) {
    Detector.addGetWebGLMessage();
}   

var visualization = {};
visualization = setup3D(visualization);
visualization = setupMaterials(visualization);
visualization = loadBiology(visualization);
run(visualization);

