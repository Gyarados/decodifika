
//////////////////////////////////////////////////////////
//////////// Funcao que configura os botoes //////////////
//////////////////////////////////////////////////////////

function autoSetAttributes(botao, numero, varsH, varsV, iBinario, uBinario, y, x){
	
	botao.setAttribute("id", `${numero}`);
	botao.numero = numero;
	
	botao.X = x;
	botao.Y = y;
	
	let varsHPonto = varsH.split('').join('.');
	let varsVPonto = varsV.split('').join('.');
	let varsVNegadas = [];
	let varsHNegadas = [];
	
	for (let i = 0; i < iBinario.length; i++){
		
		if (varsVPonto[i] != '.' && iBinario[i] == 0){
			
			varsVNegadas[varsVNegadas.length] = varsVPonto[i];
			
		}
		
	}
	
	for (let i = 0; i < varsVNegadas.length; i++){
		
		varsVPonto = varsVPonto.replace(varsVNegadas[i], varsVNegadas[i] + "'");
		
	}
	
	for (let i = 0; i < uBinario.length; i++){
		
		if (varsHPonto[i] != '.' && uBinario[i] == 0){
			
			varsHNegadas[varsHNegadas.length] = varsHPonto[i];
			
		}
		
	}
	
	for (let i = 0; i < varsHNegadas.length; i++){
		
		varsHPonto = varsHPonto.replace(varsHNegadas[i], varsHNegadas[i] + "'");
		
	}
	
	botao.resposta = varsVPonto + "." + varsHPonto;                                                                            // A.B 0 1 
	
	botao.setAttribute("value", "0");
	botao.setAttribute("class", "botoes0");
	botao.innerHTML = "0";
	botao.style.backgroundColor = "lightgray";
	
	botao.onclick = function() {
		
		if (botao.innerHTML == "0"){
			botao.innerHTML = "1";
			botao.setAttribute("value", "1");
			botao.style.backgroundColor = "lightgreen";
			botao.setAttribute("class", "botoes1");
		}
		
		else if (botao.innerHTML == "1"){
			botao.innerHTML = "0";
			botao.setAttribute("value", "0");
			botao.style.backgroundColor = "lightgray";
			botao.setAttribute("class", "botoes0");
		}	
		
		geraRespostaLonga()

	};
}



//////////////////////////////////////////////////////////
//////////// Funcao que gera a tabela do mapa ////////////
//////////////////////////////////////////////////////////

function criaTabela(){
	
	var tabela = document.createElement("TABLE");
	tabela.setAttribute("id", "tabela");
	
	if(document.getElementById("tabela") != null){
		document.getElementById("tabela").parentNode.removeChild(document.getElementById("tabela"));
	}
	
	document.getElementById("respostaLonga-container").innerHTML = "";
	
	let abcd = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
	
	let qntVariaveis = document.querySelector('input[name="QntVar"]:checked').value;  //quantidade de variaveis a serem desenhadas
	
	let qntCasasPL;                                                                   //quantidade de casas a serem desenhadas por linha
	
	let qntLinhas;                                                                    //quantidade de linhas a serem desenhadas
	
	let vars = "";                                                                    //texto das variaveis   
	
	let varsV;
	let varsH;
	
	for(let i = 0; i < qntVariaveis; i++){
	
		vars = vars + abcd[i]; 
	
	}
	
	varsV = vars.slice(0, Math.floor(vars.length / 2));
	varsH = vars.slice(Math.floor(vars.length / 2));
	
	vars = varsV + " | " + varsH;
	
	qntCasasPL = 2**varsH.length;
	
	qntLinhas = 2**varsV.length;
	
	let linhaVariaveis = document.createElement("TR");
	
	let casaVariaveis = document.createElement("TH");
	
	let casaVariaveisText = document.createTextNode(`${vars}`);
	casaVariaveis.appendChild(casaVariaveisText);

	linhaVariaveis.appendChild(casaVariaveis);
	
	let binMaxH = 2**varsH.length - 1;
	binMaxH = binMaxH.toString(2);
	
	let binMaxHLength = binMaxH.length;
	
	for (let i = 0; i < 2**varsH.length; i++){
		
		let iBinario = i ^ (i >>> 1);
		iBinario = iBinario.toString(2);
		let iBinarioLength = iBinario.length;
		
		for (let u = 0; u < binMaxHLength - iBinarioLength; u++){
			
			iBinario = "0" + iBinario;
			
		}
		
		iBinario = iBinario.split('').join(' ');
		
		let casaZeroUm = document.createElement("TD")
		let casaZeroUmText = document.createTextNode(iBinario);
		
		casaZeroUm.appendChild(casaZeroUmText);
		
		linhaVariaveis.appendChild(casaZeroUm);
		
	}
	
	tabela.appendChild(linhaVariaveis);
	
	let binMaxV = 2**varsV.length - 1;
	binMaxV = binMaxV.toString(2);
	
	let binMaxVLength = binMaxV.length;

	let numero = 0;

	for (let i = 0; i < qntLinhas; i++){
		
		let linha = document.createElement("TR");
		
		let iBinario = i ^ (i >>> 1);
		iBinario = iBinario.toString(2);
		let iBinarioLength = iBinario.length;
		
		for (let u = 0; u < binMaxVLength - iBinarioLength; u++){
			
			iBinario = "0" + iBinario;
			
		}
		
		iBinario = iBinario.split('').join(' ');
		
		let casaZeroUm = document.createElement("TD")
		let casaZeroUmText = document.createTextNode(iBinario);
		
		casaZeroUm.appendChild(casaZeroUmText);
		
		linha.appendChild(casaZeroUm);
		
		for (let u = 0; u < qntCasasPL; u++){
			
			let casaTD = document.createElement("TD");
			let casaButton = document.createElement("BUTTON");
			
			let uBinario = tabela.childNodes[0].childNodes[u+1].innerHTML;
			
			autoSetAttributes(casaButton, numero, varsH, varsV, iBinario, uBinario, i, u);

			numero++;
			
			casaTD.appendChild(casaButton);
			
			linha.appendChild(casaTD);
			
		}
		
		tabela.appendChild(linha);
		
	}
	
	document.getElementById("tabela-container").appendChild(tabela);
	
}



/////////////////////////////////////////////////////////////
//////////// Funcao que gera a resposta completa ////////////
/////////////////////////////////////////////////////////////

function geraRespostaLonga(){
	
	let respostaLonga = "F = ";
	
	let array_botoes1 = document.getElementsByClassName("botoes1");
	let array_botoes0 = document.getElementsByClassName("botoes0");
	
	if (array_botoes0.length == 0){
		
		respostaLonga += "1";
		
	}

	else if(array_botoes1.length == 0){
		
		respostaLonga += "0";
		
	}
	
	else{
		
		for (let i = 0; i < array_botoes1.length; i++){
		
			respostaLonga = respostaLonga + array_botoes1[i].resposta + " + ";
		
		}
	
		respostaLonga = respostaLonga.substring(0, respostaLonga.length - 2);
		
	}

	document.getElementById("respostaLonga-container").innerHTML = respostaLonga;
	
}
	
/////////////////////////////////////////////////////////////
//////////// Funcao que gera a resposta reduzida ////////////
/////////////////////////////////////////////////////////////

function geraRespostaReduzida(){
	
	
	
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	











