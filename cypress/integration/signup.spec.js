/// <reference types="cypress" />

import signup from "../support/pages/signup";
import signupPage from "../support/pages/signup";

describe("Cadastro", function () {
  //uma boa prática é adotar o conceito de DRY(Dont repeat yourself), ou seja, não ficar repetindo as mesmas informações, em nossos casos de teste até o momento usamos várias constantes para simular os dados que serão preenchidos nos campos de cadastro, porém existe uma forma melhor de fazer isso que é a utlização de um objeto que guardará todos esses dados;
  context("Quando é um novo usuário", function () {
    //criamos uma constante que recebe todos os dados necessários para a massa de testes;
    const user = {
      name: "Diogo Alcantara",
      email: "diogo@samuraibs.com",
      password: "teste123",
    };

    before(function () {
      //removendo o usuario para que a massa de testes seja sempre valida
      cy.task("removeUser", user.email).then(function (result) {
        console.log(result);
      });
    });
    it("Deve cadastrar um novo usuário", function () {
      signupPage.go();
      signupPage.form(user);
      signupPage.submit();
      signupPage.toast.shouldHaveText(
        "Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!"
      );
    });
  });

  context("Quando o email já existe", function () {
    const user = {
      name: "João Lucas",
      email: "joao@samuraibs.com",
      password: "teste123",
      is_provider: true,
    };

    before(function () {
      cy.task("removeUser", user.email).then(function (result) {
        console.log(result);
      });
      //manda uma requisição HTTP;
      cy.request(
        "POST", //tipo da requisição
        "http://localhost:3333/users", //endpoint da requisição
        user //valor a ser enviado, no nosso caso é o cadastro de usuário no formato JSON

        //o cy.requeste devolve uma promessa que armazenamos na função .then, depois passamos outra função ao then para capturar a resposta dessa promessa, e por ultimo validamos se o status dessa reposta é igual à 200, que no nosso caso significa que o usuário foi criado com sucesso;
      ).then(function (response) {
        expect(response.status).to.eq(200);
      });
    });
    it("Não deve cadastrar o usuário", function () {
      signupPage.go();
      signupPage.form(user);
      signupPage.submit();
      signupPage.toast.shouldHaveText(
        "Email já cadastrado para outro usuário."
      );
    });
  });

  context("Quando o email é incorreto", function () {
    const user = {
      name: "Elizabeth Olsen",
      email: "liza.yahoo.com",
      password: "teste123",
    };
    it("Deve exibit mensagem de alerta", () => {
      signupPage.go();
      signupPage.form(user);
      signupPage.submit();
      signupPage.alertHaveText("Informe um email válido");
    });
  });

  context("Quando a senha é muito curta", function () {
    //constante que possui um array de senhas para validar o teste
    const passwords = ["1", "2a", "ab3", "abc4", "ab#c5"];

    //antes de cada teste vai executar o gancho beforeEach, que é reponsável por visitar a página da aplicação
    beforeEach(function () {
      signupPage.go();
    });

    //percorremos o nosso array de senhas com o forEach, que para cada repetição executará o nosso cenário de testes descrito dentro do It
    passwords.forEach(function (p) {
      it("não deve cadastrar com a senha: " + p, function () {
        const user = {
          name: "Jason Friday",
          email: "jason@friday.com",
          password: p,
        };
        signupPage.form(user);
        signupPage.submit();
      });
    });

    //após cada teste executamos o gancho do afterEach, que é responsável por realizar a validação da senha verificando se a mesma possua ao menos 6 caracteres
    afterEach(function () {
      signupPage.alertHaveText("Pelo menos 6 caracteres");
    });
  });

  context.only("Quando nenhum campo é preenchido", function () {
    const alertMessages = [
      "Nome é obrigatório",
      "E-mail é obrigatório",
      "Senha é obrigatória",
    ];

    //nesse caso vamos validar as três mensagens uma vez, então utilizamos o gancho before(executado uma única vez antes dos testes), esse gancho vai ser reponsável por navegar até a página e submeter o formulário sem preencher nada
    before(function () {
      signupPage.go();
      signupPage.submit();
    });

    //percorrendo o array com forEach, dessa forma validamos as três mensagens de uma só vez
    alertMessages.forEach(function (m) {
      it("Deve exibir " + m, function () {
        signupPage.alertHaveText(m);
      });
    });
  });
});
