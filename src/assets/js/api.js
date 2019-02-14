const API = {

    //Pegar todos os contatos
    async getContatos() {
        const lista = await fetch('http://contacts-api.azurewebsites.net/api/contacts')
            .then(data => {
                return data.json()
            })
        //window.localStorage.setItem('lista', JSON.stringify(lista))
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

        console.log(data)

        return await fetch(
            `http://contacts-api.azurewebsites.net/api/contacts/${contato.id}`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(data)
            }
        ).then(resp => {
            if (resp.status != 200) {
                throw `${resp.statusText} (${resp.status})`
            }
            return true
        })
            .catch(e => {
                console.error('Erro ao mudar o status de favorito do contato: ', e)
                return false
            })
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
                    console.error('Erro ao deletar contato: ', e)
                    return false
                })
        } else {
            throw 'Erro. É necessário que passe o ID do contato para deleta-lo'
        }
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
            ).then(resp => {
                if (resp.status != 201) {
                    throw `${resp.statusText} (${resp.status})`
                }
                return true
            })
                .catch(e => {
                    console.error('Erro ao criar novo contato: ', e)
                    return false
                })
        } else {
            throw 'Erro. É necessário que passe o objeto do contato para salvar.'
        }
    }

}

export default API