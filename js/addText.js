function addText(module) {

	module.storyBoxContents = [

        "The CRISPR system (Clustered Regularly Interspaced Short Palindromic Repeats) was first identified in bacteria, where it plays an important role in the immune system. In recent years, molecular biologists have turned the system into a toolbox for genome editing.<br><br>" + 
        "How does a molecular mechanism work that can cut DNA? Two biological macromolecules form the core of the CRISPR system: <span class='cas9'>the CRISPR-associated Protein 9 (Cas9, left)</span>, and <span class='grna'>the guide RNA (gRNA, pink, right)</span>.",

        "While Cas9 can be considered as the molecular scissors that cut DNA, the gRNA serves as the targeting system for Cas9. Inside the cell, the gRNA binds to Cas9 and thus renders Cas9 highly selective for it's target DNA. Upon binding, Cas9 changes it's conformation to accomodate the gRNA, which also converts the inactive protein to it's active state.",

        "The Cas9-gRNA complex is now ready to cut the target DNA. Since the target DNA lives in the <span class='nucleus'>nucleus</span> of a cell, Cas9 will need to be transported into the nucleus.",

        "Transport into the nucleus occurs via a <span class ='nucleus'>nuclear pore complex</span>.",

        "Inside the nucleus, Cas9 needs to locate it's <span class='dna1'>t</span><span class='dna2'>a</span><span class='dna1'>r</span><span class='dna2'>g</span><span class='dna1'>e</span><span class='dna2'>t</span> <span class='dna1'>D</span><span class='dna2'>N</span><span class='dna1'>A</span>, which needs to have a specific sequence of bases.",

        "This stochastic search starts with trying to identify a specific sequence, the PAM-sequence (protospacer adjacent motif), on the target DNA.",

        "The PAM sequence on the target DNA binds to <span class='pamdomain'>the PAM-interacting domain (light blue)</span> on Cas9. Initial binding of the target DNA to Cas9 is accompanied by another conformational change in Cas9.",

        "The bases upstream of the PAM-sequence on the DNA are now in close proximity to the gRNA.",

        "When the sequence of <span class='dna1'>the target strand on the DNA</span> is complimentary to <span class='grna'>the gRNA</span>, Cas9 melts the bases of the DNA and the target DNA strand becomes paired with the gRNA.",

        "Proper DNA-gRNA pairing is required for correctly positioning the DNA for cutting.",

        "<span class='dna1'>The target DNA-strand</span> is cut by amino acids in <span class='hnhdomain'>the HNH domain (salmon) of Cas9</span>, and <span class='dna2'>the non-target DNA strand</span> is cut by protein residues in <span class='ruvcdomain'>the RuvC-domain (lilac) of Cas9</span>.",

        "The gap in the DNA inactivates the corresponding gene. The system can be extended by a custom host DNA fragment, which will get inserted into the gap and thus added as a new gene. All this can take place in a living cell. <br><br>" +
        "For further resources on the CRISPR/Cas9 system, visit <a href='http://pdb101.rcsb.org/motm/181' target='blank'>the website of the Protein Data Bank.</a>",

	];

	return module;
}