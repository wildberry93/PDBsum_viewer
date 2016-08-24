var color_dict = {"A":'#cc66ff', "B": '#ff0000', "C": '#cc9900', "D":'#cc9900',
				 "E":'#ff69b4', "F":'#0000ff', "G":'#00ff00', "H":'#33ccff', 
				 "I":'#ffff00', "J":'#cc66ff', "K":'#ff0000', "L":'#cc9900', 
				 "M":'#ff69b4', "N":'#0000ff', "O":'#00ff00', "P":'#33ccff', 
				 "Q":'#ffff00', "R":'#cc66ff', "S":'#ff0000', "T": '#cc9900', 
				 "U":'#ff69b4', "V":'#0000ff', "W": '#00ff00',"X":'#33ccff', 
				 "Y":'#ffff00', "Z":'#cc66ff', "1":'#ff0000', "2":'#cc9900', 
				 "3":'#ff69b4', "4":'#0000ff', "5":'#00ff00', "6":'#33ccff', 
				 " ":'#ffff00', "7":'#cc66ff', "8":'#ff0000', "9":'#cc9900',
				 "0":'#ff69b4', "!":'#0000ff', "#":'#00ff00', "_":'#33ccff', 
				 "-":'#ffff00', "=":'#cc66ff', ":":'#ff0000', "<":'#cc9900', 
				 ">":'#ff69b4', "|":'#0000ff'}

var glviewer = null;
var labels = [];
var pdb_file = 'file:///C:/Users/jagoda/Desktop/disastr_repo/3fvq.pdb';
var dfn_file = 'file:///C:/Users/jagoda/Desktop/disastr_repo/rasmol.dfn';

var apply_styles = function(viewer){
	var chains_prot = [];
	var chains_nuc = [];
	var ligands_res = {};
	var metals_res = [];

	var dfn_f = readFile(dfn_file);
	var splitted = dfn_f.split("\n");  

	for (var i = 0; i < splitted.length; i++) {
		if (splitted[i][0] === "P"){
			if (splitted[i][1] != mut_chain_id)	{
				chains_prot.push(splitted[i][1]);
			}

		} else if (splitted[i][0] === "N"){
			chains_nuc.push(splitted[i][1]);
		} else if (splitted[i][0] === "l"){
			resid = splitted[i].split(" ")[2].split("(")[0] // need for regexp :-(
			chain = splitted[i].split(" ")[2].split("(")[1][0]
			ligands_res[resid] = chain;
		} else if (splitted[i][0] === "M"){
			metals_res.push(splitted[i].slice(1, splitted.length).split(" ")[0]);
		}
	}

	for (var i = 0; i < chains_prot.length; i++) {
		glviewer.setStyle({chain:chains_prot[i]}, {cartoon:{color:color_dict[chains_prot[i]]}}); // sel chain
	}
	glviewer.setStyle({chain:chains_nuc}, {stick:{}}); // nucleic acid

	for (key in ligands_res) {
		glviewer.setStyle({chain:ligands_res[key], resi:key}, {sphere:{}}); // ligands
	}

	for (var i = 0; i < metals_res.length; i++) {
		glviewer.setStyle({resn:" "+metals_res[i]}, {sphere: {color: "blue"}} ); // metals resis
	}

	//glviewer.addResLabels({chain: mut_chain_id, resi: muts_pos, atom: 'CA'}, 
	//		{fontSize: 13, showBackground: false, fontColor: 'black'}); //muts resis labels resn

}

$(document).ready(function() {

	// this should be changed later
	file = readFile(pdb_file);

	glviewer = $3Dmol.createViewer("gldiv");

	m = glviewer.addModel(file, "pqr");
	apply_styles(glviewer);
    glviewer.render();
    
    var m = glviewer.getModel();
    var atoms = m.selectedAtoms({});

	glviewer.mapAtomProperties($3Dmol.applyPartialCharges);

	glviewer.setBackgroundColor(0xffffff);

});
