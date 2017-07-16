function enableTransitions(module) {

    // Define modifiers and states

    module.currentStateNr = 0;

    module.modifiers = {
        '0' : (function(v) {module.cas9.containerObject.position.x = v;}),
        '1' : (function(v) {module.cas9.containerObject.rotation.x = v;}),
        '2' : (function(v) {module.nucleicAcids.position.y = v;}),
        '3' : (function(v) {module.nucleicAcids.visible = (v<0.5) ? true : false;console.log(v);})
    };

    module.states = [
        
        {
            '0' : 0,
            '1' : 0,
            '2' : -5.8371807191324620,
            '3' : 0,
        },

        {
            '0' : 50,
            '1' : 0,
            '2' : -50,
            '3' : 1.0,
        }

    ];


    // Transition function 

    module.transitionState = function (targetStateNr, time) { //time in seconds

        // Stop currently active tween
        if (module.tween !== undefined)
            module.tween.stop();

        var origin = {
            '0' : module.cas9.containerObject.position.x,
            '1' : module.cas9.containerObject.rotation.x,
            '2' : module.nucleicAcids.position.y,
            '3' : module.nucleicAcids.visible ? 0.1 : 0.9, //could also check for module.state if necessary
                                                           //avoiding 1 and 0 will ensure that it is always tweened
        };                                                 //but might not be necessary
        var target = module.states[targetStateNr];

        var requiredModifiers = [];
        
        Object.keys(module.modifiers).forEach(function(key) {
            if (target[key] != origin[key]) {
                requiredModifiers.push(key);
            }
        })

        console.log('Tweening', requiredModifiers.length, 'parameters.');

        var tween = new TWEEN.Tween(origin).to(target, time*1000);

        var transition = function() {
            requiredModifiers.forEach(function(key) {
                module.modifiers[key](origin[key]);
            });
        }

        tween.onUpdate(transition);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.start();
        module.currentStateNr = targetStateNr;
        module.tween = tween;
        //tween.onComplete(function() {

    }

    // Activate arrows
    document.querySelector(".right").addEventListener("click", onClick(1));
    document.querySelector(".left").addEventListener("click", onClick(-1));
    function onClick(sign) {
        return (function(event) {
            module.transitionState(module.currentStateNr+sign, (sign+1)*2);
        });
    }

    return module;
}