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

const { Pool } = require('pg')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  //criando uma conexão com nosso BD
  const pool = new Pool({
    host: 'jelani.db.elephantsql.com',
    user: 'kovsayna',
    password: 'bGDvrm6_sRHjmr8dxxLbYdS2rC3SWayk',
    database: 'kovsayna',
    //a porta padrão do postgress é 5432;
    port: 5432
  })

  //criando uma task para remover um usuário do BD
  on('task', {
    removeUser(email){
      //criamos uma promessa para resolver a task
      return new Promise(function(resolve){
        //$1 é um parametro que será substituido por um valor, no caso o email;
        pool.query('DELETE FROM public.users WHERE email = $1', [email], function(error, result){
          // caso o valor da task seja nulo ou gere algum erro o laço interromperá a task e mostrara o erro
          if (error){
            throw error
          }
          //caso dê tudo certo retornaremos através da Promise o result da query
          resolve({success: result})
        })
      })
    }
  })
}
