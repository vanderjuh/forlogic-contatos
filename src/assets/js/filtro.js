const Filtro = {

    //Exibir na DOM todos os contatos
    mostrarTodos() {
        document.getElementsByClassName('fTodos')[0].checked = true
        const todos = document.querySelectorAll(".lista_itens a")
        todos.forEach(e => {
            e.removeAttribute('style')
        })
    },

    //Exibir na DOM apenas os favoritos
    mostrarFavoritos() {
        document.getElementsByClassName('fFavoritos')[0].checked = true
        const favs = document.querySelectorAll(".lista_itens a")
        favs.forEach(e => {
            if (!e.getAttribute('wm-favorito')) {
                e.style.display = 'none';
            }
        })
    },

    //Verifica ao filtro esta checked e aplica para exibição dos contatos
    aplicarFiltro() {
        if (document.getElementsByClassName('fTodos')[0].checked) {
            Filtro.mostrarTodos()
        } else {
            Filtro.mostrarFavoritos()
        }
    }

}

export default Filtro