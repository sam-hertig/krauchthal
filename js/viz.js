if (! Detector.webgl) {
    Detector.addGetWebGLMessage();
}   

// Module augmentation pattern:
var p5 = new p5();
var visualization = {};
visualization = setup3D(visualization);
visualization = setupMaterials(visualization);
visualization = loadCas9(visualization);
visualization = createNucleicAcids(visualization);
visualization = createNucleus(visualization);
visualization = createAmbiance(visualization);
visualization = enableTransitions(visualization);
run(visualization);

