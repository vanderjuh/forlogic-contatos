import Contatos from './contatos'
import ElementosDOM from './elementosDOM';

const Paginacao = {

    //Página atual
    paginaAtual: 1,

    //Total de páginas
    totalPaginas: 0,

    //Itens por página
    limitItens: 10,

    //Determina o item inicial de cada página
    count: -1,

    //Determina o item final de cada página
    delimitador: -1,
    
    //Habilitar paginador de contatos
    habilitarBotoes(flag = true) {
        if (flag) {
            ElementosDOM.paginacao.style.display = 'flex'
        } else {
            ElementosDOM.paginacao.removeAttribute('style')
        }
    },

    //Redefine os valores da paginação
    redefinir(){
        Paginacao.paginaAtual = 1
        Paginacao.totalPaginas = 0
    },

    //Verifica se o usuário está fazendo uma pesquisa
    estaProcurando(){
        if(ElementosDOM.pesquisaInput.value && Contatos.listaPesquisa.length != 0){
            return true
        }
        return false
    },

    init(qtdItens){
        //Total de páginas possíveis
        Paginacao.totalPaginas = Math.ceil(qtdItens / Paginacao.limitItens);
        //Determina o item inicial de cada página
        Paginacao.count = (Paginacao.paginaAtual * Paginacao.limitItens) - Paginacao.limitItens;
        //Determina o item final de cada página
        Paginacao.delimitador = Paginacao.count + Paginacao.limitItens;
    }

}

export default Paginacao