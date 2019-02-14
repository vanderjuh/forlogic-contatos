import Contatos from './contatos'
import Paginacao from './paginacao'
import Filtro from './filtro'
import ElementosDOM from './elementosDOM'

//SVG
import avatarSvg from '../img/round-person-24px.svg'

const Eventos = {

    init() {
        //Filtrar por: Todos
        ElementosDOM.filtroMostrarTodos.onclick = () => {
            Filtro.mostrarTodos()
        }

        //Filtrar por: Favoritos
        ElementosDOM.filtroMostrarFavoritos.onclick = () => {
            Filtro.mostrarFavoritos()
        }

        //Pesquisar conforme for digitando
        ElementosDOM.pesquisaInput.onkeyup = function () {
            Contatos.buscarContatos(this.value)
        }

        //Setar eventos aos clicks dos icones de favorito
        Array.from(ElementosDOM.fav).forEach(e => {
            e.onclick = function () {
                if(this.parentElement.parentElement.hasAttribute('wm-favorito')){
                    Contatos.favoritar(this, false)
                } else {
                    Contatos.favoritar(this, true)
                }
            }
        })

        //Setar evento do botão de próximo do paginador
        ElementosDOM.pagProximo.onclick = () => {
            event.preventDefault()
            if (Paginacao.paginaAtual < Paginacao.totalPaginas) {
                Paginacao.paginaAtual++
                let lista = {}
                if (Paginacao.estaProcurando()) {
                    lista = Contatos.listaPesquisa
                } else {
                    lista = Contatos.listaContatos
                }
                Contatos.renderizarContatos(lista, Eventos.init, Paginacao.paginaAtual, 10)
            }
        }

        //Setar evento do botão de voltar do paginador
        ElementosDOM.pagVoltar.onclick = () => {
            event.preventDefault()
            if (Paginacao.paginaAtual > 1) {
                Paginacao.paginaAtual--
                let lista = {}
                if (Paginacao.estaProcurando()) {
                    lista = Contatos.listaPesquisa
                } else {
                    lista = Contatos.listaContatos
                }
                Contatos.renderizarContatos(lista, Eventos.init, Paginacao.paginaAtual, 10)
            }
        }

        //Dependendo da resolução da tela o botão de fechar realiza uma função diferente
        ElementosDOM.buttonFechar.onclick = function () {
            Contatos.limparFormulario()
        }

        /*Caso a div de detalhes do contato seja marcada com "display:none" quando
        * alterado a resolução, esta função monitora esta mudança e corrige.
        */
        window.onresize = function(){
            if (window.innerWidth > 700) {
                ElementosDOM.detalhes_contato.removeAttribute('style')
            }
        }

        //Abre modal preparada para inserir novo contato
        ElementosDOM.bNovoContato.onclick = function(){
            Contatos.limparFormulario()
            Contatos.openModal()
            ElementosDOM.buttonFechar.style.display = 'flex'
        }

        //Salvar contato
        ElementosDOM.bSalvar.onclick = function(){
            if(ElementosDOM.iIdContato.value){
                console.log('Editar')
            } else {
                Contatos.criarNovoContato()
            }
        }

        //Remover contato
        ElementosDOM.bRemover.onclick = function(){
            Contatos.deletarContato()
        }

        //Alteração do avatar
        ElementosDOM.iAvatar.onkeyup = function(){
            if(this.value.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g)){
                ElementosDOM.avatar.src = this.value
            } else {
                ElementosDOM.avatar.src = avatarSvg
            }
        }
    }
}

export default Eventos