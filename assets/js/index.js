Contatos = {
    mostrarTodos() {
        const todos = document.querySelectorAll(".lista_itens a")
        todos.forEach(e => {
            e.removeAttribute('style')
        })
    },
    mostrarFavoritos() {
        const favs = document.querySelectorAll(".lista_itens a")
        favs.forEach(e => {
            if (!e.getAttribute('wm-favorito')) {
                e.style.display = 'none';
            }
        })
    },
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
    favoritar(element) {
        console.log('Teste:', element.parentNode.parentNode.getAttribute('wm-favorito'))
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
    }
}

window.onload = function () {
    document.getElementsByName('filtro')[0].onclick = function () {
        Contatos.mostrarTodos()
    }
    document.getElementsByName('filtro')[1].onclick = function () {
        Contatos.mostrarFavoritos()
    }
    document.getElementsByClassName('pesquisaInput')[0].onkeyup = function () {
        Contatos.buscarContatos(this.value)
    }
    Array.from(document.getElementsByClassName('fav')).forEach(e => {
        e.onclick = function () {
            Contatos.favoritar(this)
        }
    })
    Contatos.preventEventFav()
}