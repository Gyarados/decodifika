
function converteDecBin(decimal, numMax){
	
	let binario = "";
	
	while(numMax > 0){
		binario = (numMax % 2) + binario;
		numMax = Math.floor(numMax / 2);
	}
	
	numMax = binario.length;
	
	binario = "";
	
	if (decimal == 0){
		
		for(let i = 0; i < numMax; i++){
			
			binario += " 0";
		}
		
		return binario;
	}
	
	if (decimal == 1){
		
		for(let i = 0; i < numMax - 1; i++){
			
			binario += " 0";
		}
		
		binario += " 1";
		
		return binario;
	}
	
	while (decimal > 0){
		binario = " " + (decimal % 2) + binario;
		decimal = Math.floor(decimal / 2);
	}
	
	let diferen = numMax - (binario.length / 2);
	
	for (let i = 0; i < diferen; i++){
		
		binario = " 0" + binario;
		
	}
	
	return binario;
}


function criaTabela(){
	
	if(document.getElementById("tabIndex") != null){
		document.getElementById("tabIndex").parentNode.removeChild(document.getElementById("tabIndex"));
	}
	
				
	var tab = document.createElement("TABLE");
	tab.setAttribute("id", "tabIndex");
				
	var tr0 = document.createElement("TR");
	tr0.setAttribute("id", "tr0");
	
	var bitsVia = document.createElement("TH");
	bitsVia.setAttribute("id", "bitsVia");
	
	var bitsViaText = document.createTextNode("Bits da via de endereço");
	
	var endHex = document.createElement("TH");
	endHex.setAttribute("id", "endHex");
	
	var endHexText = document.createTextNode("Endereço Hexadecimal");
	
	var emDec = document.createElement("TH");
	emDec.setAttribute("id", "emDec");
	
	var emDecText = document.createTextNode("Em Decimal");
	
	var td1 = document.createElement("TD");
	td1.setAttribute("id", "td1");
	
	bitsVia.appendChild(bitsViaText);
	endHex.appendChild(endHexText);
	emDec.appendChild(emDecText);
	tr0.appendChild(td1);
	tr0.appendChild(bitsVia);
	tr0.appendChild(endHex);
	tr0.appendChild(emDec);
	tab.appendChild(tr0);

	let qntMem = document.querySelector('input[name="qntMem"]:checked').value;
	
	let tipoMem = document.querySelector('input[name="tipoMem"]:checked').value;

	for(let i = 0; i < qntMem; i++){
		
		let casa7 = document.createElement("TD");
		let casa8 = document.createElement("TD");
		
		
		let rowIni = document.createElement("TR");
		let rowFin = document.createElement("TR");
		rowFin.setAttribute("class", "rowFin");
		let casa1 = document.createElement("TD");
		
		let casa2 = document.createElement("TD");
		let span2red = document.createElement("SPAN");
		span2red.style.color = "red";
		let span2black = document.createElement("SPAN");
		span2black.style.color = "black";
		
		let casa3 = document.createElement("TD");
		let span3black = document.createElement("SPAN");
		span3black.style.color = "black";
		
		let casa4 = document.createElement("TD");
		
		let casa5 = document.createElement("TD");
		let span5red = document.createElement("SPAN");
		span5red.style.color = "red";
		let span5black = document.createElement("SPAN");
		span5black.style.color = "black";
		
		let casa6 = document.createElement("TD");
		let span6black = document.createElement("SPAN");
		span6black.style.color = "black";
		
		let textTdInicial = document.createTextNode("Início");
		casa1.appendChild(textTdInicial);
		
		let textTdFinal = document.createTextNode("Fim");
		casa4.appendChild(textTdFinal);
		
		rowIni.appendChild(casa1);
		rowFin.appendChild(casa4);
		
		let indexIniRed = "";
		let indexFinRed = "";
			
		if (qntMem != 1){
			indexIniRed += converteDecBin(i, qntMem - 1);
			indexFinRed += converteDecBin(i, qntMem - 1);
		}
		
		span2red.innerHTML = indexIniRed;
		span5red.innerHTML = indexFinRed;
		
		let indexIni = "";
		let indexFin = "";
		
		for (let j = 0; j < tipoMem; j++){
			
			indexIni += " 0";
			indexFin += " 1";
			
		}
		
		let indexHexIni = parseInt((indexIniRed + indexIni).replace(/\s/g,''), 2).toString(16).toUpperCase() + "h";
		let indexHexFin = parseInt((indexFinRed + indexFin).replace(/\s/g,''), 2).toString(16).toUpperCase() + "h";
		
		span2black.innerHTML = indexIni;
		span5black.innerHTML = indexFin;
		
		
		span3black.innerHTML = indexHexIni;
		span6black.innerHTML = indexHexFin;
		
		let indexDecIni = parseInt((indexIniRed + indexIni).replace(/\s/g,''), 2);
		let indexDecFin = parseInt((indexFinRed + indexFin).replace(/\s/g,''), 2);
		
		let casa7Text = document.createTextNode(`${indexDecIni}`);
		let casa8Text = document.createTextNode(`${indexDecFin}`);
		
		casa7.appendChild(casa7Text);
		casa8.appendChild(casa8Text);
		
		casa2.appendChild(span2red);
		casa2.appendChild(span2black);
		casa5.appendChild(span5red);
		casa5.appendChild(span5black);
		
		casa3.appendChild(span3black);
		
		casa6.appendChild(span6black);
		
		rowIni.appendChild(casa2);
		rowIni.appendChild(casa3);
		rowIni.appendChild(casa7);
		
		rowFin.appendChild(casa5);
		rowFin.appendChild(casa6);
		rowFin.appendChild(casa8);
		
		tab.appendChild(rowIni);
		tab.appendChild(rowFin);
		
	}

	

	document.getElementById("tabelaIndex").appendChild(tab);

}