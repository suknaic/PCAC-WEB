function getEndereco() {
  // Se o campo CEP não estiver vazio
  const form = document.getElementsByClassName('.needs-validation')[0];
  if ($.trim($('#cep').val()) != '') {
    /*
              Para conectar no serviço e executar o json, precisamos usar a função
              getScript do jQuery, o getScript e o dataType:"jsonp" conseguem fazer o cross-domain, os outros
              dataTypes não possibilitam esta interação entre domínios diferentes
              Estou chamando a url do serviço passando o parâmetro "formato=javascript" e o CEP digitado no formulário
              http://cep.republicavirtual.com.br/web_cep.php?formato=javascript&cep="+$("#cep").val()
         */
    $.getScript(
      `http://cep.republicavirtual.com.br/web_cep.php?formato=javascript&cep=${$(
        '#cep'
      ).val()}`,
      function () {
        // o getScript dá um eval no script, então é só ler!
        // Se o resultado for igual a 1
        if (resultadoCEP.resultado) {
          // troca o valor dos elementos
          $('#rua').val(
            `${unescape(resultadoCEP.tipo_logradouro)} ${unescape(
              resultadoCEP.logradouro
            )}`
          );
          $('#bairro').val(unescape(resultadoCEP.bairro));
          $('#cidade').val(unescape(resultadoCEP.cidade));
          $('#estado').val(unescape(resultadoCEP.uf));
          // $("#enderecoCompleto").show("slow");
          $('#numero').focus();
        } else {
          alert('Endereço não encontrado');
          return false;
        }
      }
    );
  } else {
    form.checkValidity();
  }
}

$('#cep').blur(getEndereco);
