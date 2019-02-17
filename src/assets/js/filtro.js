import Contatos from "./contatos";
import ElementosDOM from "./elementosDOM";
import Paginacao from "./paginacao";

const Filtro = {

    //Exibir na DOM todos os contatos
    mostrarTodos() {
        Contatos.renderizarContatos(Contatos.listaContatos)
        Filtro.limparPesquisa()
    },

    //Exibir na DOM apenas os favoritos
    mostrarFavoritos() {
        Contatos.renderizarContatos(Contatos.listaContatos)
        Filtro.limparPesquisa()
    },

    //Verifica ao filtro esta checked e aplica para exibição dos contatos
    aplicarFiltro() {
        Paginacao.redefinir()
        if (ElementosDOM.filtroMostrarTodos.checked) {
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