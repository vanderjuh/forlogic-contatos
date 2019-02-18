import ElementosDOM from './elementosDOM'

const Upload = {

    cloudName: 'di8wvioqv',
    unsignedUploadPreset: 'rjxg91uc',
    
    uploadFile(file, callback) {
        
        const url = `https://api.cloudinary.com/v1_1/${Upload.cloudName}/upload`
        
        //Corpo da requisição
        const formData = new FormData()
        formData.append('upload_preset', Upload.unsignedUploadPreset)
        formData.append('file', file)

        //Requisição
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url, true)
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

        //Zerar o progresso da barra de progresso
        ElementosDOM.pUpload.value = 0

        //Progresso de upload
        xhr.upload.addEventListener("progress", function (e) {
            const progresso = Math.round((e.loaded * 100.0) / e.total)
            ElementosDOM.pUpload.value = progresso
        })

        //Finalização do upload
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const res = JSON.parse(xhr.responseText)
                const url = res.secure_url
                ElementosDOM.iAvatar.value = url
                if(callback){
                    callback()
                }
            }
        }

        xhr.send(formData)
    }

}

export default Upload