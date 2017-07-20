function run(module) {
    
    function animate() {
        //console.log(module.camera.position.x, module.camera.position.y, module.camera.position.z);
        //console.log(module.box.position);
        module.controls.update();
        module.stats.update();
        module.renderer.render(module.scene, module.camera);
        module.deltaTime = module.clock.getDelta();
        module.nucMatUniforms.time.value += module.deltaTime;
        module.animateBubbles();
        module.animateBgSprites();
        module.brownianMotion();
        TWEEN.update();
        requestAnimationFrame(animate);
    }

    animate();

}