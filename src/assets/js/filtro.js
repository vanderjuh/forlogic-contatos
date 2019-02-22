import Contatos from "./contatos"
import ElementosDOM from "./elementosDOM"
import Paginacao from "./paginacao"

const Filtro = {

    //Verifica ao filtro esta checked e aplica para exibição dos contatos
    aplicarFiltro() {
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