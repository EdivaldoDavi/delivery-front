//import { ACRESCIMOS } from "./dados.js";

export class Enums {
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
                    typesCommands: comandos.map(cmd => `Enums.TYPES_COMMANDS.${cmd.typesCommands.toUpperCase()}`)
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
                acc[tipo.typesCommands.toUpperCase()] = {
                    id: tipo.idtipocomanda ? tipo.idtipocomanda.toString() : 'ID não encontrado',
                    name: tipo.tipodescricao || 'Nome não encontrado',
                };
                return acc;
            }, {});

            return tiposComandasMap;
        } catch (error) {
            console.error('Erro ao obter tipos de comandas:', error);
        }
    }

    static async getCATEGORIAS() {
        try {
            const response = await fetch('http://localhost:3000/categorias');
            const result = await response.json();
            const categorias = result.data;
         
            if (!Array.isArray(categorias)) {
                throw new TypeError('Categorias não são um array');
            }

            
             
            return categorias;
        } catch (error) {
            console.error('Erro ao obter categorias:', error);
        }
    }

    static async getEnums() {
        try {
            const categorias = await Enums.getCATEGORIAS();
            const categories = await Enums.getCATEGORIES();
          
           // const empresas = await Enums.getEMPRESAS();
            const typesCommands = await Enums.getTYPES_COMMANDS();

            return {
                TYPES_IMG: Enums.TYPES_IMG,
                EMPRESAS: empresas,
                CATEGORIAS: categorias,
              //  ACRESCIMOS: ACRESCIMOS,
                CATEGORIES: categories,
                TYPES_COMMANDS: typesCommands,
            };
        } catch (error) {
            console.error('Erro ao obter enums:', error);
        }
    }
}
