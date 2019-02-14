import Contatos from './contatos'
import ElementosDOM from './elementosDOM';

const Paginacao = {

    paginaAtual: 1,

    totalPaginas: 0,

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

}

export default Paginacao