function enableTransitions(module) {

    
    var transitionTime = 4; //in seconds
    var maxBrownianDisplacement = 30;
    var rightArrow = document.querySelector(".right");
    var leftArrow = document.querySelector(".left");
    leftArrow.style.display = 'none';
    var textBox = document.getElementById("storytext");
    var flexBox = document.querySelector(".flex-container");
    var currentState = 0;
    var tween = null;


    // Define story texts and set up text box with state 0:
    var textBoxContents = [
        "Cas9 can cut DNA. Here is how it works.",
        "To do so, Cas9 needs a guide RNA.",
        "Cas9 is now ready to cut some DNA.",
        "It does so within the nucleus.",
        "Now in the nucleus.",
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
            module.transitionState(targetState, (3+sign)*transitionTime/4 );
        });
    }    


    // Set up states
    var states = [        
        {
            camX : -114,
            camY : 207,
            camZ : 40096,
            targX : 11,
            targY : 197,
            targZ : 40035,            
            cas9X : 0,
            cas9Y : 200,
            cas9Z : 40000,
            rnaX : 50,
            rnaY : 200,
            rnaZ : 40050, 
            cas9conf : 0,
        },
        {
            camX : -100,
            camY : 186,
            camZ : 40074,
            targX : 0,
            targY : 200,
            targZ : 40000,            
            cas9X : 0,
            cas9Y : 200,
            cas9Z : 40000,
            rnaX : 0,
            rnaY : 200,
            rnaZ : 40000, 
            cas9conf : 1,
        },
        {
            camX : -162,
            camY : 191,
            camZ : 40537,
            targX : -110,
            targY : 197,
            targZ : 39969,            
            cas9X : 0,
            cas9Y : 200,
            cas9Z : 40000,
            rnaX : 0,
            rnaY : 200,
            rnaZ : 40000, 
            cas9conf : 1,
        },
        {
            camX : -2440,
            camY : 0,
            camZ : 8270,
            targX : -350,
            targY : 0,
            targZ : 6770,            
            cas9X : 0,
            cas9Y : 0,
            cas9Z : 7000,
            rnaX : 0,
            rnaY : 0,
            rnaZ : 7000, 
            cas9conf : 1,
        },
        {
            camX : -100,
            camY : 0,
            camZ : 100,
            targX : 0,
            targY : 0,
            targZ : 0,            
            cas9X : 0,
            cas9Y : 0,
            cas9Z : 0,
            rnaX : 0,
            rnaY : 0,
            rnaZ : 0, 
            cas9conf : 1,
        },          
    ];


    // Create and listen to state button clicks
    states.forEach(function(s, n) {
        var linkButton = document.createElement("div");
        linkButton.className = "textbox inactive";
        linkButton.id = n;
        linkButton.innerHTML = n+1;
        flexBox.appendChild(linkButton);
    })
    document.getElementById("0").className = "textbox active current";
    flexBox.addEventListener("click", onStateClick);
    function onStateClick(event) {
        if (event.target.className === "textbox active" || event.target.className === "textbox active current") {
            var targetState = event.target.innerHTML-1;
            module.transitionState(targetState, 0);
            module.camera.up.set(-0.24, -0.96, 0.13);
        }
    }


    // Define modifers used by transition function
    var modifiers = {
        camX :  (function(v) {module.camera.position.x = v;}),
        camY :  (function(v) {module.camera.position.y = v;}),
        camZ :  (function(v) {module.camera.position.z = v;}),
        targX : (function(v) {module.controls.target.x = v;}),
        targY : (function(v) {module.controls.target.y = v;}),
        targZ : (function(v) {module.controls.target.z = v;}),
        cas9X : (function(v) {module.cas9.position.x = v;}),
        cas9Y : (function(v) {module.cas9.position.y = v;}),
        cas9Z : (function(v) {module.cas9.position.z = v;}),
        rnaX : (function(v) {module.rna.position.x = v;}),
        rnaY : (function(v) {module.rna.position.y = v;}),
        rnaZ : (function(v) {module.rna.position.z = v;}),         
        cas9conf : (function(v) {conformationalChange(v);}),
    };    


    // Conformational change function
    function conformationalChange(p) {

        // 0: 4cmp
        // 1: 4zt0
        // 2: 5f9r

        var rand = Math.random();

        if (p<=1) {
            module.cas9confs['4cmp'].visible = rand >= p;
            module.cas9confs['4zt0'].visible = rand <= p;
            module.cas9confs['5f9r'].visible = false;           
        } else {
            p = p-1;
            module.cas9confs['4cmp'].visible = false;
            module.cas9confs['4zt0'].visible = rand >= p;
            module.cas9confs['5f9r'].visible = rand <= p; 
        }

        module.cas9confs['4cmp'].brownianDisplacement = (p<0.5) ? 2*maxBrownianDisplacement*p : 2*maxBrownianDisplacement*(1-p); 
        module.cas9confs['4zt0'].brownianDisplacement = module.cas9confs['4cmp'].brownianDisplacement;
        module.cas9confs['5f9r'].brownianDisplacement = module.cas9confs['4cmp'].brownianDisplacement;

    }





    // Global transition function 
    module.transitionState = function(targetState, time) {

        // Stop previous tweens and brownian motions
        if (tween !== null) {
            tween.stop();
        }
        
        module.scene.traverse(function(obj) {
            if (obj instanceof THREE.Mesh && obj.brownianDisplacement !== undefined) {
                obj.brownianDisplacement = 0;
            }
        });

        // Handle arrows and buttons
        leftArrow.style.display = (targetState === 0) ? 'none' : 'block';

        if (targetState === states.length-1) {
            rightArrow.style.display = 'none';
        } else {
            rightArrow.style.display = (document.getElementById(targetState).className === "textbox active") ? 'block' : 'none';
        }
        

        document.getElementById(currentState).className = "textbox active";
        
        // Define origin and target states
        var origin = {
            camX :  module.camera.position.x,
            camY :  module.camera.position.y,
            camZ :  module.camera.position.z,
            targX : module.controls.target.x,
            targY : module.controls.target.y,
            targZ : module.controls.target.z,
            cas9X : module.cas9.position.x,
            cas9Y : module.cas9.position.y,
            cas9Z : module.cas9.position.z,
            rnaX : module.rna.position.x,
            rnaY : module.rna.position.y,
            rnaZ : module.rna.position.z, 
            cas9conf : (module.cas9confs['4cmp'].visible === true) ? 0 : 1,                                                         
        };                                                
        var target = states[targetState];

        // Evaluate what needs to be tweened
        var requiredModifiers = [];
        Object.keys(modifiers).forEach(function(key) {
            if (target[key] != origin[key]) {
                requiredModifiers.push(key);
            }
        })
        console.log('Tweening', requiredModifiers.length, 'parameters.');

        // Setup the Tween
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
        
        // Handle text and buttons after tween finishes
        tween.onComplete(function() {
            document.getElementById(currentState).className = "textbox active current";
            rightArrow.style.display = (currentState === states.length-1) ? 'none' : 'block';
            textBox.innerHTML = textBoxContents[currentState];
        });

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