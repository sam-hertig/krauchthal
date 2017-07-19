function run(module) {
    
    function animate() {
        
        module.controls.update();
        module.stats.update();
        module.renderer.render(module.scene, module.camera);

        module.deltaTime = module.clock.getDelta();
        module.nucMatUniforms.time.value += module.deltaTime;

        module.animateParticles(module.bubbles);
        module.brownianMotion();

        TWEEN.update();
        
        requestAnimationFrame(animate);
    }

    animate();

}