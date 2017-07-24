function run(module) {
    
    function animate() {
        if (debug) { 
            console.log('camUp', module.camera.up.x, module.camera.up.y, module.camera.up.z);
            console.log('cam', module.camera.position.x, module.camera.position.y, module.camera.position.z);
            console.log('target', module.controls.target.x, module.controls.target.y, module.controls.target.z);
            console.log('box', module.box.position.x, module.box.position.y, module.box.position.z);
            module.stats.update();            
        }
        module.controls.update();
        module.renderer.render(module.scene, module.camera);
        module.deltaTime = module.clock.getDelta();
        module.animateNucleus();
        module.animateBubbles();
        module.animateBgSprites();
        module.brownianMotion();
        TWEEN.update();
        requestAnimationFrame(animate);
    }

    animate();

}