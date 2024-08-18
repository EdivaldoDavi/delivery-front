

// Função para obter as categorias da API
async function obterCategorias() {

    const responseCategorias = await fetch('http://10.10.10.38:3000/categorias');
    const resultCategorias = await responseCategorias.json();
    if (!Array.isArray(resultCategorias.data)) {
        throw new TypeError('Dados dos produtos não são um array');
    }
  
    return resultCategorias.data;

}
// Função para obter as Empresas da API
async function obterEmpresas() {
    const empresasResponse = await fetch('http://10.10.10.38:3000/empresas');
    const empresasResult = await empresasResponse.json();

    if (!Array.isArray(empresasResult.data)) {
        throw new TypeError('Dados dos produtos não são um array');
    }
    
    return empresasResult.data;
}


// Função para obter as Empresas da API
async function obterOpcionais() {
    const opcionaisResponse = await fetch('http://10.10.10.38:3000/opcionais');
    const opcionaisResult = await opcionaisResponse.json();

    const opcionais = opcionaisResult.data;

    if (!Array.isArray(opcionaisResult.data)) {
        throw new TypeError('Dados dos produtos não são um array');
    }
    
    return opcionaisResult.data;

}

// Função para obter as TiposComanda da API
async function obterTiposComanda() {
    const tiposResponse = await fetch('http://10.10.10.38:3000/tipocomanda');
    const tiposResult = await tiposResponse.json();

    const typesCommands = tiposResult.data;

    if (!Array.isArray(tiposResult.data)) {
        throw new TypeError('Dados dos produtos não são um array');
    }

  /*  let objComandas = {};
    typesCommands.forEach(cmd => {
        objComandas[cmd.typesCommands] = {
            id: cmd.idtipocomanda.toString(),
            idempresa: cmd.idempresatipocomanda,
            name: cmd.tipodescricao,
        }
    });
*/
   
    return typesCommands;
}


async function getTYPES_IMG() {
    return {
        FAS: 'FAS',
      
    };
}

// Função para obter as TiposComanda da API
async function obterTiposComandaEmpresa() {
    const tiposResponse = await fetch('http://10.10.10.38:3000/tipocomandaempresa');
    const tiposResult = await tiposResponse.json();

    const typesCommands = tiposResult.data;
   
    if (!Array.isArray(tiposResult.data)) {
        throw new TypeError('Dados dos produtos não são um array');
    }

   

   
    return tiposResult.data;
}

async function getCATEGORIES(EMPRESAS, TYPES_IMG) {
    try {
     
        const categorias = await obterCategorias();
        const empresas = await obterEmpresas();
        //const empresas = EMPRESAS;
        const opcionais = await obterOpcionais();

        // Verificação de existência e tipo dos dados
        if (!Array.isArray(categorias) || !Array.isArray(empresas) || !Array.isArray(opcionais)) {
            throw new TypeError('Dados obtidos não são arrays');
        }

        const adicionaisMap = opcionais.reduce((acc, opc) => {
            const empresa = empresas.find(emp => emp.idempresa.toString() === opc.idopcionalitemempresa.toString());
            const empresaNome = empresa ? `EMPRESA${empresa.idempresa}` : null;
            if (empresaNome) {
                if (!acc[empresaNome]) {
                    acc[empresaNome] = [];
                }
                acc[empresaNome].push({
                    id: opc.idopcionalitem || 'ID não encontrado',
                    price: opc.price,
                    name: opc.nome || 'Nome não encontrado'
                });
            }
            return acc;
        }, {});

        const categoriasMap = categorias.reduce((acc, cat) => {
            const empresa = empresas.find(emp => emp.idempresa.toString() == cat.idcategoriaempresa.toString());
            const empresaNome = empresa ? `EMPRESA${empresa.idempresa}` : null;

            acc[cat.nome.toUpperCase()] = {
                id: cat.idcategoria ? cat.idcategoria.toString() : 'ID não encontrado',
                name: cat.nome || 'Nome não encontrado',
                img: {
                    type: 'FAS',
                    name: 'fa-'+cat.icone || 'Icone não encontrado'
                },
                listAdditionals: adicionaisMap[empresaNome] || [],
                company: empresaNome ? (EMPRESAS && EMPRESAS[empresaNome] ? EMPRESAS[empresaNome] : 'Empresa não encontrada') : 'Empresa não encontrada'
            };
             
            return acc;
        }, {});

        return categoriasMap;
    } catch (error) {
        console.error('Erro ao obter categorias:', error);
        return {};
    }
}

// Exemplo de uso
(async () => {
    const categorias = await getCATEGORIES();
    
})();

async function getEMPRESAS() {
   // try {
   //     const empresas = await obterEmpresas();
     //   const tiposComandas = await obterTiposComanda();
     //   const tiposComandasEmpresa = await obterTiposComandaEmpresa();
      //  console.log(tiposComandasEmpresa)
        try {
            const empresas = await obterEmpresas();
            const tiposComandas = await obterTiposComanda();
            const tiposComandasEmpresa = await obterTiposComandaEmpresa();
    
            if (!Array.isArray(empresas) || !Array.isArray(tiposComandas) || !Array.isArray(tiposComandasEmpresa)) {
                throw new TypeError('Dados obtidos não são arrays');
            }
    
            // Mapeia os tipos de comanda por empresa
            const tiposComandasMap = tiposComandasEmpresa.reduce((acc, registroempresa) => {
                if (!acc[registroempresa.idempresa]) {
                    acc[registroempresa.idempresa] = [];
                }
           
                const tipoComanda = tiposComandas.find(tipocomanda => tipocomanda.idtipocomanda === registroempresa.idtipocomanda);
                if (tipoComanda) {
                    acc[registroempresa.idempresa].push(tipoComanda);
                }
           
                return acc;
            }, {});
    
            // Mapeia as empresas
            const empresasMap = empresas.reduce((acc, emp) => {
                const empresaTiposComandas = tiposComandasMap[emp.idempresa] || [];
                acc[`EMPRESA${emp.idempresa}`] = {
                    id: emp.idempresa.toString(),
                    name: emp.nome,
                    telOrder: emp.telorder || 'Telefone não disponível',
                    priceDelivery: emp.priceDelivery || 'Preço de entrega não disponível',
                    typesCommands: empresaTiposComandas
                };
                return acc;
            }, {});
         
            return empresasMap;
        } catch (error) {
            console.error('Erro ao obter empresas:', error);
            return {};
        }
    }
    
    async function getTYPES_COMMANDS() {
        try {
            // Obtém os tipos de comandas
            const responseTipos = await fetch('http://10.10.10.38:3000/tipocomanda');
            const resultTipos = await responseTipos.json();
            const tiposComandas = resultTipos.data;
    
            // Obtém os tipos de comandas por empresa
            const responseTiposEmpresa = await fetch('http://10.10.10.38:3000/tipocomandaempresa');
            const resultTiposEmpresa = await responseTiposEmpresa.json();
            const tiposComandasEmpresa = resultTiposEmpresa.data;
    
            // Verificação se os dados são arrays
            if (!Array.isArray(tiposComandas) || !Array.isArray(tiposComandasEmpresa)) {
                throw new TypeError('Dados obtidos não são arrays');
            }
    
            // Mapeia os tipos de comanda por empresa
            const tiposComandasMap = tiposComandas.reduce((acc, tipo) => {
                const empresasComEsseTipo = tiposComandasEmpresa.filter(registroempresa => registroempresa.idtipocomanda === tipo.idtipocomanda );
                empresasComEsseTipo.forEach(registroempresa => {
                    //const empresaNome = `EMPRESA${registroempresa.idempresa}`;
                  //  if (!acc[empresaNome]) {
                  //      acc[empresaNome] = {};
                //    }
                    acc[tipo.typesCommands.toUpperCase()] = {
                        id: tipo.idtipocomanda ? tipo.idtipocomanda.toString() : 'ID não encontrado',
                        name: tipo.typesCommands || 'Nome não encontrado',
                        tipodescricao:tipo.tipodescricao || "descrição não encontrada",
                    };
                });
                return acc;
            }, {});
       
            return tiposComandasMap;
        } catch (error) {
            console.error('Erro ao obter tipos de comandas:', error);
            return {};
        }
    }
      /*  

async function getTYPES_COMMANDS() {
    try {
        const response = await fetch('http://10.10.10.38:3000/tipocomanda');
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
            console.log(acc)
            return acc;
        }, {});

        return tiposComandasMap;
    } catch (error) {
        console.error('Erro ao obter tipos de comandas:', error);
        return {};
    }
}

*/
async function criarEnums() {
    try {

        //  const categories = await getCATEGORIES();
        const empresas = await getEMPRESAS();

        const TYPES_IMG = await getTYPES_IMG();
        const typesCommands = await getTYPES_COMMANDS();
        const categories = await getCATEGORIES(empresas, TYPES_IMG);

        return {
            EMPRESAS: empresas,
            CATEGORIES: categories,
            TYPES_IMG: TYPES_IMG,
            TYPES_COMMANDS: typesCommands
        };
    } catch (error) {
        console.error('Erro ao criar enums:', error);
        return {};
    }
}

async function inicializarEnums() {
    const enums = await criarEnums();
    return enums;
}

const Enums = await inicializarEnums();
export { Enums };
