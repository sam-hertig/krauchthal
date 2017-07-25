function enableTransitions(module) {

    
    var transitionTime = 4; //in seconds
    var rightArrow = document.querySelector(".right");
    var leftArrow = document.querySelector(".left");
    leftArrow.style.display = 'none';
    rightArrow.style.display = 'none';
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
        "Now in the nucleus. Where is the DNA?",
        "Cas9 searches for PAM sequence on DNA.",
        "Once PAM sequence is found, DNA binds and structure of Cas9 changes.",
        "DNA completes binding by unwinding and attaching to guide RNA.",
        "Cas9 cuts DNA.",
        "Cas9 cuts DNA.",
        "Cas9 cuts DNA.",
        "The gap in the DNA can now be used to do insert custom sequences.",
    ];


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
            maxZoom : 500,
            camUpX : -0.55,  
            camUpY : 0.74,
            camUpZ : 0.39,
            camX : -84,
            camY : 193,
            camZ : 40129,
            targX : 21,
            targY : 193,
            targZ : 40041,            
            cas9X : 0,
            cas9Y : 200,
            cas9Z : 40000,
            rnaX : 50,
            rnaY : 200,
            rnaZ : 40050, 
            cas9Conf : 0,
            rnaConf: 0,
        },

        {
            maxZoom : 500,
            camUpX : -0.55,  
            camUpY : 0.74,
            camUpZ : 0.39,            
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
            cas9Conf : 1,
            rnaConf: 0,
        },

        {   
            maxZoom : 1000,
            camUpX : -0.35,  
            camUpY : -0.31,
            camUpZ : 0.88,            
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
            cas9Conf : 1,
            rnaConf: 0,
        },

        {
            maxZoom : 1000,
            camUpX : -0.35,  
            camUpY : -0.31,
            camUpZ : 0.88,            
            camX : -1866,
            camY : -271,
            camZ : 7400,
            targX : -350,
            targY : 0,
            targZ : 6770,            
            cas9X : 0,
            cas9Y : 0,
            cas9Z : 7000,
            rnaX : 0,
            rnaY : 0,
            rnaZ : 7000, 
            cas9Conf : 1,
            rnaConf: 0,            
        },

        {
            maxZoom : 220,
            camUpX : -0.55,   
            camUpY :  0.56,
            camUpZ : 0.61,            
            camX : -109,
            camY : 19,
            camZ : 72,
            targX : 0,
            targY : 0,
            targZ : 0,            
            cas9X : 0,
            cas9Y : 0,
            cas9Z : 0,
            rnaX : 0,
            rnaY : 0,
            rnaZ : 0, 
            cas9Conf : 1,//nr 5
            dnaX: 100,//-500,        
            dnaY: 30,//1000, //-800
            dnaZ: 0,//-500,
            dnaBrownianDisplacement: 0,
            dnaConf: 0,
            rnaConf: 0,            
            dnaCut: 0, 
            dnaPostCut1PosX: -5.8, 
            dnaPostCut1PosY: -5.8,
            dnaPostCut1PosZ: 4.7,
            dnaPostCut2PosX: -5.8,
            dnaPostCut2PosY: -5.8,
            dnaPostCut2PosZ: 4.7,            
        },

        {
            maxZoom : 220,
            camUpX : -0.55,   
            camUpY :  0.56,
            camUpZ : 0.61,  
            camX : -109,
            camY : 19,
            camZ : 72,
            targX : 0,
            targY : 0,
            targZ : 0,            
            cas9X : 0,
            cas9Y : 0,
            cas9Z : 0,
            rnaX : 0,
            rnaY : 0,
            rnaZ : 0, 
            cas9Conf : 1,
            dnaX: 0,       //nr 6
            dnaY: 0,
            dnaZ: 0,
            dnaBrownianDisplacement: 20,
            dnaConf: 0,
            rnaConf: 0,            
            dnaCut: 0, 
            dnaPostCut1PosX: -5.8, 
            dnaPostCut1PosY: -5.8,
            dnaPostCut1PosZ: 4.7,
            dnaPostCut2PosX: -5.8,
            dnaPostCut2PosY: -5.8,
            dnaPostCut2PosZ: 4.7,            
        },

        {
            maxZoom : 220,
            camUpX : -0.55,   
            camUpY :  0.56,
            camUpZ : 0.61,  
            camX : -109,
            camY : 19,
            camZ : 72,
            targX : 0,
            targY : 0,
            targZ : 0,            
            cas9X : 0,
            cas9Y : 0,
            cas9Z : 0,
            rnaX : 0,
            rnaY : 0,
            rnaZ : 0, 
            cas9Conf : 2,
            dnaX: 0,       //nr 7
            dnaY: 0,
            dnaZ: 0,
            dnaBrownianDisplacement: 0,
            dnaConf: 0, 
            rnaConf: 0,            
            dnaCut: 0, 
            dnaPostCut1PosX: -5.8, 
            dnaPostCut1PosY: -5.8,
            dnaPostCut1PosZ: 4.7,
            dnaPostCut2PosX: -5.8,
            dnaPostCut2PosY: -5.8,
            dnaPostCut2PosZ: 4.7,            
        },

        {
            maxZoom : 220,
            camUpX : 0.665,   
            camUpY :  0.643,
            camUpZ : 0.363,              
            camX : -9.696,
            camY : 54.454,
            camZ : -26.963,
            targX : 1.481,
            targY : 3.929,
            targZ : -11.004,            
            cas9X : 0,
            cas9Y : 0,
            cas9Z : 0,
            rnaX : 0,
            rnaY : 0,
            rnaZ : 0, 
            cas9Conf : 2,
            dnaX: 0,       
            dnaY: 0,
            dnaZ: 0,
            dnaBrownianDisplacement: 0,
            dnaConf: 0, //nr 8
            rnaConf: 0,
            dnaCut: 0, 
            dnaPostCut1PosX: -5.8, 
            dnaPostCut1PosY: -5.8,
            dnaPostCut1PosZ: 4.7,
            dnaPostCut2PosX: -5.8,
            dnaPostCut2PosY: -5.8,
            dnaPostCut2PosZ: 4.7,            
        },

        {
            maxZoom : 220,
            camUpX : 0.665,   
            camUpY :  0.643,
            camUpZ : 0.363,              
            camX : -9.696,
            camY : 54.454,
            camZ : -26.963,
            targX : 1.481,
            targY : 3.929,
            targZ : -11.004,           
            cas9X : 0,
            cas9Y : 0,
            cas9Z : 0,
            rnaX : 0,
            rnaY : 0,
            rnaZ : 0, 
            cas9Conf : 2,
            dnaX: 0,       
            dnaY: 0,
            dnaZ: 0,
            dnaBrownianDisplacement: 0,
            dnaConf: 1, //nr 9
            rnaConf: 1,
            dnaCut: 0, 
            dnaPostCut1PosX: -5.8, 
            dnaPostCut1PosY: -5.8,
            dnaPostCut1PosZ: 4.7,
            dnaPostCut2PosX: -5.8,
            dnaPostCut2PosY: -5.8,
            dnaPostCut2PosZ: 4.7,            
        },  

        {
            maxZoom : 220,
            camUpX : -0.009,   
            camUpY :  0.735,
            camUpZ : 0.669,              
            camX : -16.397,
            camY : -6.825,
            camZ : 22.650,
            targX : 3.946,
            targY : 3.703,
            targZ : -9.706,           
            cas9X : 0,
            cas9Y : 0,
            cas9Z : 0,
            rnaX : 0,
            rnaY : 0,
            rnaZ : 0, 
            cas9Conf : 2,
            dnaX: 0,       
            dnaY: 0,
            dnaZ: 0,
            dnaBrownianDisplacement: 0,
            dnaConf: 1, 
            rnaConf: 1, //nr10
            dnaCut: 0, 
            dnaPostCut1PosX: -5.8, 
            dnaPostCut1PosY: -5.8,
            dnaPostCut1PosZ: 4.7,
            dnaPostCut2PosX: -5.8,
            dnaPostCut2PosY: -5.8,
            dnaPostCut2PosZ: 4.7,            
        },

        {
            maxZoom : 220,
            camUpX : -0.009,   
            camUpY :  0.735,
            camUpZ : 0.669,              
            camX : -16.397,
            camY : -6.825,
            camZ : 22.650,
            targX : 3.946,
            targY : 3.703,
            targZ : -9.706,           
            cas9X : 0,
            cas9Y : 0,
            cas9Z : 0,
            rnaX : 0,
            rnaY : 0,
            rnaZ : 0, 
            cas9Conf : 2,
            dnaX: 0,       
            dnaY: 0,
            dnaZ: 0,
            dnaBrownianDisplacement: 0,
            dnaConf: 1,
            rnaConf: 1,
            dnaCut: 1, //nr11
            dnaPostCut1PosX: -5.8, //-5.842881325672321, -5.8371807191324620, 4.6611525722939830
            dnaPostCut1PosY: -5.8,
            dnaPostCut1PosZ: 4.7,
            dnaPostCut2PosX: -5.8,
            dnaPostCut2PosY: -7.1,
            dnaPostCut2PosZ: 5.2,
        },

        {
            maxZoom : 220,
            camUpX : -0.16,   
            camUpY :  0.68,
            camUpZ : 0.71,  
            camX : -97,
            camY : 83,
            camZ : 81,
            targX : 1.6,
            targY : -8.2,
            targZ : -5.8,          
            cas9X : 275,
            cas9Y : 0,
            cas9Z : 0,
            rnaX : 275,
            rnaY : 0,
            rnaZ : 0, 
            cas9Conf : 1,
            dnaX: 0,       
            dnaY: 0,
            dnaZ: 0,
            dnaBrownianDisplacement: 0,
            dnaConf: 1,
            rnaConf: 1,
            dnaCut: 1,
            dnaPostCut1PosX: -5.8,
            dnaPostCut1PosY: -5.8,
            dnaPostCut1PosZ: 4.7,
            dnaPostCut2PosX: -5.8,
            dnaPostCut2PosY: -30,
            dnaPostCut2PosZ: 10,
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
            module.camera.up.copy(module.cameraUp);
        }
    }


    // Define modifers used by transition function
    var modifiers = {

        maxZoom : (function(v) {module.controls.maxDistance = v;}),
        camUpX :  (function(v) {module.camera.up.x = v;}),
        camUpY :  (function(v) {module.camera.up.y = v;}),
        camUpZ :  (function(v) {module.camera.up.z = v;}),        
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
        cas9Conf : (function(v) {
            var rand = Math.random();
            if (v<=1) {
                module.cas9Confs['4cmp'].visible = rand >= v;
                module.cas9Confs['4zt0'].visible = rand <= v;
                module.cas9Confs['5f9r'].visible = false;           
            } else {
                v = v-1;
                module.cas9Confs['4cmp'].visible = false;
                module.cas9Confs['4zt0'].visible = rand >= v;
                module.cas9Confs['5f9r'].visible = rand <= v; 
            }
            module.cas9Confs['4cmp'].brownianDisplacement = (v<0.5) ? 3*v : 3*(1-v); 
            module.cas9Confs['4zt0'].brownianDisplacement = module.cas9Confs['4cmp'].brownianDisplacement;
            module.cas9Confs['5f9r'].brownianDisplacement = module.cas9Confs['4cmp'].brownianDisplacement; 
        }),


        dnaX : (function(v) {module.dna.position.x = v;}),
        dnaY : (function(v) {module.dna.position.y = v;}),
        dnaZ : (function(v) {module.dna.position.z = v;}),
        dnaBrownianDisplacement : (function(v) {module.dna.brownianDisplacement = v}),
        dnaConf : (function(v) {
            module.dna.children[0].children[0].morphTargetInfluences[1] = v;
            module.dna.children[0].children[1].morphTargetInfluences[1] = v;
        }),
        rnaConf : (function(v) {module.naParts['floppyRna'].children[0].morphTargetInfluences[1] = v;}),
        dnaCut : (function(v) {
            module.naParts['dnaPreCut'].visible = (v>0.2) ? false : true;
            module.naParts['dnaPostCut1'].visible = (v<0.2) ? false : true;
            module.naParts['dnaPostCut2'].visible = (v<0.2) ? false : true;
            module.cas9Confs['5f9r'].brownianDisplacement = (v<0.5) ? 1*v : 1*(1-v);
            module.naParts['cutHalos'].children[0].material.opacity = v<0.08 ? 10*v : (v<0.92 ? 0.8 : (10-10*v));
        }),
        dnaPostCut1PosX : (function(v) {module.naParts['dnaPostCut1'].position.x = v;}),
        dnaPostCut1PosY : (function(v) {module.naParts['dnaPostCut1'].position.y = v;}),
        dnaPostCut1PosZ : (function(v) {module.naParts['dnaPostCut1'].position.z = v;}),
        dnaPostCut2PosX : (function(v) {module.naParts['dnaPostCut2'].position.x = v;}),
        dnaPostCut2PosY : (function(v) {module.naParts['dnaPostCut2'].position.y = v;}),
        dnaPostCut2PosZ : (function(v) {module.naParts['dnaPostCut2'].position.z = v;}), 

    };    



    // Global transition function 
    module.transitionState = function(targetState, time) {

        // Stop previous tweens, glowing halos, and brownian motions
        if (tween !== null) {
            tween.stop();
        }
        module.scene.traverse(function(obj) {
            if (obj instanceof THREE.Mesh && obj.brownianDisplacement !== undefined) {
                obj.brownianDisplacement = 0;
            }
        });
        if (module.naParts['cutHalos'] !== undefined) {
            module.naParts['cutHalos'].children[0].material.opacity = 0;    
        }
        

        // Handle arrows and buttons
        leftArrow.style.display = (targetState === 0) ? 'none' : 'block';

        if (targetState === states.length-1) {
            rightArrow.style.display = 'none';
        } else if (!debug) {
            rightArrow.style.display = (document.getElementById(targetState).className === "textbox active") ? 'block' : 'none';
        } else {
            rightArrow.style.display = 'block';
        }
        

        document.getElementById(currentState).className = "textbox active";
        
        // Define origin and target states
        var origin = {
            maxZoom : module.controls.maxDistance,
            camUpX :  module.camera.up.x,
            camUpY :  module.camera.up.y,
            camUpZ :  module.camera.up.z,            
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
            cas9Conf : (module.cas9Confs['4cmp'].visible)   ?   0   :   (module.cas9Confs['4zt0'].visible?1:2),   
            dnaX : module.dna.position.x,
            dnaY : module.dna.position.y,
            dnaZ : module.dna.position.z,
            dnaBrownianDisplacement : module.dna.brownianDisplacement,
            dnaConf : module.dna.children[0].children[0].morphTargetInfluences[1],
            rnaConf : module.naParts['floppyRna'].children[0].morphTargetInfluences[1],
            dnaCut: module.naParts['dnaPreCut'].visible ? 0 : 1,
            dnaPostCut1PosX : module.naParts['dnaPostCut1'].position.x,
            dnaPostCut1PosY : module.naParts['dnaPostCut1'].position.y,
            dnaPostCut1PosZ : module.naParts['dnaPostCut1'].position.z,
            dnaPostCut2PosX : module.naParts['dnaPostCut2'].position.x,
            dnaPostCut2PosY : module.naParts['dnaPostCut2'].position.y,
            dnaPostCut2PosZ : module.naParts['dnaPostCut2'].position.z,             
        };                                                
        var target = states[targetState];

        // Evaluate what needs to be tweened
        var requiredModifiers = [];
        Object.keys(modifiers).forEach(function(key) {
            if ((target[key] != origin[key]) || key.indexOf("camUp") > -1){
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
            if ( (obj instanceof THREE.Mesh || obj instanceof THREE.Object3D)  &&  obj.brownianDisplacement !== undefined  &&  obj.brownianDisplacement !== 0 ) {
                seed = seed*obj.brownianJumpiness;
                displacement = new THREE.Vector3(2*p5.noise(seed)-1, 2*p5.noise(seed + 17)-1, 2*p5.noise(seed + 42)-1);
                displacement.multiplyScalar(obj.brownianDisplacement);
                obj.position.copy(displacement);
            }
        });
    }

    return module;
}