function enableTransitions(module) {

    // Define modifiers and states

    module.currentStateNr = 0;

    module.modifiers = {
        '0' : (function(v) {module.cas9.containerObject.position.x = v}),
        '1' : (function(v) {module.cas9.containerObject.rotation.x = v}),
        '2' : (function(v) {module.nucleicAcids.position.y = v}),
        '3boolean' : (function(b) {module.nucleicAcids.visible = b}),
    };

    module.states = [
        
        {
            '0' : 0,
            '1' : 0,
            '2' : -5.8371807191324620,
            '3boolean' : true,

        },

        {
            '0' : 50,
            '1' : 0,
            '2' : -50,
            '3boolean' : false,
        }

    ];


    // Transition function 

    module.transitionState = function (targetStateNr, time) { //time in seconds


        var origin = {
            '0' : module.cas9.containerObject.position.x,
            '1' : module.cas9.containerObject.rotation.x,
            '2' : module.nucleicAcids.position.y,
            '3boolean' : module.nucleicAcids.visible,
        };
        var target = module.states[targetStateNr];

        var requiredModifiers = [];
        var requiredSwitches = [];
        
        Object.keys(module.modifiers).forEach(function(key) {
            if (target[key] != origin[key]) {
                if (key.indexOf('boolean') === -1) {
                    requiredModifiers.push(key);
                } else {
                    requiredSwitches.push(key);
                }
            }
        })

        
        console.log('Tweening', requiredModifiers.length, 'parameters.');
        console.log('Switching', requiredSwitches.length, 'parameters.');

        var tween = new TWEEN.Tween(origin).to(target, time*1000);

        var transition = function() {
            requiredModifiers.forEach(function(key) {
                module.modifiers[key](origin[key]);
            });
        }

        tween.onUpdate(transition);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.start();
        //tween.onComplete(function() {
        module.currentStateNr = targetStateNr;
        requiredSwitches.forEach(function(key) {
            module.modifiers[key](target[key]);
        })
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


    



    return module;
}