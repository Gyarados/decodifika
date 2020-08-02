			var qnt;
			var j = 0;
			
			function quatroBits(seq){
	
				let eqred = "F(A, B, C, D) = ";
				
				let casas = [];
				
				let duplinhasH = [];
				let duplinhasV = [];
				
				let linhasH = [];
				let duplasLinhaH = [];
				
				let linhasV = [];
				let duplasLinhaV = [];
				
				let quads = [];
				let duplasQuad = [];
				
				let octos = [];
				let quadsOcto = [];
				let linhasOcto = [];
				
				let singles = [];
				
				let bits = [
					"A'.B'.C'.D' ",
					"A'.B'.C'.D ",
					"A'.B'.C.D ",
					"A'.B'.C.D' ",
					"A'.B.C'.D' ",
					"A'.B.C'.D ",
					"A'.B.C.D ",
					"A'.B.C.D' ",
					"A.B.C'.D' ",
					"A.B.C'.D ",
					"A.B.C.D ",
					"A.B.C.D' ",
					"A.B'.C'.D' ",
					"A.B'.C'.D ",
					"A.B'.C.D ",
					"A.B'.C.D' "
				]
				
				for (let i = 0; i < 4; i++){
					
					for (let j = 0; j < 4; j++){
						
						let casa = {
						
							"name" : `casa${i}${j}`,
							"bits" : null,
							"valor" : null,
							"dir" : null,
							"cima" : null,
							"assignH" : "unassigned",
							"assignV" : "unassigned",
							"status" : 0
								
						};
						
						casas[casas.length] = casa	
					}
				}
				
				for (let i = 0; i < casas.length; i++){
					
					if(i != 3 && i != 7 && i != 11 && i != 15){
						casas[i].dir = casas[i+1];
					}
					else{	
						casas[i].dir = casas[i-3];
					}
					
					casas[i].valor = seq[i];
					
					if(i != 12 && i != 13 && i != 14 && i != 15){			
						casas[i].cima = casas[i+4];
					}
					else{
						casas[i].cima = casas[i-12];
					}
				
					casas[i].bits = bits[i];
				}
				
				function linhaFinder(arrayDuplasH, arrayDuplasV){
					
					if (arrayDuplasH.length >= 4){
						
						for (let i = 0; i < arrayDuplasH.length - 3; i++){
							
							if (arrayDuplasH[i][1].name == arrayDuplasH[i+1][0].name && arrayDuplasH[i+1][1].name == arrayDuplasH[i+2][0].name && arrayDuplasH[i+2][1].name == arrayDuplasH[i+3][0].name && arrayDuplasH[i+3][1].name == arrayDuplasH[i][0].name){
								
								linhasH[linhasH.length] = [arrayDuplasH[i][0], arrayDuplasH[i+1][0], arrayDuplasH[i+2][0], arrayDuplasH[i+3][0]];
								
								for (let j = 0; j < 4; j++){
									duplasLinhaH[duplasLinhaH.length] = arrayDuplasH[i+j];
								}
							}	
						}
					}

					if (arrayDuplasV.length >= 4){
						
						for (let i = 0; i < 4; i++){
							
							if(casas[i].valor == "1" && casas[i].cima.valor == "1" && casas[i].cima.cima.valor == "1" && casas[i].cima.cima.cima.valor == "1"){
								
								linhasV[linhasV.length] = [casas[i], casas[i].cima, casas[i].cima.cima, casas[i].cima.cima.cima];
								
								duplasLinhaV[duplasLinhaV.length] = [casas[i], casas[i].cima];
								duplasLinhaV[duplasLinhaV.length] = [casas[i].cima, casas[i].cima.cima];
								duplasLinhaV[duplasLinhaV.length] = [casas[i].cima.cima, casas[i].cima.cima.cima];
								duplasLinhaV[duplasLinhaV.length] = [casas[i].cima.cima.cima, casas[i]];
								
							}
						}
					}
				}

				function quadFinder(arrayDuplasV){
					
					for (let i = 0; i < arrayDuplasV.length; i++){
						
						for (let j = 0; j < arrayDuplasV.length; j++){
							
							if(arrayDuplasV[i][0].dir.name == arrayDuplasV[j][0].name){
								
								quads[quads.length] = [arrayDuplasV[i][0], arrayDuplasV[j][0], arrayDuplasV[i][1], arrayDuplasV[j][1]];
								
								duplasQuad[duplasQuad.length] = arrayDuplasV[i];
								duplasQuad[duplasQuad.length] = arrayDuplasV[j];
								duplasQuad[duplasQuad.length] = [arrayDuplasV[i][0], arrayDuplasV[j][0]];
								duplasQuad[duplasQuad.length] = [arrayDuplasV[i][1], arrayDuplasV[j][1]];			
								
							}
						}
					}
				}
				
				function octoFinder(arrayLinhasH, arrayLinhasV){
					
					for (let i = 0; i < arrayLinhasV.length; i++){
						
						for (let j = 0; j < arrayLinhasV.length; j++){
							
							if(arrayLinhasV[i][0].dir.name == arrayLinhasV[j][0].name){			
								
								let tempoArray = [];
								for (let k = 0; k < arrayLinhasV[i].length; k++){
									
									tempoArray[tempoArray.length] = arrayLinhasV[i][k];
									tempoArray[tempoArray.length] = arrayLinhasV[j][k];
									
								}
								octos[octos.length] = tempoArray;
								
								linhasOcto[linhasOcto.length] = arrayLinhasV[i];
								linhasOcto[linhasOcto.length] = arrayLinhasV[j];
								
								quadsOcto[quadsOcto.length] = [arrayLinhasV[i][0], arrayLinhasV[j][0], arrayLinhasV[i][1], arrayLinhasV[j][1]];
								quadsOcto[quadsOcto.length] = [arrayLinhasV[i][1], arrayLinhasV[j][1], arrayLinhasV[i][2], arrayLinhasV[j][2]];
								quadsOcto[quadsOcto.length] = [arrayLinhasV[i][2], arrayLinhasV[j][2], arrayLinhasV[i][3], arrayLinhasV[j][3]];
								quadsOcto[quadsOcto.length] = [arrayLinhasV[i][3], arrayLinhasV[j][3], arrayLinhasV[i][0], arrayLinhasV[j][0]];
								
							}
						}
					}
					
					for (let i = 0; i < arrayLinhasH.length; i++){
						
						for (let j = 0; j < arrayLinhasH.length; j++){
							
							if(arrayLinhasH[i][0].cima.name == arrayLinhasH[j][0].name){			
								
								let tempoArray = [];
								for (let k = 0; k < arrayLinhasH[i].length; k++){
									
									tempoArray[tempoArray.length] = arrayLinhasH[i][k];
									tempoArray[tempoArray.length] = arrayLinhasH[j][k];
									
								}
								octos[octos.length] = tempoArray;
								
								linhasOcto[linhasOcto.length] = arrayLinhasH[j];
								linhasOcto[linhasOcto.length] = arrayLinhasH[i];
								
								quadsOcto[quadsOcto.length] = [arrayLinhasH[i][0], arrayLinhasH[i][1], arrayLinhasH[j][0], arrayLinhasH[j][1]];
								quadsOcto[quadsOcto.length] = [arrayLinhasH[i][1], arrayLinhasH[i][2], arrayLinhasH[j][1], arrayLinhasH[j][2]];
								quadsOcto[quadsOcto.length] = [arrayLinhasH[i][2], arrayLinhasH[i][3], arrayLinhasH[j][2], arrayLinhasH[j][3]];
								quadsOcto[quadsOcto.length] = [arrayLinhasH[i][3], arrayLinhasH[i][0], arrayLinhasH[j][3], arrayLinhasH[j][0]];
								
							}
						}
					}
				}
				
				function deletaTUDO(){
					
					for (let duplaQuad of duplasQuad){
						
						for (let i = 0; i < duplinhasH.length; i++){
							
							if (duplaQuad[0].name == duplinhasH[i][0].name && duplaQuad[1].name == duplinhasH[i][1].name){
								duplinhasH.splice(i, 1);
							}
						}

						for (let i = 0; i < duplinhasV.length; i++){
							
							if (duplaQuad[0].name == duplinhasV[i][0].name && duplaQuad[1].name == duplinhasV[i][1].name){
								duplinhasV.splice(i, 1);
							}
						}
					} 
					
					for (let duplaLinhaH of duplasLinhaH){
						
						for (let i = 0; i < duplinhasH.length; i++){
							
							if (duplaLinhaH[0].name == duplinhasH[i][0].name && duplaLinhaH[1].name == duplinhasH[i][1].name){
								duplinhasH.splice(i, 1);
							}
						}
					}
					
					for (let duplaLinhaV of duplasLinhaV){
						
						for (let i = 0; i < duplinhasV.length; i++){
							
							if (duplaLinhaV[0].name == duplinhasV[i][0].name && duplaLinhaV[1].name == duplinhasV[i][1].name){
								duplinhasV.splice(i, 1);
							}
						}
					}
					
					for (let quadOcto of quadsOcto){
						
						for (let i = 0; i < quads.length; i++){
							
							if (quadOcto[0].name == quads[i][0].name && quadOcto[1].name == quads[i][1].name && quadOcto[2].name == quads[i][2].name && quadOcto[3].name == quads[i][3].name){
								quads.splice(i, 1);	
							}	
						}
					}
					
					for (let linhaOcto of linhasOcto){
						
						for (let i = 0; i < linhasH.length; i++){
							
							if(linhaOcto[0].name == linhasH[i][0].name && linhaOcto[1].name == linhasH[i][1].name && linhaOcto[2].name == linhasH[i][2].name && linhaOcto[3].name == linhasH[i][3].name){
								
								linhasH.splice(i, 1);
							}
						}
						
						for (let i = 0; i < linhasV.length; i++){
							
							if(linhaOcto[0].name == linhasV[i][0].name && linhaOcto[1].name == linhasV[i][1].name && linhaOcto[2].name == linhasV[i][2].name && linhaOcto[3].name == linhasV[i][3].name){
								
								linhasV.splice(i, 1);
							}
						}
					}
					
					for (let i = 0; i < duplinhasV.length; i++){
						if (duplinhasV[i][0].assignH == "assigned" && duplinhasV[i][0].assignV == "assigned" && duplinhasV[i][1].assignH == "assigned" && duplinhasV[i][1].assignV == "assigned"){
										
						duplinhasV[i][0].assignV = "unassigned";
						duplinhasV[i][1].assignV = "unassigned";
						duplinhasV.splice(i, 1);
									
						}
					}
					
					for (let i = 0; i < duplinhasH.length; i++){
						if (duplinhasH[i][0].assignV == "assigned" && duplinhasH[i][0].assignH == "assigned" && duplinhasH[i][1].assignV == "assigned" && duplinhasH[i][1].assignH == "assigned"){
										
						duplinhasH[i][0].assignH = "unassigned";
						duplinhasH[i][1].assignH = "unassigned";
						duplinhasH.splice(i, 1);
									
						}
					}
					
					for (let i = 0; i < duplinhasH.length; i++){
									
						if (duplinhasH[i][0].assignV == "assigned"){
										
							for (let j = 0; j < duplinhasH.length; j++){
											
								if (duplinhasH[i][1].name == duplinhasH[j][0].name){
									duplinhasH.splice(i, 1);
									j = 99;
												
								}
							}
						}
									
						if (duplinhasH[i][1].assignV == "assigned"){
										
							for (let j = 0; j < duplinhasH.length; j++){
											
								if (duplinhasH[i][0].name == duplinhasH[j][1].name){
									duplinhasH.splice(i, 1);
									j = 99;
												
								}
							}
						}
					}
					
					for (let i = 0; i < duplinhasV.length; i++){
									
						if (duplinhasV[i][0].assignH == "assigned"){
										
							for (let j = 0; j < duplinhasV.length; j++){
											
								if (duplinhasV[i][1].name == duplinhasV[j][0].name){
									duplinhasV.splice(i, 1);
									j = 99;
												
								}
							}
						}
									
						if (duplinhasV[i][1].assignH == "assigned"){
										
							for (let j = 0; j < duplinhasV.length; j++){
											
								if (duplinhasV[i][0].name == duplinhasV[j][1].name){
									duplinhasV.splice(i, 1);
									j = 99;
												
								}
							}
						}
					}
				}
				
				function escreveTUDO(){
					
					for (let i = 0; i < singles.length; i++){
						
						eqred = eqred + singles[i].bits + "+ ";
						
					}
					
					for (let i = 0; i < duplinhasH.length; i++){	
									
						let textoDuplaHRedux; 
									
						let lengthzinha = Math.min(duplinhasH[i][0].bits.length, duplinhasH[i][1].bits.length)
						for (let j = 0; j < lengthzinha; j++){
							if (duplinhasH[i][0].bits[j] != duplinhasH[i][1].bits[j]){
											
											
								if(duplinhasH[i][0].bits[j] == "'"){
													
									textoDuplaHRedux = duplinhasH[i][1].bits; 
								}	
								else {
									textoDuplaHRedux = duplinhasH[i][0].bits; 
								}

								if (textoDuplaHRedux[j] == " "){
									textoDuplaHRedux = textoDuplaHRedux.slice(0, textoDuplaHRedux.length - 3) + " ";
								}
								else if (textoDuplaHRedux[j] == "."){
									textoDuplaHRedux = textoDuplaHRedux.slice(0, j - 1) + textoDuplaHRedux.slice(j + 1);
								}
								j = 99;
							}	
						}
						
						eqred = eqred + textoDuplaHRedux + "+ ";
					}
					
					for (let i = 0; i < duplinhasV.length; i++){	
									
						let textoDuplaVRedux; 
									
						let lengthzinha = Math.min(duplinhasV[i][0].bits.length, duplinhasV[i][1].bits.length)
						for (let j = 0; j < lengthzinha; j++){
							if (duplinhasV[i][0].bits[j] != duplinhasV[i][1].bits[j]){
											
											
								if(duplinhasV[i][0].bits[j] == "'"){
													
									textoDuplaVRedux = duplinhasV[i][1].bits; 
								}	
								else {
									textoDuplaVRedux = duplinhasV[i][0].bits; 
								}

								if (textoDuplaVRedux[j] == " "){
									textoDuplaVRedux = textoDuplaVRedux.slice(0, textoDuplaVRedux.length - 3) + " ";
								}
								else if (textoDuplaVRedux[j] == "."){
									textoDuplaVRedux = textoDuplaVRedux.slice(0, j - 1) + textoDuplaVRedux.slice(j + 1);
								}
								j = 99;
							}	
						}
						
						eqred = eqred + textoDuplaVRedux + "+ ";
					}
					
					for (let i = 0; i < linhasH.length; i++){
						
						let textoLinhaHRedux = linhasH[i][0].bits.slice(0, linhasH[i][0].bits.length - 7) + " + ";
						
						eqred = eqred + textoLinhaHRedux;
						
					}
					
					for (let i = 0; i < linhasV.length; i++){
						
						let textoLinhaVRedux = linhasV[i][0].bits.slice(6) + " + ";
						
						eqred = eqred + textoLinhaVRedux;
						
					}
					
					for (let i = 0; i < quads.length; i++){
						
						let textoQuadReduxArray = [];
						let textoQuadRedux = "";
						let thicc = {};
						
						
						for (let j = 0; j < 4; j++){
							for (let n = 0; n < quads[i][j].bits.length; n++){
								
								if (quads[i][j].bits[n] == " " && quads[i][j].bits[n-1] == "'"){
									
									textoQuadReduxArray[textoQuadReduxArray.length] = quads[i][j].bits.slice(n-2, n);
									
								}
								else if (quads[i][j].bits[n] == " " && quads[i][j].bits[n-1] != "'"){
									
									textoQuadReduxArray[textoQuadReduxArray.length] = quads[i][j].bits.slice(n-1, n);
								}
							
								else if (quads[i][j].bits[n] == "." && quads[i][j].bits[n-1] != "'"){
									
									textoQuadReduxArray[textoQuadReduxArray.length] = quads[i][j].bits.slice(n-1, n);
								}
								else if (quads[i][j].bits[n] == "." && quads[i][j].bits[n-1] == "'"){
									
									textoQuadReduxArray[textoQuadReduxArray.length] = quads[i][j].bits.slice(n-2, n);
								}
								
							}
							
						}
						
						
						
						for (let j = 0; j < textoQuadReduxArray.length; j++){
							
							let elemento = textoQuadReduxArray[j];
							
							
							if (typeof thicc[elemento] === 'undefined'){
								thicc[elemento] = 1;
							}
							else{
								
								thicc[elemento]++;
								
							}
						}
						
						
						
						for (let bit of textoQuadReduxArray){
							
							if (thicc[bit] == 4){
								
								textoQuadRedux += bit + ".";
								thicc[bit] = 0;
								
							}
							
							
						}
						
						textoQuadRedux = textoQuadRedux.slice(0, textoQuadRedux.length -1);
						
						
						eqred = eqred + textoQuadRedux + " + ";
						
					}
					
					for (let i = 0; i < octos.length; i++){
						
						let textoOctoReduxArray = [];
						let textoOctoRedux = "";
						let thicc = {};
						
						
						for (let j = 0; j < 8; j++){
							for (let n = 0; n < octos[i][j].bits.length; n++){
								
								if (octos[i][j].bits[n] == " " && octos[i][j].bits[n-1] == "'"){
									
									textoOctoReduxArray[textoOctoReduxArray.length] = octos[i][j].bits.slice(n-2, n)
									
								}
								else if (octos[i][j].bits[n] == " " && octos[i][j].bits[n-1] != "'"){
									
									textoOctoReduxArray[textoOctoReduxArray.length] = octos[i][j].bits.slice(n-1, n)
								}
							
								else if (octos[i][j].bits[n] == "." && octos[i][j].bits[n-1] != "'"){
									
									textoOctoReduxArray[textoOctoReduxArray.length] = octos[i][j].bits.slice(n-1, n)
								}
								else if (octos[i][j].bits[n] == "." && octos[i][j].bits[n-1] == "'"){
									
									textoOctoReduxArray[textoOctoReduxArray.length] = octos[i][j].bits.slice(n-2, n)
								}
								
							}
							
						}
						
						let maxBit = textoOctoReduxArray[0];
						let maxQnt = 1;
						
						for (let j = 0; j < textoOctoReduxArray.length; j++){
							
							let elemento = textoOctoReduxArray[j];
							
							
							if (typeof thicc[elemento] === 'undefined'){
								thicc[elemento] = 1;
							}
							else{
								
								thicc[elemento]++;
								
							}
							
							if (thicc[elemento] > maxQnt){
								maxBit = elemento;
								maxQnt = thicc[elemento];
								
							}
						}
						
						eqred = eqred + maxBit + " + ";
						
					}
				
					
						
						
						
					
					
					
					
					
					
					
					
					
					
					
					
					
					eqred = eqred.substring(0, eqred.length - 2);
				}
				
				
				
				function procuraDuplas(casas){
					for (let casa of casas){
						assignerH(casa);
						assignerV(casa);
					}
					
					for (let casa of casas){
						if (casa.valor == 1 && casa.assignH == "unassigned" && casa.assignV == "unassigned"){
							singles[singles.length] = casa;
						}
					}
				}
				
				function assignerH(casa){
					if(casa.valor == "1" && casa.dir.valor == "1"){
						casa.assignH = "assigned";
						casa.dir.assignH = "assigned";
						duplinhasH[duplinhasH.length] = [casa, casa.dir];
					}
				}
				
				function assignerV(casa){
					if(casa.valor == "1" && casa.cima.valor == "1"){
						casa.assignV = "assigned";
						casa.cima.assignV = "assigned";
						duplinhasV[duplinhasV.length] = [casa, casa.cima];
					}
				}
				
				procuraDuplas(casas);
				
				linhaFinder(duplinhasH, duplinhasV);

				quadFinder(duplinhasV);

				octoFinder(linhasH, linhasV);
				
				deletaTUDO();
				
				escreveTUDO();
				
				//alert(eqred);
				
				//console.log(casas);
				//console.log(duplinhasV);
				//console.log(duplinhasH);
				//console.log(linhasV);
				//console.log(linhasH);
				//console.log(quads);
				//console.log(linhasOcto);
				//console.log(quadsOcto);
				console.log(octos);
				
				
				
				
				
				return eqred;
				
			}
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
					
			function tresBits(linha1, linha2){
				let eqred = "F(A, B, C) = ";
				
				let duplinhasH = [];
				let duplinhasV = [];
				
				let linhas = [];
				let duplasLinha = [];
				
				let quads = [];
				let duplasQuad = [];
				
				let singles = [];
				
				function linhaFinder(arrayDuplas){
					if (arrayDuplas.length >= 4){
						
						if (arrayDuplas[0][1].name == arrayDuplas[1][0].name && arrayDuplas[1][1].name == arrayDuplas[2][0].name && arrayDuplas[2][1] == arrayDuplas[3][0] && arrayDuplas[3][1] == arrayDuplas[0][0]){
							linhas[0] = [arrayDuplas[0][0], arrayDuplas[1][0], arrayDuplas[2][0], arrayDuplas[3][0]];
								
							for (let i = 0; i < 4; i++){
								duplasLinha[duplasLinha.length] = arrayDuplas[i];
							}
						}
						else if(arrayDuplas[arrayDuplas.length - 4][1].name == arrayDuplas[arrayDuplas.length - 3][0].name && arrayDuplas[arrayDuplas.length - 3][1].name == arrayDuplas[arrayDuplas.length - 2][0].name && arrayDuplas[arrayDuplas.length - 2][1] == arrayDuplas[arrayDuplas.length - 1][0] && arrayDuplas[arrayDuplas.length - 1][1] == arrayDuplas[arrayDuplas.length - 4][0]){
							linhas[0] = [arrayDuplas[arrayDuplas.length - 4][0], arrayDuplas[arrayDuplas.length - 3][0], arrayDuplas[arrayDuplas.length - 2][0], arrayDuplas[arrayDuplas.length - 1][0]];
							for (let i = arrayDuplas.length - 4; i < arrayDuplas.length; i++){
								duplasLinha[duplasLinha.length] = arrayDuplas[i];
							}
						}
					}
				}
				
				function quadFinder(arrayDuplasV){
					if (arrayDuplasV.length >= 2){
					
						for (let i = 0; i < arrayDuplasV.length; i++){
							if (i != arrayDuplasV.length - 1){
								if (arrayDuplasV[i][0].dir == arrayDuplasV[i+1][0]){
									quads[quads.length] = [arrayDuplasV[i][0], arrayDuplasV[i][1], arrayDuplasV[i+1][0], arrayDuplasV[i+1][1]];
									
									duplasQuad[duplasQuad.length] = arrayDuplasV[i];
									duplasQuad[duplasQuad.length] = arrayDuplasV[i+1];
									duplasQuad[duplasQuad.length] = [arrayDuplasV[i][0], arrayDuplasV[i+1][0]];
									duplasQuad[duplasQuad.length] = [arrayDuplasV[i][1], arrayDuplasV[i+1][1]];
								
								}
								
							}
							else if (i == arrayDuplasV.length - 1){
								if (arrayDuplasV[i][0].dir == arrayDuplasV[0][0]){
									quads[quads.length] = [arrayDuplasV[i][0], arrayDuplasV[i][1], arrayDuplasV[0][0], arrayDuplasV[0][1]];
									
									duplasQuad[duplasQuad.length] = arrayDuplasV[i];
									duplasQuad[duplasQuad.length] = arrayDuplasV[0];
									duplasQuad[duplasQuad.length] = [arrayDuplasV[i][0], arrayDuplasV[0][0]];
									duplasQuad[duplasQuad.length] = [arrayDuplasV[i][1], arrayDuplasV[0][1]];
									
								}
				
							}
						
						}
					
					}
					
				}
				
				function deletaDuplas(arrayDuplasH, _arrayDuplasV){
					
					for(let duplaQuad of duplasQuad){
						for (let i = 0; i < arrayDuplasH.length; i++){
							
							if (arrayDuplasH[i][0].name == duplaQuad[0].name && arrayDuplasH[i][1].name == duplaQuad[1].name){
								arrayDuplasH.splice(i , 1);
							}		
						}
					}
					for(let duplaLinha of duplasLinha){
						for (let i = 0; i < arrayDuplasH.length; i++){
						
							if (arrayDuplasH[i][0].name == duplaLinha[0].name && arrayDuplasH[i][1].name == duplaLinha[1].name){
								arrayDuplasH.splice(i , 1);
							}
						}	
					}
					for(let duplaQuad of duplasQuad){
						for (let i = 0; i < _arrayDuplasV.length; i++){
							
							if (_arrayDuplasV[i][0].name == duplaQuad[0].name && _arrayDuplasV[i][1].name == duplaQuad[1].name){
								_arrayDuplasV.splice(i , 1);
							}		
						}
					}
					for(let duplaLinha of duplasLinha){
						for (let i = 0; i < _arrayDuplasV.length; i++){
						
							if (_arrayDuplasV[i][0].name == duplaLinha[0].name && _arrayDuplasV[i][1].name == duplaLinha[1].name){
								_arrayDuplasV.splice(i , 1);
							}
						}	
					}
					
					for (let i = 0; i < _arrayDuplasV.length; i++){
						if (_arrayDuplasV[i][0].assignH == "assigned" && _arrayDuplasV[i][0].assignV == "assigned" && _arrayDuplasV[i][1].assignH == "assigned" && _arrayDuplasV[i][1].assignV == "assigned"){
							
							_arrayDuplasV[i][0].assignV = "unassigned";
							_arrayDuplasV[i][1].assignV = "unassigned";
							_arrayDuplasV.splice(i, 1);
							
						}
					}
					for (let i = 0; i < arrayDuplasH.length; i++){
						
						if (arrayDuplasH[i][0].assignV == "assigned"){
							
							for (let j = 0; j < arrayDuplasH.length; j++){
								
								if (arrayDuplasH[i][1].name == arrayDuplasH[j][0].name){
									arrayDuplasH.splice(i, 1);
									j = 99;
									
								}
							}
						}
						
						if (arrayDuplasH[i][1].assignV == "assigned"){
							
							for (let j = 0; j < arrayDuplasH.length; j++){
								
								if (arrayDuplasH[i][0].name == arrayDuplasH[j][1].name){
									arrayDuplasH.splice(i, 1);
									j = 99;
									
								}
							}
						}
					}
				}
				
				function escreveBits(dupH, dupV, _linhas, _quads, solitarios){
					for (let i = 0; i < solitarios.length; i++){	
						eqred = eqred + solitarios[i].bits + "+ ";
					}
					
					for (let i = 0; i < dupH.length; i++){	
						
						let textoDuplaHRedux; 
						
						let lengthzinha = Math.min(dupH[i][0].bits.length, dupH[i][1].bits.length)
						for (let j = 0; j < lengthzinha; j++){
							if (dupH[i][0].bits[j] != dupH[i][1].bits[j]){
								
								
								if(dupH[i][0].bits[j] == "'"){
										
									textoDuplaHRedux = dupH[i][1].bits; 
								}	
								else {
									textoDuplaHRedux = dupH[i][0].bits; 
								}

								if (textoDuplaHRedux[j] == " "){
									textoDuplaHRedux = textoDuplaHRedux.slice(0, textoDuplaHRedux.length - 3) + " ";
								}
								else if (textoDuplaHRedux[j] == "."){
									textoDuplaHRedux = textoDuplaHRedux.slice(0, j - 1) + textoDuplaHRedux.slice(j + 1);
								}
								j = 99;
							}	
						}
						
						eqred = eqred + textoDuplaHRedux + "+ ";
					}
					
					for (let i = 0; i < dupV.length; i++){	
						
						let textoDuplaVRedux; 
						
						let lengthzinha = Math.min(dupV[i][0].bits.length, dupV[i][1].bits.length)
						for (let j = 0; j < lengthzinha; j++){
							if (dupV[i][0].bits[j] != dupV[i][1].bits[j]){
								
								
								if(dupV[i][0].bits[j] == "'"){
										
									textoDuplaVRedux = dupV[i][1].bits; 
								}	
								else {
									textoDuplaVRedux = dupV[i][0].bits; 
								}

								if (textoDuplaVRedux[j] == " "){
									textoDuplaVRedux = textoDuplaVRedux.slice(0, textoDuplaVRedux.length - 3) + " ";
								}
								else if (textoDuplaVRedux[j] == "."){
									textoDuplaVRedux = textoDuplaVRedux.slice(0, j - 1) + textoDuplaVRedux.slice(j + 1);
								}
								j = 99;
							}	
						}
						
						eqred = eqred + textoDuplaVRedux + "+ ";
					}
					
					if (_linhas.length != 0){
						
						if (_linhas[0][0].bits[1] == "'"){
							
							eqred = eqred + "A' + ";
							
						}
						else {
							eqred = eqred + "A + ";
						}
					}
					
					for (let i = 0; i < _quads.length; i++){
						
						let textoQuadReduxArray = [];
						let textoQuadRedux = "";
						let thicc = {};
						
						
						for (let j = 0; j < 4; j++){
							for (let n = 0; n < _quads[i][j].bits.length; n++){
								
								if (_quads[i][j].bits[n] == " " && _quads[i][j].bits[n-1] == "'"){
									
									textoQuadReduxArray[textoQuadReduxArray.length] = _quads[i][j].bits.slice(n-2, n)
									
								}
								else if (_quads[i][j].bits[n] == " " && _quads[i][j].bits[n-1] != "'"){
									
									textoQuadReduxArray[textoQuadReduxArray.length] = _quads[i][j].bits.slice(n-1, n)
								}
							
								else if (_quads[i][j].bits[n] == "." && _quads[i][j].bits[n-1] != "'"){
									
									textoQuadReduxArray[textoQuadReduxArray.length] = _quads[i][j].bits.slice(n-1, n)
								}
								else if (_quads[i][j].bits[n] == "." && _quads[i][j].bits[n-1] == "'"){
									
									textoQuadReduxArray[textoQuadReduxArray.length] = _quads[i][j].bits.slice(n-2, n)
								}
								
							}
							
						}
						
						let maxBit = textoQuadReduxArray[0];
						let maxQnt = 1;
						
						for (let j = 0; j < textoQuadReduxArray.length; j++){
							
							let elemento = textoQuadReduxArray[j];
							
							
							if (typeof thicc[elemento] === 'undefined'){
								thicc[elemento] = 1;
							}
							else{
								
								thicc[elemento]++;
								
							}
							
							if (thicc[elemento] > maxQnt){
								maxBit = elemento;
								maxQnt = thicc[elemento];
								
							}
						}
						
						eqred = eqred + maxBit + " + ";
						
					}
				
					eqred = eqred.substring(0, eqred.length - 2);
				}
				
				function assignerH(casa_h){
					if (casa_h["dir"]["valor"] == "1" && casa_h["valor"] == "1"){
						casa_h["assignH"] = "assigned";
						casa_h.dir.assignH = "assigned";
						duplinhasH[duplinhasH.length] = [casa_h, casa_h.dir];
					}
				}
				
				function assignerV(casa_v){
					if (casa_v.name[4] == "0" && casa_v["cima"]["valor"] == "1" && casa_v["valor"] == "1"){
						casa_v["assignV"] = "assigned";
						casa_v.cima.assignV = "assigned";
						duplinhasV[duplinhasV.length] = [casa_v, casa_v.cima];
					}
				}
				
				function duplaSearcher(casas){
					for (let casa of casas){
						assignerH(casa);
						assignerV(casa);
					}
					
					for (let casa of casas){
						if (casa.assignH == "unassigned" && casa.assignV == "unassigned" && casa.valor == "1"){
							singles[singles.length] = casa;
						}
					}
				}
				
				function agruparBitsMAIOR(linha1, linha2){
					var qntBits1 = 0;
					for (let i = 0; i < 4; i++){
						if (linha1[i] == 1){
							qntBits1++;
						}
					}
					for (let i = 0; i < 4; i++){
						if (linha2[i] == 1){
							qntBits1++;
						}
					}
					
					var casa00 = {
						"status" : 0,
						"bits" : "A'.B'.C' ",
						"name" : "casa00",
						"assignH" : "unassigned",
						"assignV" : "unassigned",
						"dir" : null,
						"cima" : null,
						"valor" : linha1[0]
					};
					var casa01 = {
						"status" : 0,
						"bits" : "A'.B'.C ",
						"name" : "casa01",
						"assignH" : "unassigned",
						"assignV" : "unassigned",
						"dir" : null,
						"cima" : null,
						"valor" : linha1[1]
					};
					var casa02 = {
						"status" : 0,
						"bits" : "A'.B.C ",
						"name" : "casa02",
						"assignH" : "unassigned",
						"assignV" : "unassigned",
						"dir" : null,
						"cima" : null,
						"valor" : linha1[2]
					};
					var casa03 = {
						"status" : 0,
						"bits" : "A'.B.C' ",
						"name" : "casa03",
						"assignH" : "unassigned",
						"assignV" : "unassigned",
						"dir" : casa00,
						"cima" : null,
						"valor" : linha1[3]
					};
					var casa10 = {
						"status" : 0,
						"bits" : "A.B'.C' ",
						"name" : "casa10",
						"assignH" : "unassigned",
						"assignV" : "unassigned",
						"dir" : null,
						"cima" : casa00,
						"valor" : linha2[0]
					};
					var casa11 = {
						"status" : 0,
						"bits" : "A.B'.C ",
						"name" : "casa11",
						"assignH" : "unassigned",
						"assignV" : "unassigned",
						"dir" : null,
						"cima" : casa01,
						"valor" : linha2[1]
					};
					var casa12 = {
						"status" : 0,
						"bits" : "A.B.C ",
						"name" : "casa12",
						"assignH" : "unassigned",
						"assignV" : "unassigned",
						"dir" : null,
						"cima" : casa02,
						"valor" : linha2[2]
					};
					var casa13 = {
						"status" : 0,
						"bits" : "A.B.C' ",
						"name" : "casa13",
						"assignH" : "unassigned",
						"assignV" : "unassigned",
						"dir" : casa10,
						"cima" : casa03,
						"valor" : linha2[3]
					};
					
					casa00["dir"] = casa01;
					casa00["cima"] = casa10;
					casa01["dir"] = casa02;
					casa01["cima"] = casa11; 
					casa02["dir"] = casa03;
					casa02["cima"] = casa12;
					casa03["cima"] = casa13;
					casa10["dir"] = casa11;
					casa11["dir"] = casa12;
					casa12["dir"] = casa13;
					
					var casas = [
						casa00,
						casa01,
						casa02,
						casa03,
						casa10,
						casa11,
						casa12,
						casa13
					];
					duplaSearcher(casas);
					
					quadFinder(duplinhasV);
					
					linhaFinder(duplinhasH);
					
					deletaDuplas(duplinhasH, duplinhasV);
					
					escreveBits(duplinhasH, duplinhasV, linhas, quads, singles);
					
				}
				
				agruparBitsMAIOR(linha1, linha2);
				//alert(eqred);
				return eqred;
				
			}
			
			function agruparBits(linha1, linha2){
				var eq_reduzida = "";
				var i = 0;
				if (linha1[i] == "1"){
					if (linha1[i+1] == "1"){
						eq_reduzida = eq_reduzida + "A' + ";
					}
					if (linha2[i] == "1"){
						eq_reduzida = eq_reduzida + "B' + ";
					}
				}
				i = 1;
				if (linha2[i] == "1"){
					if (linha2[i-1] == "1"){
						eq_reduzida = eq_reduzida + "A + ";
					}
					if (linha1[i] == "1"){
						eq_reduzida = eq_reduzida + "B + ";
					}
				}
			
				return eq_reduzida; 
			
			}
			
			function autoSetAttributes(number_input){
				
				j = j + 1;
				number_input.setAttribute("id", `${j}`);
				number_input.setAttribute("value", "0");
				number_input.setAttribute("class", "cel_input");
				number_input.innerHTML = "0";
				number_input.style.backgroundColor = "lightgray";
				number_input.onclick = function() {
				
					if (number_input.innerHTML == "0"){
					number_input.innerHTML = "1";
					number_input.setAttribute("value", "1");
					number_input.style.backgroundColor = "lightgreen";
					}
					
					else if (number_input.innerHTML == "1"){
					number_input.innerHTML = "0";
					number_input.setAttribute("value", "0");
					number_input.style.backgroundColor = "lightgray";
					}
			
				};
			
			}
		
			function criarmapa(){
				j = 0;
				if(document.getElementById("tabela") != null){
					document.getElementById("tabela").parentNode.removeChild(document.getElementById("tabela"));
				}
				
				document.getElementById("resps").style.paddingLeft = "0px";
				document.getElementById("resps").style.paddingRight = "0px";
				document.getElementById("resps").style.paddingTop = "0px";
				document.getElementById("resps").style.paddingBottom = "0px";
				
				qnt = document.querySelector('input[name="QntVar"]:checked').value;
				
				var tab = document.createElement("TABLE");
				tab.setAttribute("id", "tabela");
				
				var tr0 = document.createElement("TR");
				var tr1 = document.createElement("TR");
				var tr2 = document.createElement("TR");
				
				tr0.setAttribute("id", "linha0");
				tr1.setAttribute("id", "linha1");
				tr2.setAttribute("id", "linha2");
				
				var th00 = document.createElement("TH");
				th00.setAttribute("id", "tableheader");
				var thtext;
				
				if (qnt == 2){
					thtext = document.createTextNode("A | B");
				}
				
				if (qnt == 3){
					thtext = document.createTextNode("A | BC");
				}
				
				if (qnt == 4){
					thtext = document.createTextNode("AB | CD");
				}
				
				th00.appendChild(thtext);
				tr0.appendChild(th00);
				
				if (qnt == 2){
					
					var td01 = document.createElement("TD");
					var td01text = document.createTextNode("0");
					td01.appendChild(td01text);
					tr0.appendChild(td01);
					
					var td02 = document.createElement("TD");
					var td02text = document.createTextNode("1");
					td02.appendChild(td02text);
					tr0.appendChild(td02);
					
					tab.appendChild(tr0);
					
					var td10 = document.createElement("TD");
					var td10text = document.createTextNode("0");
					td10.appendChild(td10text);
					tr1.appendChild(td10);
					
					var td11 = document.createElement("TD");
					var td11text = document.createElement("BUTTON");
					autoSetAttributes(td11text);
					td11.appendChild(td11text);
					tr1.appendChild(td11);
					
					var td12 = document.createElement("TD");
					var td12text = document.createElement("BUTTON");
					autoSetAttributes(td12text);
					td12.appendChild(td12text);
					tr1.appendChild(td12);
					
					tab.appendChild(tr1);
					
					var td20 = document.createElement("TD");
					var td20text = document.createTextNode("1");
					td20.appendChild(td20text);
					tr2.appendChild(td20);
					
					var td21 = document.createElement("TD");
					var td21text = document.createElement("BUTTON");
					autoSetAttributes(td21text);
					td21.appendChild(td21text);
					tr2.appendChild(td21);
					
					var td22 = document.createElement("TD");
					var td22text = document.createElement("BUTTON");
					autoSetAttributes(td22text);
					td22.appendChild(td22text);
					tr2.appendChild(td22);
					
					tab.appendChild(tr2);
					
				}
				else if (qnt == 4){
					
					var tr3 = document.createElement("TR");
					var tr4 = document.createElement("TR");
					tr3.setAttribute("id", "linha3");
					tr4.setAttribute("id", "linha4");
					
					var td01 = document.createElement("TD");
					var td01text = document.createTextNode("0 0");
					td01.appendChild(td01text);
					tr0.appendChild(td01);
					
					var td02 = document.createElement("TD");
					var td02text = document.createTextNode("0 1");
					td02.appendChild(td02text);
					tr0.appendChild(td02);
					
					var td03 = document.createElement("TD");
					var td03text = document.createTextNode("1 1");
					td03.appendChild(td03text);
					tr0.appendChild(td03);
					
					var td04 = document.createElement("TD");
					var td04text = document.createTextNode("1 0");
					td04.appendChild(td04text);
					tr0.appendChild(td04);
					
					tab.appendChild(tr0);
					
					var td10 = document.createElement("TD");
					var td10text = document.createTextNode("0 0");
					td10.appendChild(td10text);
					tr1.appendChild(td10);
					
					var td11 = document.createElement("TD");
					var td11text = document.createElement("BUTTON");
					autoSetAttributes(td11text);
					td11.appendChild(td11text);
					tr1.appendChild(td11);
					
					var td12 = document.createElement("TD");
					var td12text = document.createElement("BUTTON");
					autoSetAttributes(td12text);
					td12.appendChild(td12text);
					tr1.appendChild(td12);
					
					var td13 = document.createElement("TD");
					var td13text = document.createElement("BUTTON");
					autoSetAttributes(td13text);
					td13.appendChild(td13text);
					tr1.appendChild(td13);
					
					var td14 = document.createElement("TD");
					var td14text = document.createElement("BUTTON");
					autoSetAttributes(td14text);
					td14.appendChild(td14text);
					tr1.appendChild(td14);
					
					tab.appendChild(tr1);
					
					var td20 = document.createElement("TD");
					var td20text = document.createTextNode("0 1");
					td20.appendChild(td20text);
					tr2.appendChild(td20);
					
					var td21 = document.createElement("TD");
					var td21text = document.createElement("BUTTON");
					autoSetAttributes(td21text);
					td21.appendChild(td21text);
					tr2.appendChild(td21);
					
					var td22 = document.createElement("TD");
					var td22text = document.createElement("BUTTON");
					autoSetAttributes(td22text);
					td22.appendChild(td22text);
					tr2.appendChild(td22);
					
					var td23 = document.createElement("TD");
					var td23text = document.createElement("BUTTON");
					autoSetAttributes(td23text);
					td23.appendChild(td23text);
					tr2.appendChild(td23);
					
					var td24 = document.createElement("TD");
					var td24text = document.createElement("BUTTON");
					autoSetAttributes(td24text);
					td24.appendChild(td24text);
					tr2.appendChild(td24);
					
					tab.appendChild(tr2);
					
					var td30 = document.createElement("TD");
					var td30text = document.createTextNode("1 1");
					td30.appendChild(td30text);
					tr3.appendChild(td30);
					
					var td31 = document.createElement("TD");
					var td31text = document.createElement("BUTTON");
					autoSetAttributes(td31text);
					td31.appendChild(td31text);
					tr3.appendChild(td31);
					
					var td32 = document.createElement("TD");
					var td32text = document.createElement("BUTTON");
					autoSetAttributes(td32text);
					td32.appendChild(td32text);
					tr3.appendChild(td32);
					
					var td33 = document.createElement("TD");
					var td33text = document.createElement("BUTTON");
					autoSetAttributes(td33text);
					td33.appendChild(td33text);
					tr3.appendChild(td33);
					
					var td34 = document.createElement("TD");
					var td34text = document.createElement("BUTTON");
					autoSetAttributes(td34text);
					td34.appendChild(td34text);
					tr3.appendChild(td34);
					
					tab.appendChild(tr3);
					
					var td40 = document.createElement("TD");
					var td40text = document.createTextNode("1 0");
					td40.appendChild(td40text);
					tr4.appendChild(td40);
					
					var td41 = document.createElement("TD");
					var td41text = document.createElement("BUTTON");
					autoSetAttributes(td41text);
					td41.appendChild(td41text);
					tr4.appendChild(td41);
					
					var td42 = document.createElement("TD");
					var td42text = document.createElement("BUTTON");
					autoSetAttributes(td42text);
					td42.appendChild(td42text);
					tr4.appendChild(td42);
					
					var td43 = document.createElement("TD");
					var td43text = document.createElement("BUTTON");
					autoSetAttributes(td43text);
					td43.appendChild(td43text);
					tr4.appendChild(td43);
					
					var td44 = document.createElement("TD");
					var td44text = document.createElement("BUTTON");
					autoSetAttributes(td44text);
					td44.appendChild(td44text);
					tr4.appendChild(td44);
					
					tab.appendChild(tr4);
				
				}
				else if (qnt == 3){
					
					var td01 = document.createElement("TD");
					var td01text = document.createTextNode("0 0");
					td01.appendChild(td01text);
					tr0.appendChild(td01);
					
					var td02 = document.createElement("TD");
					var td02text = document.createTextNode("0 1");
					td02.appendChild(td02text);
					tr0.appendChild(td02);
					
					var td03 = document.createElement("TD");
					var td03text = document.createTextNode("1 1");
					td03.appendChild(td03text);
					tr0.appendChild(td03);
					
					var td04 = document.createElement("TD");
					var td04text = document.createTextNode("1 0");
					td04.appendChild(td04text);
					tr0.appendChild(td04);
					
					tab.appendChild(tr0);
					
					var td10 = document.createElement("TD");
					var td10text = document.createTextNode("0");
					td10.appendChild(td10text);
					tr1.appendChild(td10);
					
					var td11 = document.createElement("TD");
					var td11text = document.createElement("BUTTON");
					autoSetAttributes(td11text);
					td11.appendChild(td11text);
					tr1.appendChild(td11);
					
					var td12 = document.createElement("TD");
					var td12text = document.createElement("BUTTON");
					autoSetAttributes(td12text);
					td12.appendChild(td12text);
					tr1.appendChild(td12);
					
					var td13 = document.createElement("TD");
					var td13text = document.createElement("BUTTON");
					autoSetAttributes(td13text);
					td13.appendChild(td13text);
					tr1.appendChild(td13);
					
					var td14 = document.createElement("TD");
					var td14text = document.createElement("BUTTON");
					autoSetAttributes(td14text);
					td14.appendChild(td14text);
					tr1.appendChild(td14);
					
					tab.appendChild(tr1);
					
					var td20 = document.createElement("TD");
					var td20text = document.createTextNode("1");
					td20.appendChild(td20text);
					tr2.appendChild(td20);
					
					var td21 = document.createElement("TD");
					var td21text = document.createElement("BUTTON");
					autoSetAttributes(td21text);
					td21.appendChild(td21text);
					tr2.appendChild(td21);
					
					var td22 = document.createElement("TD");
					var td22text = document.createElement("BUTTON");
					autoSetAttributes(td22text);
					td22.appendChild(td22text);
					tr2.appendChild(td22);
					
					var td23 = document.createElement("TD");
					var td23text = document.createElement("BUTTON");
					autoSetAttributes(td23text);
					td23.appendChild(td23text);
					tr2.appendChild(td23);
					
					var td24 = document.createElement("TD");
					var td24text = document.createElement("BUTTON");
					autoSetAttributes(td24text);
					td24.appendChild(td24text);
					tr2.appendChild(td24);
					
					tab.appendChild(tr2);
				}
				
				document.getElementById("tabappend").appendChild(tab);
				document.getElementById("resposta").innerHTML = "";
				document.getElementById("eq").innerHTML = "";
				document.getElementById("respostared").innerHTML = "";
				document.getElementById("eqred").innerHTML = "";
				
			}
			
		function calcular(){
			
			var eq = "";
			var eqred = "";
			var seq = "";
			var seq2 = "";
			var seq3 = "";
			var seq4 = "";
			
			
			if (qnt == 2){
			
				eq = "F(A, B) = ";
				eqred = "F(A, B) = ";
				
				var dict = {
					0 : "A'.B' ",
					1 : "A'.B ",
					2 : "A.B' ",
					3 : "A.B "
				};
				
				for (let i = 0; i < 4; i++){
				
					if (document.getElementsByClassName("cel_input")[i].value == 1){
						
						eq = eq + dict[i] + "+ ";	
					}
					seq = seq + String(document.getElementsByClassName("cel_input")[i].value);
				} 
				
				if(seq == "1111"){
					eq = "F(A, B) = 1  ";
					eqred = eq;
				}
				else if(seq == "0000"){
					eq = "F(A, B) = 0  ";
					eqred = eq;
				}
				
				else if(seq == "0110"){
					eqred = "F(A, B) = A XOR B  ";
				}
				
				else if(seq == "1001"){
					eqred = "F(A, B) = A XNOR B  ";
				}
				
				else if(seq == "1000" || seq == "0100" || seq == "0010" || seq == "0001"){
					eqred = eq;
					eqred = eqred.substring(0, eqred.length - 2);
				} 
				
				else {
					seq2 = seq.slice(2);
					seq = seq.slice(0, 2);
					eqred = eqred + agruparBits(seq, seq2);
					eqred = eqred.substring(0, eqred.length - 2);
				}
				
			}
			
			if (qnt == 3){
				
				eq = "F(A, B, C) = ";
				
				var dict = {
					0 : "A'.B'.C' ",
					1 : "A'.B'.C ",
					2 : "A'.B.C ",
					3 : "A'.B.C' ",
					4 : "A.B'.C' ",
					5 : "A.B'.C ",
					6 : "A.B.C ",
					7 : "A.B.C' "
				};
				for (i = 0; i < 8; i++){
				
					if (document.getElementsByClassName("cel_input")[i].value == 1){
						
						eq = eq + dict[i] + "+ ";	
					}
					seq = seq + String(document.getElementsByClassName("cel_input")[i].value);
				} 
				if(seq == "11111111"){
					eq = "F(A, B, C) = 1  ";
					eqred = eq;
				}
				else if(seq == "00000000"){
					eq = "F(A, B, C) = 0  ";
					eqred = eq;
				}
				else{
					
					let linha1 = seq.slice(0, 4);
					let linha2 = seq.slice(4);
					
					
					eqred = tresBits(linha1, linha2);
				
				}
			}
		
			if (qnt == 4){
			
				eq = "F(A, B, C, D) = ";
				
				var dict = {
					0 : "A'.B'.C'.D' ",
					1 : "A'.B'.C'.D ",
					2 : "A'.B'.C.D ",
					3 : "A'.B'.C.D' ",
					4 : "A'.B.C'.D' ",
					5 : "A'.B.C'.D ",
					6 : "A'.B.C.D ",
					7 : "A'.B.C.D' ",
					8 : "A.B.C'.D' ",
					9 : "A.B.C'.D ",
					10 : "A.B.C.D ",
					11 : "A.B.C.D' ",
					12 : "A.B'.C'.D' ",
					13 : "A.B'.C'.D ",
					14 : "A.B'.C.D ",
					15 : "A.B'.C.D' "
				};
				for (i = 0; i < 16; i++){
				
					if (document.getElementsByClassName("cel_input")[i].value == 1){
						
						eq = eq + dict[i] + "+ ";	
					}
					seq = seq + String(document.getElementsByClassName("cel_input")[i].value);
				} 
				if(seq == "1111111111111111"){
					eq = "F(A, B, C, D) = 1  ";
					eqred = eq;
				}
				else if(seq == "0000000000000000"){
					eq = "F(A, B, C, D) = 0  ";
					eqred = eq;
				}
				
				else{
					
					eqred = quatroBits(seq);
					
				}
				
				
				
				
				
				
				
				
				
			}
			
			eq = eq.substring(0, eq.length - 2);
			document.getElementById("resps").style.paddingLeft = "15px";
			document.getElementById("resps").style.paddingRight = "15px";
			document.getElementById("resps").style.paddingTop = "1px";
			document.getElementById("resps").style.paddingBottom = "1px";
			
			document.getElementById("resposta").innerHTML = "Resposta em somat&oacuteria de Mintermos:";
			document.getElementById("eq").innerHTML = `${eq}`;
			document.getElementById("respostared").innerHTML = "Resposta em somat&oacuteria de Mintermos reduzida: [BETA]";
			document.getElementById("eqred").innerHTML = `${eqred}`;
			eq = "";
			
			
		}
		
		function bleh(){	
			var submitButton = document.createElement("BUTTON");
			
			submitButton.innerHTML = "Calcular";
			submitButton.setAttribute("id", "submit");
			
			document.getElementById("botaoCalc").appendChild(submitButton);
			
			document.getElementById("submit").onclick = function() {calcular()};
		}