/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { Pool } = require("pg");

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  //a constante configJson requer acesso ao arquivo de config onde temos nossos dados de conexão do BD, para atribuimos a mesma acesso ao arquivo através do (config.configFile), dessa forma ela poderá acessar o arquivo de configuração cypress.json
  const configJson = require(config.configFile);

  //criando uma conexão com nosso BD, passamos como parametro a constante que tem acesso ao arquivo de configurações, após isso passamos o objeto que contém os dados de acesso ao BD
  const pool = new Pool(configJson.dbConfig);

  //criando uma task para remover um usuário do BD
  on("task", {
    removeUser(email) {
      //criamos uma promessa para resolver a task
      return new Promise(function (resolve) {
        //$1 é um parametro que será substituido por um valor, no caso o email;
        pool.query(
          "DELETE FROM public.users WHERE email = $1",
          [email],
          function (error, result) {
            // caso o valor da task seja nulo ou gere algum erro o laço interromperá a task e mostrara o erro
            if (error) {
              throw error;
            }
            //caso dê tudo certo retornaremos através da Promise o result da query
            resolve({ success: result });
          }
        );
      });
    },
  });
};
