'use strict';

var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. loggea el poema dos stanza uno y stanza dos en cualquier orden
   *    pero loggea 'done' cuando ambos hayan terminado
   *    (ignora errores)
   *    nota: lecturas ocurriendo paralelamente (en simultaneo)
   *
   */

  // callback version
  /*async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log('-- A. callback version --');
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log('-- A. callback version done --');
    }
  );*/

  // promise version
  // ???
   /* promisifiedReadFile('poem-two/stanza-01.txt')
      .then(stanza1=>{
        blue(stanza1);
        return promisifiedReadFile('poem-two/stanza-02.txt');
      })
      .then(stanza2=>{
        blue(stanza2);
        console.log("done")
      })
      */
    const promiseone= promisifiedReadFile('poem-two/stanza-01.txt')
    const promisetwo= promisifiedReadFile('poem-two/stanza-02.txt')
    Promise.all([promiseone,promisetwo])
      .then(stanza=>{
        blue(stanza[0])
        blue(stanza[1])
        console.log("done")
      })
}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. loggea todas las stanzas en poema dos, en cualquier orden y loggea
   *    'done' cuando todas hayan terminado
   *    (ignora errores)
   *    nota: las lecturas ocurren en paralelo (en simultaneo)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  /*async.each(filenames,
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log('-- B. callback version --');
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log('-- B. callback version done --');
    }
  );*/

  // promise version
  // ???
    const vfiles= filenames.map(f=>promisifiedReadFile(f).then(stanza=>blue(stanza)))
    Promise.all(vfiles)
    .finally(()=>{
        console.log("done")
      })

}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. Lee y loggea todas las stanzas en el poema dos, *en orden* y
   *    loggea 'done cuando hayan terminado todas
   *    (ignorá errores)
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  /*async.eachSeries(filenames,
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log('-- C. callback version --');
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log('-- C. callback version done --');
    }
  );*/

  // promise version
  // ???
  for (let i = 1 , p= promisifiedReadFile(filenames[0]);i <= filenames.length; i++) {      
      p=p.then(stanza=>{
        blue(stanza);
        if(i=== filenames.length){
      console.log("done")
    }else{
    return promisifiedReadFile(filenames[i])
    }
      })
    
  }
}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. loggea todas las stanzas en el poema dos *en orden* asegurandote
   *    de fallar para cualquier error y logueando un 'done cuando todas
   *    hayan terminado
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // callback version
  /*async.eachSeries(filenames,
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log('-- D. callback version --');
        if (err) return eachDone(err);
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      if (err) magenta(new Error(err));
      console.log('-- D. callback version done --');
    }
  );
  */

  // promise version
  // ???
  for (let i = 1 , p= promisifiedReadFile(filenames[0]);i <= filenames.length; i++) {      
    p=p.then(stanza=>{  
      if(blue)blue(stanza);
      if(i=== filenames.length){
        console.log("done")
      }else{
        return promisifiedReadFile(filenames[i])
      }})
      if(i===filenames.length || !blue) {
        p.catch(err=>{
          magenta(new Error(err))
          console.log("done")
        })
      }
    
  
  }

}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. Haz una versión promisificada de fs.writeFile
   *
   */

  var fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    // tu código aquí}
    return new Promise(function(resolve, reject){
      fs.writeFile(filename, str , err=> {
        if(err) return reject(err);
        resolve();
      })
    })
  }
  promisifiedWriteFile("prueba.txt","franco")
    .then(()=>{
      console.log("datos guardados correctamente");
    })
    .catch(err=>{
      console.log(err);
    })
}
