import ElementosDOM from "./elementosDOM";
import Contatos from "./contatos";

//SVG
import avatarDefault from '../img/round-person-24px.svg'

const LocalStorage = {

    //Verifica se existe suporte do navegador ao localStorage
    verificarSuporte() {
        if (window.localStorage) { return true }
        console.error('LocalStorage não disponível')
        return false
    },

    //Retorna os dados do localStorage
    getContatosFavoritos() {
        if (LocalStorage.verificarSuporte()) {
            const contatos = window.localStorage.getItem('contatosFavoritos')
            if (contatos) { return JSON.parse(contatos) }
        }
        return false
    },

    //Salva os dados no localStorage
    salvarContatosFavoritos(listaContatos) {
        if (LocalStorage.verificarSuporte()) {
            window.localStorage.setItem('contatosFavoritos', JSON.stringify(listaContatos))
            return true
        }
        return false
    },

    //
    modoOffine(){
        
        alert('Mostrando apenas seus contatos favoritos existentes desde o último carregamento.')

        //Definindo filtro
        ElementosDOM.filtroMostrarTodos.disabled = true
        ElementosDOM.filtroMostrarFavoritos.checked = true

        //Remover botões essenciais da DOM
        ElementosDOM.bNovoContato.parentElement.remove()
        ElementosDOM.bSalvar.remove()
        ElementosDOM.bRemover.remove()

        //Mudando imgs dos avatares para default
        Contatos.listaContatos.forEach(e => {
            e.info.avatar = avatarDefault
        })

    }

}

export default LocalStorage