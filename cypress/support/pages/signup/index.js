/// <reference types="cypress" />

import { el } from "./elements";
import toast from "../../components/toast";

class SignupPage {
  constructor() {
    this.toast = toast;
  }

  go() {
    //acessando a página de cadastrp
    cy.visit("/signup");
  }

  form(user) {
    //preenchendo e submetendo o formulário de cadastro;
    //utilizamos o mapa de objetos criado em elements.js, dessa forma passamos aos localizadores do cypress somente o nome do objeto e seu atributo;
    cy.get(el.name).type(user.name);
    cy.get(el.email).type(user.email);
    cy.get(el.password).type(user.password);
  }

  submit() {
    cy.contains(el.signupButton).click();
  }

  alertHaveText(expectedText) {
    cy.contains(".alert-error", expectedText).should("be.visible");
  }
}

//exportando o conteúdo da classe SignupPage instanciada;
export default new SignupPage();
