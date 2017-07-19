function enableTransitions(module) {

    
    var transitionTime = 4; //in seconds
    var maxBrownianDisplacement = 10;
    var rightArrow = document.querySelector(".right");
    var leftArrow = document.querySelector(".left");
    leftArrow.style.display = 'none';
    var textBox = document.getElementById("storytext");
    var flexBox = document.querySelector(".flex-container");
    var currentState = 0;
    var tween = null;


    // Define story texts and set up text box with state 0:
    var textBoxContents = [
        "Cas9 cuts DNA. It's really nice. Cas9 cuts DNA. It's really nice. Cas9 cuts DNA. It's really nice. Cas9 cuts DNA. It's really nice. Cas9 cuts DNA. It's really nice. Cas9 cuts DNA. It's really nice. Cas9 cuts DNA. It's really nice. Cas9 cuts DNA. It's really nice. Cas9 cuts DNA. It's really nice. ",
        "To do so, Cas9 needs a guide RNA.",
        "Cas9 is now ready to cut some DNA. It does so within the nucleus.",
        "Cas9 searches for PAM sequence on DNA.",
        "Once PAM sequence is found, DNA binds and structure of Cas9 changes.",
        "DNA completes binding by unwinding and attaching to guide RNA.",
        "Cas9 cuts DNA.",
        "The gap in the DNA can now be used to do insert custom sequences.",
    ];
    textBox.innerHTML = textBoxContents[0];


    // Listen to arrow clicks
    rightArrow.addEventListener("click", onArrowClick(1));
    leftArrow.addEventListener("click", onArrowClick(-1));
    function onArrowClick(sign) {
        return (function(event) {
            var targetState = currentState+sign;
            // leftArrow.style.display = (targetState === 0) ? 'none' : 'block';
            // rightArrow.style.display = (targetState === states.length-1) ? 'none' : 'block';
            transitionState(targetState, (sign+1)*transitionTime/2);
        });
    }    


    // Set up states
    var states = [
        
        {
            0 : 0,
            1 : 0,
            2 : -5.8371807191324620,
            3 : 1,
            4 : 0,
        },

        {
            0 : 50,
            1 : 0,
            2 : -50,
            3 : 0,
            4 : 0,
        },

        {
            0 : 50,
            1 : 0,
            2 : -50,
            3 : 1,
            4 : 1,
        },        

    ];


    // Create and listen to state button clicks
    states.forEach(function(s, n) {
        var linkButton = document.createElement("div");
        linkButton.className = "textbox inactive";
        // linkButton.className = "textbox active";
        linkButton.id = n;
        linkButton.innerHTML = n+1;
        flexBox.appendChild(linkButton);
    })
    document.getElementById("0").className = "textbox active current";
    flexBox.addEventListener("click", onStateClick);
    function onStateClick(event) {
        var targetState = event.target.innerHTML-1;
        if (event.target.className === "textbox active") {
            transitionState(targetState, 0);
        }
    }


    // Define modifers used by transition function
    var modifiers = {
        0 : (function(v) {module.cas9.position.x = v;}),
        1 : (function(v) {module.cas9.rotation.x = v;}),
        2 : (function(v) {module.nucleicAcids.position.y = v;}),
        3 : (function(v) {module.nucleicAcids.visible = (v>0.5) ? true : false;}),
        4 : (function(v) {conformationalChange(v)}),
    };    


    // Transition function 
    function transitionState(targetState, time) {

        if (tween !== null)
        tween.stop();

        leftArrow.style.display = (targetState === 0) ? 'none' : 'block';
        rightArrow.style.display = (targetState === states.length-1) ? 'none' : 'block';
        document.getElementById(currentState).className = "textbox active";
        document.getElementById(targetState).className = "textbox active current";
        //console.log(document.getElementById(currentState), document.getElementById(targetState));

        var origin = {
            0 : module.cas9.position.x,
            1 : module.cas9.rotation.x,
            2 : module.nucleicAcids.position.y,
            3 : module.nucleicAcids.visible ? 1 : 0,
            4 : module.cas9.children[3].visible ? 0 : 1, //??? module.state ... 
                                                          
        };                                                
        var target = states[targetState];

        var requiredModifiers = [];
        
        Object.keys(modifiers).forEach(function(key) {
            if (target[key] != origin[key]) {
                requiredModifiers.push(key);
            }
        })

        console.log('Tweening', requiredModifiers.length, 'parameters.');

        tween = new TWEEN.Tween(origin).to(target, time*1000);

        var transition = function() {
            requiredModifiers.forEach(function(key) {
                modifiers[key](origin[key]);
            });
        }

        tween.onUpdate(transition);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.start();
        currentState = targetState;        
        
        tween.onComplete(function() {
            textBox.innerHTML = textBoxContents[currentState];
        });

    }



    // Conformational change function
    function conformationalChange(p) {
        // 0: 5f9r, rna
        // 1: 4zt0, rna
        // 2: 4cmp
        var pdb5f9r = module.cas9.children[3];
        var pdb4zt0 = module.cas9.children[2];
        //var vis5f9r = p5.noise(p*smoothness) > p;
        pdb5f9r.visible = Math.random() > p;
        pdb4zt0.visible = !pdb5f9r.visible;
        pdb5f9r.brownianDisplacement = (p<0.5) ? 2*maxBrownianDisplacement*p : 2*maxBrownianDisplacement*(1-p); 
        pdb4zt0.brownianDisplacement = pdb5f9r.brownianDisplacement;
    }



    // Global Brownian motion function (made to look smoother with perlin noise)
    module.brownianMotion = function() {
        var seed = module.clock.getElapsedTime();
        var displacement;
        module.scene.traverse(function(obj) {
            if (obj instanceof THREE.Mesh && obj.brownianDisplacement !== undefined && obj.brownianDisplacement !== 0) {
                seed = seed*obj.brownianJumpiness;
                displacement = new THREE.Vector3(2*p5.noise(seed)-1, 2*p5.noise(seed + 17)-1, 2*p5.noise(seed + 42)-1);
                displacement.multiplyScalar(obj.brownianDisplacement);
                obj.position.copy(displacement);
            }
        });
    }


    return module;
}