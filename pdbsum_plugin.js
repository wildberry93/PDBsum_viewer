var color_dict = {'A':'#cc66ff', 'B':'#ff0000', 'C':'#cc9900', 'D':'#ff69b4', 'E':'#0000ff', 
				'F':'#00ff00', 'G':'#33ccff', 'H':'#ffff00', 'I':'#cc66ff', 'J':'#ff0000', 
				'K':'#cc9900', 'L':'#ff69b4', 'M':'#0000ff', 'N':'#00ff00', 'O':'#33ccff', 
				'P':'#ffff00', 'Q':'#cc66ff', 'R':'#ff0000', 'S':'#cc9900', 'T':'#ff69b4', 
				'U':'#0000ff', 'V':'#00ff00', 'W':'#33ccff', 'X':'#ffff00', 'Y':'#cc66ff', 
				'Z':'#ff0000', '1':'#cc9900', '2':'#ff69b4', '3':'#0000ff', '4':'#00ff00', 
				'5':'#33ccff', '6':'#ffff00', ' ':'#cc66ff', '7':'#ff0000', '8':'#cc9900', 
				'9':'#ff69b4', '0':'#0000ff', '!':'#00ff00', '#':'#33ccff', '_':'#ffff00', 
				'-':'#cc66ff', '=':'#ff0000', ':':'#cc9900', '<':'#ff69b4', '>':'#0000ff', 
				'|':'#00ff00'};

var glviewer = null;
var pdb_file = 'file:///C:/Users/jagoda/Desktop/PDBsum_repo/3aiy.pdb';
var dfn_file = 'file:///C:/Users/jagoda/Desktop/PDBsum_repo/rasmol.dfn';

var apply_styles = function(viewer, dfn_file){
	var chains_prot = [];
	var chains_nuc = [];
	var ligands_res = [];
	var metals_res = [];

	var dfn_f = readFile(dfn_file);
	var splitted = dfn_f.split("\n");

	for (var i = 0; i < splitted.length; i++) {
		if (splitted[i][0] === "P"){			
			chains_prot.push(splitted[i][1]);
		} else if (splitted[i][0] === "N"){
			chains_nuc.push(splitted[i][1]);
		} else if (splitted[i][0] === "l"){
			var regExp = /\(([^)]+)\)/;
			resid = splitted[i].split(" ")[2].split("(")[0]
			chain = regExp.exec(splitted[i])[1];
			ligands_res.push([resid,chain]);
		} else if (splitted[i][0] === "M"){
			metals_res.push(splitted[i].slice(1, splitted.length).split(" ")[0]);
		}
	}

	for (var i = 0; i < chains_prot.length; i++) {
		glviewer.setStyle({chain:chains_prot[i]}, {cartoon:{color:color_dict[chains_prot[i]]}}); // sel chain
	}

	for (var i = 0; i < chains_nuc.length; i++) {
		glviewer.setStyle({chain:chains_nuc[i]}, {stick:{color:color_dict[chains_nuc[i]]}}); // nucleic acid
	}

	for (var i = 0; i < ligands_res.length; i++) {
		glviewer.setStyle({chain:ligands_res[i][1], resi:ligands_res[i][0]}, {sphere:{}}); // ligands
	}

	for (var i = 0; i < metals_res.length; i++) {
		glviewer.setStyle({resn:" "+metals_res[i]}, {sphere: {color: "blue"}} ); // metals resis
	}

}

function readFile(file) {
    var http = new XMLHttpRequest();
    http.open('get', file, false);
    http.send();
    var text = http.responseText;

    return text;
}

$(document).ready(function() {
	// this should be changed later
	file = readFile(pdb_file);

	glviewer = $3Dmol.createViewer("gldiv");

	m = glviewer.addModel(file, "pqr");
	apply_styles(glviewer, dfn_file);
    glviewer.render();
    
    var m = glviewer.getModel();
    var atoms = m.selectedAtoms({});

	glviewer.mapAtomProperties($3Dmol.applyPartialCharges);

	glviewer.setBackgroundColor(0xffffff);

});