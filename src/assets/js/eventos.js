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
                Contatos.favoritar(this)
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
    }

}

export default Eventos