import Contatos from './contatos'

const Paginacao = {

    paginaAtual: 1,

    totalPaginas: 0,

    //Habilitar paginador de contatos
    habilitarBotoes(flag = true) {
        if (flag) {
            document.getElementsByClassName('paginacao')[0].style.display = 'flex'
        } else {
            document.getElementsByClassName('paginacao')[0].style.display = 'none'
        }
    },

    //Redefine os valores da paginação
    redefinir(){
        Paginacao.paginaAtual = 1
        Paginacao.totalPaginas = 0
    },

    //Verifica se o usuário está fazendo uma pesquisa
    estaProcurando(){
        if(document.getElementsByClassName('pesquisaInput')[0].value && Contatos.listaPesquisa.length != 0){
            return true
        }
        return false
    },

}

export default Paginacao