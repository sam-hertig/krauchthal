function run(module) {
	
	function animate() {
        module.deltaTime = module.clock.getDelta();
        module.controls.update();
        module.stats.update();
        //module.animateParticles();
        //TWEEN.update();
        //module.nucleus.uniforms.time.value += module.deltaTime;
        module.renderer.render(module.scene, module.camera);
        requestAnimationFrame(animate);
    }

    animate();

}