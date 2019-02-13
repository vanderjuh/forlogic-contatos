import Paginacao from './paginacao'
import Eventos from './eventos'
import Filtro from './filtro'
import API from './api'

//SVGs
import favFullSvg from '../img/baseline-favorite-24px.svg'
import favBorderSvg from '../img/baseline-favorite_border-24px.svg'
import avatarSvg from '../img/round-person-24px.svg'
const Contatos = {

    listaContatos: {},
    listaPesquisa: {},

    //Buscar contatos pelo nome
    buscarContatos(nome) {
        Paginacao.redefinir()
        Contatos.listaPesquisa = Contatos.listaContatos.filter(e => {
            const nomeCompleto = `${e.firstName} ${e.lastName}`
            if (nomeCompleto.includes(nome)) {
                return e
            }
        })
        Contatos.init(Contatos.listaPesquisa)
    },

    //Favoritar o contato
    favoritar(element) {
        console.log(element.getAttribute('wm-id'))

        //lista.filter que pega o id bla bla

        const flag = (element.parentNode.parentNode.getAttribute('wm-favorito')) ? false : true
        if (flag) {
            element.src = favFullSvg
            element.title = 'Desfavoritar'
            element.parentNode.parentNode.setAttribute('wm-favorito', 'true')
        } else {
            element.src = favBorderSvg
            element.title = 'Favoritar'
            element.parentNode.parentNode.removeAttribute('wm-favorito')
        }
    },

    //Vefiricar se o cantato está favoritado e alterar icone de acordo.
    estaFavoritado(flag) {
        if (flag) {
            return favFullSvg
        } else {
            return favBorderSvg
        }
    },

    //Renderizar os contatos na DOM
    renderizarContatos(data, callback, paginaAtual, limitItens) {

        document.getElementsByClassName('lista_itens')[0].innerHTML = ''

        Paginacao.totalPaginas = Math.ceil(data.length / limitItens);
        let count = (paginaAtual * limitItens) - limitItens;
        let delimitador = count + limitItens;

        if (paginaAtual <= Paginacao.totalPaginas) {
            Paginacao.habilitarBotoes(true)
            for (let i = count; i < delimitador; i++) {
                if (data[i] != null) {
                    const a = document.createElement('a')
                    a.onclick = () => {
                        Contatos.renderizarDetalhes(data[i].id)
                        if (window.innerWidth <= 700) {
                            Contatos.openModal()
                        }
                    }

                    const li = document.createElement('li')
                    li.setAttribute('class', 'item_contato')

                    const icon = document.createElement('img')
                    icon.setAttribute('src', data[i].info.avatar)
                    icon.setAttribute('alt', 'Icone de contato')

                    const nome = document.createElement('div')
                    nome.setAttribute('class', 'nome_contato')
                    nome.innerText = `${data[i].firstName} ${data[i].lastName}`

                    const fav = document.createElement('img')
                    fav.setAttribute('class', 'fav')
                    fav.setAttribute('src', Contatos.estaFavoritado(data[i].isFavorite))
                    fav.setAttribute('wm-id', data[i].id)
                    if (data[i].isFavorite) {
                        a.setAttribute('wm-favorito', 'true')
                        fav.setAttribute('alt', 'Icone de favoritado')
                        fav.setAttribute('title', 'Desfavoritar')
                    } else {
                        fav.setAttribute('alt', 'Icone de desfavoritar')
                        fav.setAttribute('title', 'Favoritar')
                    }

                    li.append(icon)
                    li.append(nome)
                    li.append(fav)
                    a.append(li)

                    document.getElementsByClassName('lista_itens')[0].append(a)
                }
            }
            if (callback) {
                callback()
            }
        }
    },

    //Exibir detalhes do contato a partir do ID
    renderizarDetalhes(id) {
        Contatos.listaContatos.filter(e => {
            if (e.id == id) {
                document.getElementById('avatar').src = e.info.avatar
                document.getElementById('iNome').value = e.firstName
                document.getElementById('iSobrenome').value = e.lastName
                document.getElementById('iEmail').value = e.email
                if (e.gender == 'f') {
                    document.getElementById('gF').checked = true
                } else {
                    document.getElementById('gM').checked = true
                }
                document.getElementById('iAvatar').value = e.info.avatar
                document.getElementById('iCompanhia').value = e.info.company
                document.getElementById('iEndereco').value = e.info.address
                document.getElementById('iTelefone').value = e.info.phone
                document.getElementById('tComentario').value = e.info.comments
            }
        })
    },

    //Abrir modal
    openModal() {
        document.getElementsByClassName('detalhes_contato')[0].style.display = 'flex'
    },

    //Limpar o formulário do cadastro
    limparFormulario() {
        document.getElementById('avatar').src = avatarSvg
        document.getElementById('formCadastro').reset()
    },

    //Faz requisição, renderiza e atribui eventos aos contatos
    async init(resultados) {
        if (resultados) {
            Paginacao.redefinir()
            Contatos.renderizarContatos(resultados, Eventos.init, Paginacao.paginaAtual, 10)
        } else {
            if (Filtro.filtroSelecionado() == 'fTodos') {
                Contatos.listaContatos = await API.getContatos()
            } else {
                Contatos.listaContatos = await API.getContatosFavoritos()
            }
            Contatos.renderizarContatos(Contatos.listaContatos, Eventos.init, Paginacao.paginaAtual, 10)
        }
    }
    
}

export default Contatos