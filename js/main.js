if (! Detector.webgl) {
    Detector.addGetWebGLMessage();
}   

var visualization = {};
visualization = addMaterials(visualization);
console.log(visualization);
visualization = setup3D(visualization);
console.log(visualization);