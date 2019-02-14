const ElementosDOM = {

    iIdContato: document.getElementById('iIdContato'),
    iNome: document.getElementById('iNome'),
    iSobrenome: document.getElementById('iSobrenome'),
    iEmail: document.getElementById('iEmail'),
    iFeminino: document.getElementById('gF'),
    iMasculino: document.getElementById('gM'),
    iAvatar: document.getElementById('iAvatar'),
    iCompanhia: document.getElementById('iCompanhia'),
    iEndereco: document.getElementById('iEndereco'),
    iTelefone: document.getElementById('iTelefone'),
    tComentario: document.getElementById('tComentario'),
    lista_itens: document.getElementsByClassName('lista_itens')[0],
    buttonFechar: document.getElementsByClassName('buttonFechar')[0],
    avatar: document.getElementById('avatar'),
    bRemover: document.getElementById('bRemover'),
    detalhes_contato: document.getElementsByClassName('detalhes_contato')[0],
    formCadastro: document.getElementById('formCadastro'),
    filtroMostrarTodos: document.getElementsByName('filtro')[0],
    filtroMostrarFavoritos: document.getElementsByName('filtro')[1],
    pesquisaInput: document.getElementsByClassName('pesquisaInput')[0],
    fav: document.getElementsByClassName('fav'),
    pagProximo: document.getElementById('pagProximo'),
    pagVoltar: document.getElementById('pagVoltar'),
    bNovoContato: document.getElementById('bNovoContato')
}

export default ElementosDOM