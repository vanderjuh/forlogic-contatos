import Contatos from "./contatos";

const Filtro = {

    //Exibir na DOM todos os contatos
    mostrarTodos() {
        Contatos.init()
        Filtro.limparPesquisa()
    },

    //Exibir na DOM apenas os favoritos
    mostrarFavoritos() {
        Contatos.init()
        Filtro.limparPesquisa()
    },

    //Verifica ao filtro esta checked e aplica para exibição dos contatos
    aplicarFiltro() {
        if (document.getElementsByClassName('fTodos')[0].checked) {
            Filtro.mostrarTodos()
        } else {
            Filtro.mostrarFavoritos()
        }
    },

    filtroSelecionado(){
        const todos = document.getElementsByClassName('fTodos')[0]
        const fav = document.getElementsByClassName('fFavoritos')[0]
        if(todos.checked){
            return 'fTodos'
        } else {
            return 'fFavoritos'
        }
    },

    limparPesquisa(){
        document.getElementsByClassName('pesquisaInput')[0].value = ''
    }

}

export default Filtro