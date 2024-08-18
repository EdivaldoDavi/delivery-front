import { ACRESCIMOS } from "./dados.js"

export class  Enums {
   
    static async getCATEGORIES() {


     
            try {
                // Obtém categorias
                const response = await fetch('http://localhost:3000/categorias');
                const result = await response.json();
                const categorias = result.data;
        
                if (!Array.isArray(categorias)) {
                    throw new TypeError('Categorias não são um array');
                }
        
                // Obtém empresas
                const empresasResponse = await fetch('http://localhost:3000/empresas');
                const empresasResult = await empresasResponse.json();
                const empresas = empresasResult.data;
        
                // Obtém opcionais
                const opcionaisResponse = await fetch('http://localhost:3000/opcionais');
                const opcionaisResult = await opcionaisResponse.json();
                const opcionais = opcionaisResult.data;
        
                // Mapeia opcionais para referência
                const adicionaisMap = opcionais.reduce((acc, opc) => {
                    const empresa = empresas.find(emp => emp.idempresa.toString() === opc.idopcionalitemempresa.toString());
                    const empresaNome = empresa ? `EMPRESA${empresa.idempresa}` : null;
                    if (empresaNome) {
                        if (!acc[empresaNome]) {
                            acc[empresaNome] = [];
                        }
                        acc[empresaNome].push({
                            id: opc.idopcionalitem || 'ID não encontrado',
                            name: opc.nome || 'Nome não encontrado'
                        });
                    }
                    return acc;
                }, {});
        
                // Mapeia categorias para retorno
                const categoriasMap = categorias.reduce((acc, cat) => {
                    const empresa = empresas.find(emp => emp.idempresa.toString() == cat.idcategoriaempresa.toString());
                    const empresaNome = empresa ? `EMPRESA${empresa.idempresa}` : null;
                    
                    acc[cat.nome.toUpperCase()] = {
                        id: cat.idcategoria ? cat.idcategoria.toString() : 'ID não encontrado',
                        name: cat.nome || 'Nome não encontrado',
                        img: {
                            type: Enums.TYPES_IMG.FAS,
                            name: cat.icone || 'Icone não encontrado'
                        },
                        listAdditionals: adicionaisMap[empresaNome] || [],
                        company: empresaNome ? Enums.EMPRESAS[empresaNome] || 'Empresa não encontrada' : 'Empresa não encontrada'
                    };
                    return acc;
                }, {});
        
                return categoriasMap;
            } catch (error) {
                console.error('Erro ao obter categorias:', error);
            }
        }

        static async getEMPRESAS() {
            try {
                const response = await fetch('http://localhost:3000/empresas');
                const result = await response.json();
                const empresas = result.data;
    
                const tiposComandasResponse = await fetch('http://localhost:3000/tipocomanda');
                const tiposComandasResult = await tiposComandasResponse.json();
                const tiposComandas = tiposComandasResult.data;
    
                if (!Array.isArray(empresas)) {
                    throw new TypeError('Empresas não são um array');
                }
    
                const empresasMap = empresas.reduce((acc, emp) => {
                    const comandos = tiposComandas.filter(tc => tc.idempresatipocomanda.toString() == emp.idempresa.toString());
                    acc[`EMPRESA${emp.idempresa}`] = {
                        id: emp.idempresa.toString(),
                        name: emp.nome,
                        telOrder: emp.telorder || 'Telefone não disponível',
                        priceDelivery: emp.priceDelivery || 'Preço de entrega não disponível',
                        typesCommands: comandos.map(cmd => ({
                            id: cmd.idtipocomanda.toString(),
                            name: cmd.typesCommands
                        }))
                    };
                    return acc;
                }, {});
    
                return empresasMap;
            } catch (error) {
                console.error('Erro ao obter empresas:', error);
            }
        }
    
        static get TYPES_IMG() {
            return {
                FAS: 'fas',
                IMG: 'img',
            };
        }
    
        static async getTYPES_COMMANDS() {
            try {
                const response = await fetch('http://localhost:3000/tipocomanda');
                const result = await response.json();
                const tiposComandas = result.data;
        
                if (!Array.isArray(tiposComandas)) {
                    throw new TypeError('Tipos de comandas não são um array');
                }
        
                const tiposComandasMap = tiposComandas.reduce((acc, tipo) => {
                    const key = tipo.tipodescricao.toUpperCase();
                    acc[key] = {
                        id: tipo.idtipocomanda ? tipo.idtipocomanda.toString() : 'ID não encontrado',
                        name: tipo.tipodescricao || 'Nome não encontrado'
                    };
                    return acc;
                }, {});
        
                return {
                    DELIVERY: tiposComandasMap.DELIVERY,
                    GET: tiposComandasMap.GET,
                    LOCAL: tiposComandasMap.LOCAL,
                    QUERY: tiposComandasMap.QUERY
                };
            } catch (error) {
                console.error('Erro ao obter tipos de comandas:', error);
                return {};
            }
        }
        
     
        
   
    static get TYPES_IMG() {
        return {
            // Tipo de icone do font awesome, inserção na classe
            FAS: 'fas',
            // Tipo de imagem, inserção no src
            IMG: 'img',
        }
    }

    static get EMPRESAS() {
        return {
            EMPRESA1: {
                id: '1',
                name: 'PIZZA',
                 telOrder: '14 996420910',
                //telOrder: '18997010088',
                priceDelivery: 5,
				typesCommands: [
                   // Enums.TYPES_COMMANDS.DELIVERY,
                   // Enums.TYPES_COMMANDS.GET,
                    Enums.TYPES_COMMANDS.QUERY,
                ],
            },
            EMPRESA2: {
                id: '2',
                name: 'ESPETO',
                // telOrder: '14 99655-2177',
                telOrder: '14988121969',
                priceDelivery: 5,
             typesCommands: [
                   // Enums.TYPES_COMMANDS.DELIVERY,
                   // Enums.TYPES_COMMANDS.GET,
                    Enums.TYPES_COMMANDS.QUERY,
                ],				
            },
			 EMPRESA3: {
                id: '3',
                name: 'Burguer',
                // telOrder: '14 99655-2177',
                telOrder: '14991402791',
                priceDelivery: 5,
				typesCommands: [
                    Enums.TYPES_COMMANDS.DELIVERY,
                    Enums.TYPES_COMMANDS.GET,
                    Enums.TYPES_COMMANDS.QUERY,
                ],				
            },
			 EMPRESA4: {
                id: '4',
                name: 'Kreppe Dú Cheff',
                // telOrder: '14 99655-2177',
                telOrder: '14981247314',
                priceDelivery: 5,
				typesCommands: [
                   // Enums.TYPES_COMMANDS.DELIVERY,
                   // Enums.TYPES_COMMANDS.GET,
                    Enums.TYPES_COMMANDS.QUERY,
                ],				
            },
			 EMPRESA5: {
                id: '5',
                name: 'Sushi',
                // telOrder: '14 99655-2177',
                telOrder: '14997212656',
                priceDelivery: 5,
				typesCommands: [
                    Enums.TYPES_COMMANDS.DELIVERY,
                    Enums.TYPES_COMMANDS.GET,
                    Enums.TYPES_COMMANDS.QUERY,
                ],				
            },
			/*
			 EMPRESA06: {
                id: '6',
                name: 'Vilinha Chopp',
                // telOrder: '14 99655-2177',
                telOrder: '14996395200',
                priceDelivery: 5,
				typesCommands: [
                  //  Enums.TYPES_COMMANDS.DELIVERY,
                  //  Enums.TYPES_COMMANDS.GET,
                  Enums.TYPES_COMMANDS.QUERY,
                ],				
            },
			*/
        }
    }

    static get CATEGORIES() {
        return {
            PIZZA: {
                id: '1',
                name: 'Cantinho Di Itália',
                img: {
                    type: Enums.TYPES_IMG.FAS,
                    name: 'fa-light fa-pizza-slice'
                },
                listAdditionals: ACRESCIMOS.PIZZA,
                company: Enums.EMPRESAS.EMPRESA1,
            },
            ESPETO: {
                id: '2',
                name: 'Sr. & Sra. Espeto',
                img: {
                     type: Enums.TYPES_IMG.IMG,
                    name: './img/cardapio/burguers/espetoimg.svg'
                },
                listAdditionals:ACRESCIMOS.ESPETO,
                company: Enums.EMPRESAS.EMPRESA2,
            },
            BURGER: {
                id: '3',
                name: 'Bendito Burguer',
                img: {
                    type: Enums.TYPES_IMG.FAS,
                    name: 'fas fa-hamburger'
                },
                listAdditionals: ACRESCIMOS.BURGER,
                company: Enums.EMPRESAS.EMPRESA3,
            },
             KREPE: {
                id: '4',
                name: 'Dú Cheff Krepes' ,
                img: {
                    type: Enums.TYPES_IMG.IMG,
                     name: './img/cardapio/churrasco/CREPES.svg'
                },
                listAdditionals: ACRESCIMOS.KREPE,
                company: Enums.EMPRESAS.EMPRESA4,
            },

            SUSHI: {
                id: '5',
                name: 'THIAGO PEREIRA',
                img: {
                    type: Enums.TYPES_IMG.IMG,
                    name: './img/cardapio/churrasco/hashi.svg'
                },
                listAdditionals: undefined,
                company: Enums.EMPRESAS.EMPRESA5,
            }
			
        }
    }


    /**
     * Tipo de comanda (Delivery, retirada, consumo no local...)
     */
    static get TYPES_COMMANDS() {
        return {
            LOCAL: {
                id: '1',
                name: 'Consumo local',
            },
            DELIVERY: {
                id: '2',
                name: 'Delivery',
            },
            GET: {
                id: '3',
                name: 'Retirada',
            },
            QUERY: {
                id: '4',
                name: 'Cardápio',
            },
        }
    }

    static async getEnums() {
        try {
            //const categorias = await Enums.getCATEGORIAS();
            const categories = await Enums.getCATEGORIES();
          
            const empresas = await Enums.getEMPRESAS();
            const typesCommands = await Enums.getTYPES_COMMANDS();

            return {
            //    TYPES_IMG: Enums.TYPES_IMG,
                EMPRESAS: empresas,
              //  CATEGORIAS: categorias,
                ACRESCIMOS: ACRESCIMOS,
                CATEGORIES: categories,
                TYPES_COMMANDS: typesCommands,
            };
        } catch (error) {
            console.error('Erro ao obter enums:', error);
        }
    }
}



   /*
      
        return {
            PIZZA: {
                id: '1',
                name: 'Cantinho Di Itália',
                img: {
                    type: Enums.TYPES_IMG.FAS,
                    name: 'fa-light fa-pizza-slice'
                },
                listAdditionals: ACRESCIMOS.PIZZA,
                company: Enums.EMPRESAS.EMPRESA01,
            },
            ESPETO: {
                id: '2',
                name: 'Sr. & Sra. Espeto',
                img: {
                     type: Enums.TYPES_IMG.IMG,
                    name: './img/cardapio/burguers/espetoimg.svg'
                },
                listAdditionals:ACRESCIMOS.ESPETO,
                company: Enums.EMPRESAS.EMPRESA02,
            },
            BURGER: {
                id: '3',
                name: 'Bendito Burguer',
                img: {
                    type: Enums.TYPES_IMG.FAS,
                    name: 'fas fa-hamburger'
                },
                listAdditionals: ACRESCIMOS.BURGER,
                company: Enums.EMPRESAS.EMPRESA03,
            },
             KREPE: {
                id: '4',
                name: 'Dú Cheff Krepes' ,
                img: {
                    type: Enums.TYPES_IMG.IMG,
                     name: './img/cardapio/churrasco/CREPES.svg'
                },
                listAdditionals: ACRESCIMOS.KREPE,
                company: Enums.EMPRESAS.EMPRESA04,
            },

            SUSHI: {
                id: '5',
                name: 'THIAGO PEREIRA',
                img: {
                    type: Enums.TYPES_IMG.IMG,
                    name: './img/cardapio/churrasco/hashi.svg'
                },
                listAdditionals: undefined,
                company: Enums.EMPRESAS.EMPRESA05,
            }
			/*
            BEBIDAS: {
                id: '6',
                name: 'Vilinha Chopp',
                img: {
                    type: Enums.TYPES_IMG.FAS,
                    name: 'fas fa-cocktail'
                },
                listAdditionals: ACRESCIMOS.BEBIDAS,
                company: Enums.EMPRESAS.EMPRESA06,
            }
			
			
        }
    }
*/