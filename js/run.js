function run(module) {
    
    function animate() {
        
        module.controls.update();
        module.stats.update();
        module.renderer.render(module.scene, module.camera);

        module.deltaTime = module.clock.getDelta();
        module.materials.nucMatUniforms.time.value += module.deltaTime;

        //module.animateParticles();
        //TWEEN.update();
        
        requestAnimationFrame(animate);
    }

    animate();

}