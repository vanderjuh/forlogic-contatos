import Contatos from './contatos'
import Paginacao from './paginacao'
import Filtro from './filtro'

const Eventos = {

    init() {
        //Filtrar por: Todos
        document.getElementsByName('filtro')[0].onclick = () => {
            Filtro.mostrarTodos()
        }

        //Filtrar por: Favoritos
        document.getElementsByName('filtro')[1].onclick = () => {
            Filtro.mostrarFavoritos()
        }

        //Pesquisar conforme for digitando
        document.getElementsByClassName('pesquisaInput')[0].onkeyup = function () {
            Contatos.buscarContatos(this.value)
        }

        //Setar eventos aos clicks dos icones de favorito
        Array.from(document.getElementsByClassName('fav')).forEach(e => {
            e.onclick = function () {
                if(this.parentElement.parentElement.hasAttribute('wm-favorito')){
                    Contatos.favoritar(this, false)
                } else {
                    Contatos.favoritar(this, true)
                }
            }
        })

        //Setar evento do botão de próximo do paginador
        document.getElementById('pagProximo').onclick = () => {
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
        document.getElementById('pagVoltar').onclick = () => {
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
        document.getElementsByClassName('buttonFechar')[0].onclick = function () {
            if (window.innerWidth <= 700) {
                document.getElementsByClassName('detalhes_contato')[0].style.display = 'none'
            } else {
                document.getElementsByClassName('buttonFechar')[0].style.display = 'none'
                document.getElementById('bRemover').style.display = 'none'
                Contatos.limparFormulario()
            }
        }

        /*Caso a div de detalhes do contato seja marcada com "display:none" quando
        * alterado a resolução, esta função monitora esta mudança e corrige.
        */
        window.onresize = function(){
            if (window.innerWidth > 700) {
                document.getElementsByClassName('detalhes_contato')[0].removeAttribute('style')
            }
        }

        //Abre modal preparada para inserir novo contato
        document.getElementById('bNovoContato').onclick = function(){
            Contatos.limparFormulario()
            Contatos.openModal()
            document.getElementsByClassName('buttonFechar')[0].style.display = 'flex'
        }

        //Remover contato
        document.getElementById('bRemover').onclick = function(){
            Contatos.deletarContato()
        }

    }
}

export default Eventos