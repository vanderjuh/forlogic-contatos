const API = {

    //Pegar todos os contatos
    async getContatos() {
        const lista = await fetch('http://contacts-api.azurewebsites.net/api/contacts?limit=100')
            .then(resp => {
                if (resp.status != 200) {
                    throw `${resp.statusText} (${resp.status})`
                }
                return resp.json()
            })
            .catch(e => {
                alert('Não foi possível carregar seus contatos!')
                console.error('Erro ao carregar os contatos: ', e)
                return false
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

    //Edtar o contato
    async updateContato(contato) {
        if (contato) {

            const data = {
                firstName: contato.firstName,
                lastName: contato.lastName,
                email: contato.email,
                gender: contato.gender,
                isFavorite: contato.isFavorite,
                company: contato.info.company,
                avatar: contato.info.avatar,
                address: contato.info.address,
                phone: contato.info.phone,
                comments: contato.info.comments
            }

            return await fetch(
                `http://contacts-api.azurewebsites.net/api/contacts/${contato.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),

                }
            ).then(resp => {
                if (resp.status != 200) {
                    throw resp.json()
                }
                return true
            })
                .catch(e => {
                    const msg = Object.values(e)[0]
                    if (msg) {
                        alert(msg)
                    }
                    console.error('Erro ao mudar o status de favorito do contato.')
                    return false
                })
        }
        console.error('Erro. É necessário que passe um contato para ser editado.')
        return false
    },

    async deleteContato(id) {
        if (id) {
            return await fetch(
                `http://contacts-api.azurewebsites.net/api/contacts/${id}`,
                {
                    method: 'DELETE',
                    headers: new Headers()
                }
            ).then(resp => {
                if (resp.status != 200) {
                    throw `${resp.statusText} (${resp.status})`
                }
                return true
            })
                .catch(e => {
                    alert('Não foi possível deletar o contato!')
                    console.error('Erro ao deletar contato: ', e)
                    return false
                })
        }
        console.error('Erro. É necessário que passe o ID do contato para deleta-lo')
        return false
    },

    async createContato(contato) {
        if (contato) {
            return await fetch(
                `http://contacts-api.azurewebsites.net/api/contacts`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contato)
                }
            ).then(async resp => {
                if (resp.status != 201) {
                    throw await resp.json()
                }
                return true
            })
                .catch(e => {
                    const msg = Object.values(e)[0]
                    if (msg) {
                        alert(msg)
                    }
                    console.error('Erro ao criar novo contato')
                    return false
                })
        }
        console.error('Erro. É necessário que passe o objeto do contato para salvar.')
        return false
    }

}

export default API