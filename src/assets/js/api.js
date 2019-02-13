const API = {

    //Pegar os dados da API
    async getContatos() {
        const lista = await fetch('http://contacts-api.azurewebsites.net/api/contacts')
            .then(data => {
                return data.json()
            })
        return lista
    }

}

export default API