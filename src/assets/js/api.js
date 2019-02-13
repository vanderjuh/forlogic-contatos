const API = {

    //Pegar todos os contatos
    async getContatos() {
        const lista = await fetch('http://contacts-api.azurewebsites.net/api/contacts')
            .then(data => {
                return data.json()
            })
        return lista
    },

    //Pegar todos os contatos favoritados
    async getContatosFavoritos() {
        const lista = await fetch('http://contacts-api.azurewebsites.net/api/contacts')
            .then(data => {
                return data.json()
            })
        return lista.filter(e => {
            if (e.isFavorite) {
                return e
            }
        })
    }

}

export default API