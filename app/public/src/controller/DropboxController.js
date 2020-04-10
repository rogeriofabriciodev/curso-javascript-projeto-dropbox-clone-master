class DropboxController {

  constructor() {

    // Pega o botão de envio de arquivo
    this.btnSendFileEl = document.querySelector('#btn-send-file');
    this.inputFilesEl = document.querySelector('#files');
    this.snackModalEl = document.querySelector('#react-snackbar-root');

    this. initEvents();

  }

  initEvents() {

    // Cria o evento do click no botão
    this.btnSendFileEl.addEventListener('click', event => {

      // Força o clique nesse elemento
      this.inputFilesEl.click();


    });

    // Configura o evento change do elemento
    this.inputFilesEl.addEventListener('change', event => {

      console.log(event.target.files);
      this.uploadTask(event.target.files);

      // Exibe o modal (barra de progresso) na tela
      this.snackModalEl.style.display = 'block';

    });

  }

  // Método para upload do arquivo escolhido
  uploadTask(files) {

    // Inicia um Array de Promises
    let promises = [];

    // Convertendo o files de collection para Array (spred), para ser inserida no Array
    [...files].forEach(file => {

      // Insere a promise no Array
      promises.push(new Promise((resolve, reject) => {

        // Realiza a solicitação assíncrona no servidor via ajax
        // Cria a variável ajax
        let ajax = new XMLHttpRequest();

        // Abre a conexão Ajax via POST e manda o arquivo para pasta upload
        ajax.open('POST', '/upload');

        // Confirma se o envio deu certo
        ajax.onload = event => {

          try {
            resolve(JSON.parse(ajax.responseText));
          } catch(e) {
            reject(e);
          }
        };

        // Retorna o erro caso não tenha conseguido subir o arquivo
        ajax.onerror = event => {
          reject(event);
        }

        // Método que envia as informações via ajax
        let formData = new FormData();

        formData.append('input-file', file);
        
        ajax.send(formData);

      }));

    });

    // Um return para devolver o resultado depois que todas as promeses do Array forem finalizadas
    return Promise.all(promises);

  }

}