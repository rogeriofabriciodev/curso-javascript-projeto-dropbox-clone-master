var express = require('express');
var router = express.Router();
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
