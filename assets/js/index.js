Contatos = {
    listaContatos: {},
    //Exibir na DOM todos os contatos
    mostrarTodos() {
        const todos = document.querySelectorAll(".lista_itens a")
        todos.forEach(e => {
            e.removeAttribute('style')
        })
    },
    //Exibir na DOM apenas os favoritos
    mostrarFavoritos() {
        const favs = document.querySelectorAll(".lista_itens a")
        favs.forEach(e => {
            if (!e.getAttribute('wm-favorito')) {
                e.style.display = 'none';
            }
        })
    },
    //Buscar contatos pelo nome
    buscarContatos(nome) {
        this.mostrarTodos()
        const todos = document.querySelectorAll(".nome_contato")
        if (nome) {
            todos.forEach(e => {
                if (!e.innerHTML.includes(nome)) {
                    e.parentNode.parentNode.style.display = 'none'
                }
            })
        }
    },
    //Favoritar o contato
    favoritar(element) {
        flag = (element.parentNode.parentNode.getAttribute('wm-favorito')) ? false : true
        if (flag) {
            element.src = './assets/img/baseline-favorite-24px.svg'
            element.title = 'Desfavoritar'
            element.parentNode.parentNode.setAttribute('wm-favorito', 'true')
        } else {
            element.src = './assets/img/baseline-favorite_border-24px.svg'
            element.title = 'Favoritar'
            element.parentNode.parentNode.removeAttribute('wm-favorito')
        }
    },
    //Vefiricar se o cantato está favoritado e alterar icone de acordo.
    isFavorito(flag) {
        if (flag) {
            return "./assets/img/baseline-favorite-24px.svg"
        } else {
            return "./assets/img/baseline-favorite_border-24px.svg"
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
                    a.setAttribute('onclick', `Contatos.renderizarDetalhes(event, ${data[i].id})`)

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
                    fav.setAttribute('src', this.isFavorito(data[i].isFavorite))
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
    renderizarDetalhes(event, id) {
        event.preventDefault()
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
    }
}

Paginacao = {
    paginaAtual: 1,
    totalPaginas: 0,
    //Habilitar paginador de contatos
    habilitarBotoes(flag = true) {
        if (flag) {
            document.getElementsByClassName('paginacao')[0].style.display = 'flex'
        } else {
            document.getElementsByClassName('paginacao')[0].style.display = 'none'
        }
    }
}

API = {
    //Pegar os dados da API
    async getContatos() {
        const lista = await fetch('http://contacts-api.azurewebsites.net/api/contacts')
            .then(data => {
                return data.json()
            })
        return lista
    }
}

Eventos = {
    init() {
        //Filtrar por: Todos
        document.getElementsByName('filtro')[0].onclick = function () {
            Contatos.mostrarTodos()
        }

        //Filtrar por: Favoritos
        document.getElementsByName('filtro')[1].onclick = function () {
            Contatos.mostrarFavoritos()
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
        document.getElementById('pagProximo').onclick = function () {
            event.preventDefault()
            if (Paginacao.paginaAtual < Paginacao.totalPaginas) {
                Paginacao.paginaAtual++
                Contatos.renderizarContatos(Contatos.listaContatos, Eventos.init, Paginacao.paginaAtual, 10)
            }
        }

        //Setar evento do botão de voltar do paginador
        document.getElementById('pagVoltar').onclick = function () {
            event.preventDefault()
            if (Paginacao.paginaAtual > 1) {
                Paginacao.paginaAtual--
                Contatos.renderizarContatos(Contatos.listaContatos, Eventos.init, Paginacao.paginaAtual, 10)
            }
        }
    }
}

window.onload = async function () {
    Contatos.listaContatos = await API.getContatos()
    Contatos.renderizarContatos(Contatos.listaContatos, Eventos.init, Paginacao.paginaAtual, 10)
}