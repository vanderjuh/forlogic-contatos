import Contatos from "./contatos";
import ElementosDOM from "./elementosDOM";
import Paginacao from "./paginacao";
import LocalStorage from './localStorage'

const Filtro = {

    //Verifica ao filtro esta checked e aplica para exibição dos contatos
    aplicarFiltro() {
        if(LocalStorage.getFiltro() == 'fTodos'){
            ElementosDOM.filtroMostrarTodos.checked = true
        } else {
            ElementosDOM.filtroMostrarFavoritos.checked = true
        }
        LocalStorage.salvarFiltroSelecionado()
        Filtro.limparPesquisa()
        Paginacao.redefinir()
        Contatos.renderizarContatos(Contatos.listaContatos)
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