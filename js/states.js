// textbox: div with rounded corners at bottom of screen, centered horizontally, white semitransparent
// labels like in myo tutorial (cas9 subdomains, gRNA, nucleus, one nulear pore, DNA), toggable visibility


var states = [

	{
		id: 0,
		text: "Cas9 cuts DNA. It's really nice.",
		camPos: new THREE.Vector3(0, 0, 0),
		camTarg: new THREE.Vector3(0, 0, 0),
		cas9Pos: new THREE.Vector3(0, 0, 0),
		cas9Conf: "4cmp",
		guideRnaPos: new THREE.Vector3(-1000, 0, 0), // local coords (child of cas9)

		dnaShown: false,
		dnaPos: new THREE.Vector3(-1110, 0, 0),
		dnaBrownian: false,	
		dnaUnwound: false,
		
		dnaPart1Shown: false,
		dnaPart2Shown: false,
		dnaPart1Pos: new THREE.Vector3(0, 0, 0),
		dnaPart2Pos: new THREE.Vector3(0, 0, 0),	
	},

	{
		id: 1,
		text: "To do so, Cas9 needs a guide RNA",
		camPos: new THREE.Vector3(0, 0, 0),
		camTarg: new THREE.Vector3(0, 0, 0),
		cas9Pos: new THREE.Vector3(0, 0, 0),
		cas9Conf: "4zt0",
		guideRnaPos: new THREE.Vector3(0, 0, 0), // local coords (child of cas9)
		
		dnaShown: false,
		dnaPos: new THREE.Vector3(-1110, 0, 0),
		dnaBrownian: false,	
		dnaUnwound: false,
		
		dnaPart1Shown: false,
		dnaPart2Shown: false,
		dnaPart1Pos: new THREE.Vector3(0, 0, 0),
		dnaPart2Pos: new THREE.Vector3(0, 0, 0),
	},

	{
		id: 2,
		text: "Cas9 is now ready to cut some DNA. It does so within the nucleus",
		camPos: new THREE.Vector3(500, 0, 0),
		camTarg: new THREE.Vector3(400, 0, 0),
		cas9Pos: new THREE.Vector3(440, 0, 0),
		cas9Conf: "4zt0",
		guideRnaPos: new THREE.Vector3(0, 0, 0), // local coords (child of cas9)

		dnaShown: false,
		dnaPos: new THREE.Vector3(-1110, 0, 0),
		dnaBrownian: false,	
		dnaUnwound: false,
		
		dnaPart1Shown: false,
		dnaPart2Shown: false,
		dnaPart1Pos: new THREE.Vector3(0, 0, 0),
		dnaPart2Pos: new THREE.Vector3(0, 0, 0),	
	},

	{
		id: 3,
		text: "Cas9 searches for PAM sequence on DNA.",
		camPos: new THREE.Vector3(500, 0, 0),
		camTarg: new THREE.Vector3(400, 0, 0),
		cas9Pos: new THREE.Vector3(440, 0, 0),
		cas9Conf: "4zt0",
		guideRnaPos: new THREE.Vector3(0, 0, 0), // local coords (child of cas9)

		dnaShown: true,
		dnaPos: new THREE.Vector3(0, 0, 0),
		dnaBrownian: true,
		dnaUnwound: false,
		
		dnaPart1Shown: false,
		dnaPart2Shown: false,
		dnaPart1Pos: new THREE.Vector3(0, 0, 0),
		dnaPart2Pos: new THREE.Vector3(0, 0, 0),	
	},

	{
		id: 4,
		text: "Once PAM sequence is found, DNA binds and structure of Cas9 changes.",
		camPos: new THREE.Vector3(500, 0, 0),
		camTarg: new THREE.Vector3(400, 0, 0),
		cas9Pos: new THREE.Vector3(440, 0, 0),
		cas9Conf: "5f9r",
		guideRnaPos: new THREE.Vector3(0, 0, 0), // local coords (child of cas9)

		dnaShown: true,
		dnaPos: new THREE.Vector3(0, 0, 0),
		dnaBrownian: false,
		dnaUnwound: false,
		
		dnaPart1Shown: false,
		dnaPart2Shown: false,
		dnaPart1Pos: new THREE.Vector3(0, 0, 0),
		dnaPart2Pos: new THREE.Vector3(0, 0, 0),	
	},

	{
		id: 5,
		text: "DNA completes binding by unwinding and attaching to guide RNA.",
		camPos: new THREE.Vector3(500, 0, 0),
		camTarg: new THREE.Vector3(400, 0, 0),
		cas9Pos: new THREE.Vector3(440, 0, 0),
		cas9Conf: "5f9r",
		guideRnaPos: new THREE.Vector3(0, 0, 0), // local coords (child of cas9)

		dnaShown: true,
		dnaPos: new THREE.Vector3(0, 0, 0),
		dnaBrownian: false,
		dnaUnwound: true,
		
		dnaPart1Shown: false,
		dnaPart2Shown: false,
		dnaPart1Pos: new THREE.Vector3(0, 0, 0),
		dnaPart2Pos: new THREE.Vector3(0, 0, 0),
	},

	{
		id: 6,
		text: "Cas9 cuts DNA.",
		camPos: new THREE.Vector3(500, 0, 0),
		camTarg: new THREE.Vector3(400, 0, 0),
		cas9Pos: new THREE.Vector3(440, 0, 0),
		cas9Conf: "5f9r",
		guideRnaPos: new THREE.Vector3(0, 0, 0), // local coords (child of cas9)

		dnaShown: false,
		dnaPos: new THREE.Vector3(0, 0, 0),
		dnaBrownian: false,
		dnaUnwound: true,
		
		dnaPart1Shown: true,
		dnaPart2Shown: true,
		dnaPart1Pos: new THREE.Vector3(20, 0, 0),
		dnaPart2Pos: new THREE.Vector3(-20, 0, 0),
	},

	{
		id: 7,
		text: "The gap in the DNA can now be used to...",
		camPos: new THREE.Vector3(500, 0, 0),
		camTarg: new THREE.Vector3(400, 0, 0),
		cas9Pos: new THREE.Vector3(-3000, 0, 0),
		cas9Conf: "5f9r",
		guideRnaPos: new THREE.Vector3(0, 0, 0), // local coords (child of cas9)

		dnaShown: false,
		dnaPos: new THREE.Vector3(0, 0, 0),
		dnaBrownian: false,
		dnaUnwound: true,
		
		dnaPart1Shown: true,
		dnaPart2Shown: true,
		dnaPart1Pos: new THREE.Vector3(20, 0, 0),
		dnaPart2Pos: new THREE.Vector3(-20, 0, 0),
	}

];

