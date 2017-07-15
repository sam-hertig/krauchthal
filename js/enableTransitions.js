function enableTransitions(module) {


    module.modifiers = {
        '0' : (function(v) {module.cas9.containerObject.position.x = v}),
        '1' : (function(v) {module.cas9.containerObject.rotation.x = v}),
        '2' : (function(v) {module.nucleicAcids.position.y = v}),
    };


    module.states = [
        
        {
            '0' : 0,
            '1' : 0,
            '2' : -5.8371807191324620,

        },

        {
            '0' : 50,
            '1' : 0,
            '2' : -50,
        }

    ];



    module.transitionState = function (origin, target, time) { //time in seconds

        var tween = new TWEEN.Tween(origin).to(target, time*1000);

        var transition = function() {
            //console.log(module.cas9.containerObject.position.x);
            module.modifiers['0'](origin['0']);
            module.modifiers['1'](origin['1']);
            module.modifiers['2'](origin['2']);

            Object.keys(module.modifiers).forEach(function(key) {
                if (target[key] != origin[key]) {
                    module.modifiers[key](origin[key]); //somehow turn that into a factory for the transition function so it
                    // needs to create the function once

                    // CONTINUE HERE...

                }
            })

        }

        tween.onUpdate(transition);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.start();

        console.log(Object.keys(module.modifiers));

    }


    setTimeout(function() {
        module.transitionState(module.states[0], module.states[1], 3);    
    }, 5000);
    



    return module;
}