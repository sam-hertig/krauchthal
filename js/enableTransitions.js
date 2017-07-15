function enableTransitions(module) {

    // Define modifiers and states

    module.currentStateNr = 0;

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


    // Transition function 

    module.transitionState = function (targetStateNr, time) { //time in seconds


        var origin = {
            '0' : module.cas9.containerObject.position.x,
            '1' : module.cas9.containerObject.rotation.x,
            '2' : module.nucleicAcids.position.y,
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
            //console.log(module.cas9.containerObject.position.x);
            requiredModifiers.forEach(function(key) {
                module.modifiers[key](origin[key]);
            });
        }

        tween.onUpdate(transition);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.start();
        //tween.onComplete(function() {
        module.currentStateNr = targetStateNr;
        //});

        

    }


    // Activate arrows



    document.querySelector(".right").addEventListener("click", onClick(1));
    document.querySelector(".left").addEventListener("click", onClick(-1));
    function onClick(sign) {
        return (function(event) {
            // console.log(module.currentStateNr, module.currentStateNr+sign);
            module.transitionState(module.currentStateNr+sign, 5);
        });
    }



    // setTimeout(function() {
    //     module.transitionState(module.states[0], module.states[1], 3);    
    // }, 5000);
    



    return module;
}