function enableTransitions(module) {



    module.states = [
        
        {
            x : 0,
            y : -5.8371807191324620,
        },

        {
            x : 50,
            y : -50,
        }

    ];



    module.transitionState = function (origin, target, time) { //time in seconds

        var tween = new TWEEN.Tween(origin).to(target, time*1000);

        var transition = function() {
            module.cas9.containerObject.position.x = origin.x;
            module.nucleicAcids.position.y = origin.y;
        }

        tween.onUpdate(transition);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.start();


    }


    setTimeout(function() {
        module.transitionState(module.states[0], module.states[1], 3);    
    }, 5000);
    



    return module;
}