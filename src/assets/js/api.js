const API = {

    //Pegar todos os contatos
    async getContatos() {
        let lista = undefined
        try {
            const res = await fetch('http://contacts-api.azurewebsites.net/api/contacts')
            if (res.status == 200) {
                lista = await res.json()
                lista.sort((a, b) => {
                    if (a.firstName > b.firstName) return 1
                    if (a.firstName < b.firstName) return -1
                    return 0
                })
                return lista
            }
            throw { status: res.status, statustext: res.statusText }
        } catch (e) {
            console.error('Erro: ', e)
            if (e.status) { console.error(`${e.statusText} (${e.status})`) }
            if (lista) { return lista }
            return false
        }
    },

    //Editar o contato
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
            try {
                const res = await fetch(
                    `http://contacts-api.azurewebsites.net/api/contacts/${contato.id}`,
                    {
                        method: 'PUT',
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    }
                )
                if (res.status == 200) { return true }
                throw await res.json()
            } catch (e) {
                console.error('Erro: ', e)
                const msg = Object.values(e)[0]
                if (msg) {
                    alert(msg)
                    console.error('Erro: ', msg)
                }
                return false
            }
        }
        alert('Erro. Não foi possível alterar contato')
        console.error('Erro. É necessário que passe um contato para ser editado.')
        return false
    },

    async deleteContato(id) {
        if (id) {
            try {
                const res = await fetch(
                    `http://contacts-api.azurewebsites.net/api/contacts/${id}`,
                    {
                        method: 'DELETE',
                        headers: new Headers()
                    }
                )
                if (res.status == 200) { return true }
                throw await res.json()
            } catch (e) {
                console.error('Erro: ', e)
                const msg = Object.values(e)[0]
                if (msg) {
                    alert(msg)
                    console.error('Erro: ', msg)
                }
                return false
            }
        }
        alert('Erro. Não foi possível remover contato')
        console.error('Erro. É necessário que passe o ID do contato para deleta-lo')
        return false
    },

    async createContato(contato) {
        if (contato) {
            try {
                const res = await fetch(
                    `http://contacts-api.azurewebsites.net/api/contacts`,
                    {
                        method: 'POST',
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                        body: JSON.stringify(contato)
                    }
                )
                if (res.status == 201) { return true }
                throw await res.json()
            } catch (e) {
                const msg = Object.values(e)[0]
                if (msg) { alert(msg) }
                console.error('Erro ao criar novo contato')
                return false
            }
        }
        alert('Não foi possível salvar o contato')
        console.error('Erro. É necessário que passe o objeto do contato para salvar.')
        return false
    }
}

export default API