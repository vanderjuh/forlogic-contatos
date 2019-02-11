Contatos = {

    mostrarTodos() {
        const favs = document.querySelectorAll("#lista_itens a")
        favs.forEach(e => {
            if(!e.getAttribute('wm-favorito')){
                e.style.display = 'block';
            }
        })
    },
    mostrarFavoritos() {
        const favs = document.querySelectorAll("#lista_itens a")
        favs.forEach(e => {
            if(!e.getAttribute('wm-favorito')){
                e.style.display = 'none';
            }
        })
    }

}