var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/file', (req, res) => {

  let path = './' + req.query.path;

  if (fs.existsSync(path)) {

    fs.readFile(path, (err, data) => {

      if (err) {

        console.error(err);
        res.status(400).json({
          error: err
        });
      } else {

        res.status(200).end(data);
      }

    });

  } else {

    res.status(404).json({
      error: 'File not found.'
    });

  }

});

// Cria a rota para delete
router.delete('/file', (req, res) => {

  //Recuperar os dados do formulário
  let form = new formidable.IncomingForm({

    uploadDir: './upload',
    keepExtensions: true

  });

  // Interpreta os dados que vem do form.body
  form.parse(req, (err, fields, files) => {

    let path = "./" + fields.path;

    // Usa um método nativo do node 'fs' e verifica se o file existe
    if (fs.existsSync(path)) {

      // Método nativo do sistema para apagar arquivo na pasta do servidor
      fs.unlink(path, err => {
        if (err) {
          res.status(400).json({
            err
          });
        } else {

          res.json({
            fields
          });

        }
      })

    } else {

      res.status(404).json({
        error: 'File not found.'
      });
  
    }

  });

});

// Cria a rota para uploa
router.post('/upload', (req, res) => {

  //Usando o formidable para manipular o envio de arquivo
  let form = new formidable.IncomingForm({

    uploadDir: './upload',
    keepExtensions: true

  });

  // Interpreta os dados que vem do form.body
  form.parse(req, (err, fields, files) => {

    res.json({
      files
    });

  });

});

module.exports = router;
