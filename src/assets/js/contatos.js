import Paginacao from './paginacao'
import Eventos from './eventos'
import Filtro from './filtro'
import API from './api'
import ElementosDOM from './elementosDOM'

//SVGs
import favFullSvg from '../img/baseline-favorite-24px.svg'
import favBorderSvg from '../img/baseline-favorite_border-24px.svg'
import avatarSvg from '../img/round-person-24px.svg'

const Contatos = {

    listaContatos: [],
    listaPesquisa: [],

    //Buscar contatos pelo nome
    buscarContatos(nome) {
        Paginacao.redefinir()
        Contatos.listaPesquisa = Contatos.listaContatos.filter(e => {
            const nomeCompleto = `${e.firstName} ${e.lastName}`
            if (nomeCompleto.includes(nome)) { return e }
        })
        Contatos.renderizarContatos(Contatos.listaPesquisa)
    },

    //Favoritar o contato
    async favoritar(element, status) {
        if (status != undefined) {
            const contato = Contatos.listaContatos.filter(e => element.getAttribute('wm-id') == e.id)[0]
            if (contato) {
                contato.isFavorite = status
                const res = await API.updateContato(contato)
                if (res) {
                    const statusAtual = (element.parentNode.parentNode.getAttribute('wm-favorito')) ? false : true
                    if (statusAtual) {
                        element.src = favFullSvg
                        element.title = 'Desfavoritar'
                        element.parentNode.parentNode.setAttribute('wm-favorito', 'true')
                    } else {
                        element.src = favBorderSvg
                        element.title = 'Favoritar'
                        element.parentNode.parentNode.removeAttribute('wm-favorito')
                    }
                } else {
                    const msg = 'Não foi possível alterar o status de favorito do contato!'
                    alert(msg)
                    throw msg
                }
            } else { throw 'Erro. Contato não encontrado' }
        } else { throw 'Erro. É necessário passar um status de favorito para o contato' }
    },

    //Editar informações do contato
    async updateContato() {
        if (Contatos.validarFormulario()) {
            const formDados = {
                id: ElementosDOM.iIdContato.value,
                firstName: ElementosDOM.iNome.value,
                lastName: ElementosDOM.iSobrenome.value,
                email: ElementosDOM.iEmail.value,
                gender: (ElementosDOM.iFeminino.checked == true) ? 'f' : 'm',
                isFavorite: false,
                info: {
                    company: ElementosDOM.iCompanhia.value,
                    avatar: ElementosDOM.iAvatar.value,
                    address: ElementosDOM.iEndereco.value,
                    phone: ElementosDOM.iTelefone.value,
                    comments: ElementosDOM.tComentario.value
                }
            }
            const resp = await API.updateContato(formDados)
            if (resp) {
                Contatos.listaContatos = Contatos.listaContatos.map(e => {
                    if (e.id == formDados.id) { e = formDados }
                    return e
                })
                Contatos.renderizarContatos(Contatos.listaContatos)
                Contatos.limparFormulario()
                alert('Contato editado com sucesso!')
            }
        }
    },

    //Deletar contato
    async deletarContato() {
        const iIdContato = ElementosDOM.iIdContato.value
        if (iIdContato && confirm('Deseja realmente deletar este contato?')) {
            const resp = await API.deleteContato(iIdContato)
            if (resp) {
                for (let i = 0; i < Contatos.listaContatos.length; i++) {
                    if (Contatos.listaContatos[i].id == iIdContato) {
                        delete Contatos.listaContatos[i]
                    }
                }
                Contatos.renderizarContatos(Contatos.listaContatos)
                Contatos.limparFormulario()
                alert('Contato deletado com sucesso!')
            }
        }
    },

    //Criar novo contato
    async criarNovoContato() {
        if (Contatos.validarFormulario()) {
            const formDados = {
                firstName: ElementosDOM.iNome.value,
                lastName: ElementosDOM.iSobrenome.value,
                email: ElementosDOM.iEmail.value,
                gender: (ElementosDOM.iFeminino.checked == true) ? 'f' : 'm',
                isFavorite: false,
                company: ElementosDOM.iCompanhia.value,
                avatar: ElementosDOM.iAvatar.value,
                address: ElementosDOM.iEndereco.value,
                phone: ElementosDOM.iTelefone.value,
                comments: ElementosDOM.tComentario.value
            }
            const resp = await API.createContato(formDados)
            if (resp) {
                Contatos.init() //Restarta a aplicação para pegar o ID do novo contato
                Contatos.limparFormulario()
                alert('Contato salvo com sucesso!')
            }
        }
    },

    //Renderizar os contatos na DOM
    renderizarContatos(data) {

        //Iniciando a paginacao
        Paginacao.init(data.length)

        //Limpa o container de itens HTML dos contatos
        ElementosDOM.lista_itens.innerHTML = ''

        if (Paginacao.paginaAtual <= Paginacao.totalPaginas) {
            Paginacao.habilitarBotoes(true)
            for (let i = Paginacao.count; i < Paginacao.delimitador; i++) {

                //Evita itens undefineds
                if (data[i] == undefined) {
                    continue
                }

                if (Filtro.filtroSelecionado() == 'fFavoritos') {
                    if (!data[i].isFavorite) {
                        Paginacao.delimitador++
                        continue
                    }
                }

                //Criação dos itens HTML da lista de contatos
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
                fav.setAttribute('src', (data[i].isFavorite == true) ? favFullSvg : favBorderSvg)
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

                //Inseri o item gerado na DOM
                ElementosDOM.lista_itens.append(a)
            }

            //Seta os eventos para os itens HTML gerados
            Eventos.init()
        }
    },

    //Exibir detalhes do contato a partir do ID
    renderizarDetalhes(id) {
        Contatos.listaContatos.filter(e => {
            if (e.id == id) {
                ElementosDOM.buttonFechar.style.display = 'flex'
                ElementosDOM.iIdContato.value = e.id
                ElementosDOM.avatar.src = e.info.avatar
                ElementosDOM.iNome.value = e.firstName
                ElementosDOM.iSobrenome.value = e.lastName
                ElementosDOM.iEmail.value = e.email
                if (e.gender == 'f') {
                    ElementosDOM.iFeminino.checked = true
                } else {
                    ElementosDOM.iMasculino.checked = true
                }
                ElementosDOM.iAvatar.value = e.info.avatar
                ElementosDOM.iCompanhia.value = e.info.company
                ElementosDOM.iEndereco.value = e.info.address
                ElementosDOM.iTelefone.value = e.info.phone
                ElementosDOM.tComentario.value = e.info.comments
                ElementosDOM.bRemover.style.display = 'flex'
                return
            }
        })
    },

    //Abrir modal
    openModal() {
        ElementosDOM.detalhes_contato.style.display = 'flex'
    },

    //Limpar o formulário do cadastro
    limparFormulario() {
        if (window.innerWidth <= 700) {
            ElementosDOM.detalhes_contato.removeAttribute('style')
        } else {
            ElementosDOM.buttonFechar.removeAttribute('style')
        }
        ElementosDOM.bRemover.removeAttribute('style')
        ElementosDOM.avatar.src = avatarSvg
        ElementosDOM.iIdContato.removeAttribute('value')
        ElementosDOM.formCadastro.reset()
    },

    //Validar o formulário de cadastro
    validarFormulario() {

        const array = []

        const alertBorda = (elements) => {
            alert('Preencha todos os campos corretamente!')
            elements.forEach(e => {
                e.style.border = 'red solid 1px'
                e.style.background = '#FFF0F5'
                if (e.type == 'radio') {
                    e.style.outline = 'red solid 1px'
                }
            })
            setTimeout(() => {
                elements.forEach(e => {
                    e.removeAttribute('style')
                })
            }, 5000)
        }

        if (ElementosDOM.iNome.value == '') array.push(ElementosDOM.iNome)
        if (ElementosDOM.iSobrenome.value == '') array.push(ElementosDOM.iSobrenome)
        if (ElementosDOM.iEmail.value == '') {
            array.push(ElementosDOM.iEmail)
        } else {
            if (!ElementosDOM.iEmail.value.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
                array.push(ElementosDOM.iEmail)
            }
        }
        if (!ElementosDOM.iFeminino.checked) {
            if (!ElementosDOM.iMasculino.checked) {
                array.push(ElementosDOM.iFeminino)
                array.push(ElementosDOM.iMasculino)
            }
        }
        if (ElementosDOM.iAvatar.value == '') {
            array.push(ElementosDOM.iAvatar)
        } else {
            if (!ElementosDOM.iAvatar.value.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g)) {
                array.push(ElementosDOM.iAvatar)
            }
        }
        if (ElementosDOM.iCompanhia.value == '') array.push(ElementosDOM.iCompanhia)
        if (ElementosDOM.iEndereco.value == '') array.push(ElementosDOM.iEndereco)
        if (ElementosDOM.iTelefone.value == '') array.push(ElementosDOM.iTelefone)
        if (ElementosDOM.iCompanhia.value == '') array.push(ElementosDOM.iCompanhia)

        if (array.length > 0) {
            alertBorda(array)
            return false
        }

        return true
    },

    //Faz requisição, renderiza e atribui eventos aos contatos
    async init() {
        Contatos.listaContatos = await API.getContatos()
        Contatos.renderizarContatos(Contatos.listaContatos)
    }

}

export default Contatos