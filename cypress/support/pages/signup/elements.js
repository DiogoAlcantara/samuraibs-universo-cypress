//mapa de elementos

//criamos um super objeto que contém todos os localizadores que utilizamos na página de signup;
exports.el = {
  name: 'input[placeholder^="Nome"]', // ^ = começa com
  email: 'input[placeholder$="email"]', // $ = termina com
  password: 'input[placeholder*="senha"]', // * = contém
  signupButton: ("button", "Cadastrar"),
};
