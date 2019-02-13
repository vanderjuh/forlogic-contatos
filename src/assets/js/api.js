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
    },

    //Setar o contato como favorito
    async setContatoFavorito(contato, status) {
        contato.isFavorite = status
        return await fetch(
            `http://contacts-api.azurewebsites.net/api/contacts/${contato.id}`,
            {
                method: 'put',
                body: JSON.stringify(contato)
            }
        ).then(resp => {
            if(resp.status != 200){
                throw false
            }
            return true
        })
        .catch(e => {
            console.log('Erro ao mudar o status de favorito do contato: ', e)
            return false
        })
    }

}

export default API