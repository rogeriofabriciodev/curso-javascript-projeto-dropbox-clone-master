class DropboxController {

  constructor() {

    // Pega o botão de envio de arquivo
    this.btnSendFileEl = document.querySelector('#btn-send-file');
    this.inputFilesEl = document.querySelector('#files');
    this.snackModalEl = document.querySelector('#react-snackbar-root');
    this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
    this.namefileEl = this.snackModalEl.querySelector('.filename');
    this.timeleftEl = this.snackModalEl.querySelector('.timeleft');

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

      // Carrega a barra de progresso na tela através do método
      this.modalShow();

      // Para limpar o campo novamente
      this.inputFilesEl.value = '';

    });

  }

  modalShow(show = true) {

    // Exibe o modal (barra de progresso) na tela
    this.snackModalEl.style.display = (show) ? 'block' : 'none';

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

          this.modalShow(false);

          try {
            resolve(JSON.parse(ajax.responseText));
          } catch(e) {
            reject(e);
          }
        };

        // Retorna o erro caso não tenha conseguido subir o arquivo
        ajax.onerror = event => {

          reject(event);
          this.modalShow(false);
        }

        // Evento da barra de progresso
        ajax.upload.onprogress = event => {

          this.uploadProgress(event, file);

        };

        // Método que envia as informações via ajax
        let formData = new FormData();

        formData.append('input-file', file);

        // Pega em milisegundos o horário que o upload começou. 
        // Para poder concluir o tempo estimado para conclusão do apload no médoto uploadProgress
        this.startUploadTime = Date.now();
        
        ajax.send(formData);

      }));

    });

    // Um return para devolver o resultado depois que todas as promeses do Array forem finalizadas
    return Promise.all(promises);

  }

  // Carrega o percentual do upload do arquivo realizado
  uploadProgress(event, file) {

    // Recebe o progresso do tempo na barra de carregamento
    let timespent = Date.now() - this.startUploadTime;

    // Recebe o quanto caregou 
    let loaded = event.loaded;
    // Recebe os bytes total do arquivo
    let total = event.total;

    // Converte em percentual o quanto esta carregado
    let porcent = parseInt((loaded / total) * 100);

    // Recebe o percentual que falta para carregar
    let timeleft = ((100 - porcent) * timespent) / porcent;

    // Atualiza na largura da barra o carregamento
    this.progressBarEl.style.width = `${ porcent }%`;

    // Atualiza o nome do arquivo na barra o carregamento
    this.namefileEl.innerHTML = file.name;
    // Atualiza o tempo restante na barra o carregamento
    this.timeleftEl.innerHTML = this.formatTimeToHuman(timeleft);

  }

  formatTimeToHuman(duration) {

    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    if (hours > 0) {
      return `${hours} horas, ${minutes} minutos, ${seconds} segundos`;
    }

    if (minutes > 0) {
      return `${minutes} minutos, ${seconds} segundos`;
    }

    if (seconds > 0) {
      return `${seconds} segundos`;
    }

    return '';
  }

}