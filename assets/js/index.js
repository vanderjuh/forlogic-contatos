Contatos = {
    listaContatos: "",
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
    //Buscar contatos
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
    //Favoritar o cantato
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
    //Vefiricar se o cantato está favoritado e alterando icone de acordo.
    isFavorito(flag) {
        if (flag) {
            return "./assets/img/baseline-favorite-24px.svg"
        } else {
            return "./assets/img/baseline-favorite_border-24px.svg"
        }
    },
    //Renderizar os elementos na DOM
    async renderizarContatos(data, callback) {
        const lista = await data
        const elementos = lista.map(e => {

            const a = document.createElement('a')
            //a.setAttribute('href', `#contato${e.id}`)
            a.setAttribute('onclick',`Contatos.renderizarDetalhes(event, ${e.id})`)
            if (e.isFavorite) {
                a.setAttribute('wm-favorito', 'true')
            }

            const li = document.createElement('li')
            li.setAttribute('class', 'item_contato')

            const icon = document.createElement('img')
            icon.setAttribute('src', e.info.avatar)
            icon.setAttribute('alt', 'Icone de contato')

            const nome = document.createElement('div')
            nome.setAttribute('class', 'nome_contato')
            nome.innerText = `${e.firstName} ${e.lastName}`

            const fav = document.createElement('img')
            fav.setAttribute('class', 'fav')
            fav.setAttribute('src', this.isFavorito(e.isFavorite))
            fav.setAttribute('alt', '')
            fav.setAttribute('title', '')

            li.append(icon)
            li.append(nome)
            li.append(fav)
            a.append(li)

            document.getElementsByClassName('lista_itens')[0].append(a)
        })
        if (callback) {
            callback()
        }
    },
    renderizarDetalhes(event, id) {
        event.preventDefault()
        const contato = Contatos.listaContatos.filter(e => {
            if(e.id == id){
                document.getElementById('avatar').src = e.info.avatar
                document.getElementById('iNome').value = e.firstName
                document.getElementById('iSobrenome').value = e.lastName
                document.getElementById('iEmail').value = e.email
                if(e.gender == 'f'){
                    document.getElementById('gF').checked = true
                } else {
                    document.getElementById('gM').checked = true
                }
                document.getElementById('iCompanhia').value = e.info.company
                document.getElementById('iEndereco').value = e.info.address
                document.getElementById('iTelefone').value = e.info.phone
                document.getElementById('tComentario').value = e.info.comments
            }
        })
    }
}

API = {
    //Pegar os dados da API
    async getContatos() {
        const lista = await fetch('http://contacts-api.azurewebsites.net/api/contacts')
            .then(data => {
                return data.json()
            })
        Contatos.listaContatos = lista
        return Contatos.listaContatos
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

        // Array.from(document.querySelectorAll('.lista_itens a')).forEach(e => {
        //     e.onclick = function () {
        //         Contatos.renderizarDetalhes()
        //     }
        // })
    }
}

window.onload = function () {
    Contatos.renderizarContatos(API.getContatos(), Eventos.init)
}