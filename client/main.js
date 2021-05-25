import { Template } from 'meteor/templating';
import { dataDb } from '../lib/collections';

import './main.html';

Template.data_table.helpers({
  //Api faz requisação no mongodb
  crud_tip_brasil() {
    const data = dataDb.find({}).fetch();

    // console.log('Vamos ver', data);
    // console.log(
    //   'Vamos ver2',
    //   data.map((e) => e.text)
    // );

    return data;
  },
});

//template (data_table)
//contém uma tabela que será preenchida com as informações do mongo
Template.data_table.events({
  //Excluindo linha table
  'click #btn-delete': function () {
    // console.log('delete', this._id);
    dataDb.remove(this._id);
  },
  //Editando linha
  'click #btn-edit': function () {
    //Fazendo consulta no mongo e
    //retorna os dados
    const person = dataDb.findOne(this._id);

    //Obtendo os dados do Json
    let id = person._id;
    let nome = person.text.nome;
    let sobrenome = person.text.sobrenome;
    let email = person.text.email;
    let telefone = person.text.telefone;

    //preenchendo os inputs do forma Editar
    document.getElementById('campo-oculto').value = id;
    document.getElementById('edit_nome').value = nome;
    document.getElementById('edit_sobrenome').value = sobrenome;
    document.getElementById('edit_email').value = email;
    document.getElementById('edit_telefone').value = telefone;

    // console.log(nome);
  },
});

// Atualizando dados
Template.edit.events({
  'click #btn-atualiza': function (e) {
    //obtendo dados atualizado
    let email = document.getElementById('edit_email').value;
    let nome = document.getElementById('edit_nome').value;
    let sobrenome = document.getElementById('edit_sobrenome').value;
    let telefone = document.getElementById('edit_telefone').value;

    // este campo está oculto, e contém o id o usuário no mongodb
    let id = document.getElementById('campo-oculto').value;

    if (email == '' || nome == '' || sobrenome == '' || telefone == '') {
      return alert('Alteração no pode ser feita com campos vazios!!');
    }

    // update
    dataDb.update(
      { _id: id },
      {
        $set: {
          text: {
            nome,
            sobrenome,
            email,
            telefone,
          },
        },
      }
    );

    //limpando campos
    document.getElementById('edit_email').value = '';
    document.getElementById('edit_nome').value = '';
    document.getElementById('edit_sobrenome').value = '';
    document.getElementById('edit_telefone').value = '';
    document.getElementById('campo-oculto').value = '';
  },
});

//Salvando informações no mongo
Template.add.events({
  'submit .add-form': function (e, template) {
    e.preventDefault();
    // console.log('aqui');

    //Obtendo dados dos inputs
    const target = template.findAll('input');
    const nome = target[0].value;
    const sobrenome = target[1].value;
    const email = target[2].value;
    const telefone = target[3].value;

    if (email == '' || nome == '' || sobrenome == '' || telefone == '') {
      return alert('Não foi possível cadastrar, preencha todos os campos!!');
    }

    // Salvando no mongo (collection)
    dataDb.insert({
      text: {
        nome,
        sobrenome,
        email,
        telefone,
      },
      createdAt: new Date(),
    });

    template.find('form').reset();

    // Fechando modal
    $('#addModal').modal('close');
    // return false;
  },
});
