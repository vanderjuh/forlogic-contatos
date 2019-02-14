import Contatos from "./contatos";
import ElementosDOM from "./elementosDOM";

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
        if(ElementosDOM.filtroMostrarTodos.checked){
            return 'fTodos'
        } else {
            return 'fFavoritos'
        }
    },

    limparPesquisa(){
        ElementosDOM.pesquisaInput.value = ''
    }

}

export default Filtro