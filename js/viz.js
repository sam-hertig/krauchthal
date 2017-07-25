if (! Detector.webgl) {
    Detector.addGetWebGLMessage();
}   

var debug = false;
var p5 = new p5();

// Module augmentation pattern:
var viz = {};
viz = setup3D(viz);
viz = setupMaterials(viz);
viz = loadCas9(viz); 											
viz = createNucleicAcids(viz); 
viz = createNucleus(viz); 
viz = createAmbiance(viz); 				
viz = enableTransitions(viz);
run(viz);

