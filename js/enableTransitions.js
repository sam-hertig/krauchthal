function enableTransitions(module) {

    // Define modifiers and states
    var transitionTime = 4; //in seconds
    var smoothness = 100;
    module.currentStateNr = 0;

    module.modifiers = {
        '0' : (function(v) {module.cas9.position.x = v;}),
        '1' : (function(v) {module.cas9.rotation.x = v;}),
        '2' : (function(v) {module.nucleicAcids.position.y = v;}),
        '3' : (function(v) {module.nucleicAcids.visible = (v>0.5) ? true : false;}),
        '4' : (function(v) {module.conformationalChange(v)}),
    };

    module.states = [
        
        {
            '0' : 0,
            '1' : 0,
            '2' : -5.8371807191324620,
            '3' : 1,
            '4' : 0,
        },

        {
            '0' : 50,
            '1' : 0,
            '2' : -50,
            '3' : 0,
            '4' : 0,
        },

        {
            '0' : 50,
            '1' : 0,
            '2' : -50,
            '3' : 1,
            '4' : 1,
        },        

    ];


    // Transition function 

    module.transitionState = function (targetStateNr, time) { //time in seconds

        // Stop currently active tween
        if (module.tween !== undefined)
            module.tween.stop();

        var origin = {
            '0' : module.cas9.position.x,
            '1' : module.cas9.rotation.x,
            '2' : module.nucleicAcids.position.y,
            '3' : module.nucleicAcids.visible ? 1 : 0,
            '4' : module.cas9.children[3].visible ? 0 : 1, //??? module.state ... 
                                                          
        };                                                
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
            module.transitionState(module.currentStateNr+sign, (sign+1)*transitionTime/2);
        });
    }


    // Conformational change function

    module.conformationalChange = function(p) {

        // 0: 5f9r, rna
        // 1: 4zt0, rna
        // 2: 4cmp
        
        //var vis5f9r = Math.random() > p;
        var vis5f9r = p5.noise(p*smoothness) > p;
        module.cas9.children[3].visible = vis5f9r;
        module.cas9.children[2].visible = !vis5f9r;

        // call brownian!!!

    }



    // Brownian motion (made to look smoother with perlin noise)

    module.brownianMotion = function() {

    }


    return module;
}