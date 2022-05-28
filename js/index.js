let arrayTarefas = [];
let modo = 'inclusao';
let tarefaSelecionada = null;

$(()=>{ 

    $('#btnCancelar').click(() => {
        $('#formIncluir').hide();
        $('#btnExibirInclusao').show();
        limpar();   
    });


    $('#btnExibirInclusao').click(() => {
        $('#formIncluir').show();
        $('#btnExibirInclusao').hide();
        modo = 'inclusao';
    });

    $('#textData').datepicker({
        dateFormat: 'dd/mm/yy',
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        nextText: 'Proximo',
        prevText: 'Anterior'
     }
     );
    $('#btnConfirmar').click(()=>{
        if(modo==='inclusao')
            incluir();
        else
            alterar();
    });
    $('#formIncluir').keyup((event)=>{
        if(event.keyCode===13)
            incluir();
    });

    $.get('http://localhost:3000/api/v1/tarefas', (tarefas)=>{
        arrayTarefas = tarefas;

        tarefas.forEach(tarefa => {
            inserirTarefa(tarefa);
        });
    });
    

});

    const deletar = (id,botao) => {
        if(confirm('Tem certeza que deseja realmente excluir?')) {
            $.ajax({
                url:`http://localhost:3000/api/v1/tarefas/${id}`,
                type:'DELETE',
                success:()=>{
                    excluirLinha(botao);
                }
            });
        }
    }

    const excluirLinha = (botao) => {
        let b = $(botao);

        let tr = b.parent().parent();

        tr.remove();
    }

    const selecionado = (id,chk) => {
        let checked = (chk.checked);
        let data = {
            id : id,
            realizado:(checked)?1:0
        };

        seleciona(id,data)   

    }

    const seleciona = (id,data) => {
        $.ajax({
            url:`http://localhost:3000/api/v1/tarefas/checked/${id}`,
            type:'PUT',
            data:data,
            success:()=>{
               
            }
        });
    }

    const incluir = () => {
        let tarefa = $('#textTarefa').val();
        let categoria = $('#textCategoria').val();
        let date = $('#textData').val();

        let aData = date.split('/');

        let dataTratada = aData[2] + aData[1] + aData[0];

        if(tarefa===''){
            return;
        }

        let data = {
            "id": 0,
            "descricao": tarefa,
            "data": dataTratada,
            "realizado": 0,
            "categoria_id": categoria
        };

        $.post('http://localhost:3000/api/v1/tarefas', data, (recebido)=>{
            let id = recebido.message;
            data.id = id;
            inserirTarefa(data);
            limpar();
        });
        
    }

    const limpar = () => {
        $('#textTarefa').val('');
        $('#textCategoria').val('');
        $('#textData').val('');
    }

    const inserirTarefa = (tarefa) => {
        const colunaId = `<td>${tarefa.id}</td>`;
        const conlunaDescricao = `<td>${tarefa.descricao}</td>`;
        const colunaExcluir = `<td><img class="icon delete" onclick="deletar(${tarefa.id},this)" src="img/delete.png"></td>`;
        const colunaEditar = `<td><img class="icon edit" onclick="editar(${tarefa.id},this)" src="img/editar.png"></td>`; 
        const colunaData = `<td>${tarefa.data}</td>`;
        const colunaCategoria = `<td>${tarefa.categoria}</td>`;
        let checked = (tarefa.realizado===1) ? 'checked="checked"' : '';
        let chkConcluido = `<input type="checkbox" ${checked} onclick="selecionado(${tarefa.id},this)">`;
        

        const colunaConcluido = `<td align="center">${chkConcluido}</td>`;
        
        let linha = $(`
            <tr style="background-color:${tarefa.cor}">
                ${colunaId}
                ${conlunaDescricao}
                ${colunaConcluido}
                ${colunaCategoria}
                ${colunaData}
                ${colunaEditar}
                ${colunaExcluir}
                
                
            </tr>
        `);
        $('.corpoTabela').append(linha);
    }

    const alterar = () => {
        let tarefa = $('#textTarefa').val();
        let categoria = $('#textCategoria').val();
        let date = $('#textData').val();

        let aData = date.split('/');

        let dataTratada = aData[2] + aData[1] + aData[0];

        if(tarefa===''){
            return;
        }

        let data = {
            "id": tarefaSelecionada.id,
            "descricao": tarefa,
            "data": dataTratada,
            "realizado": tarefaSelecionada.realizado,
            "categoria_id": categoria
        };

        $.ajax({
            url:`http://localhost:3000/api/v1/tarefas/${tarefaSelecionada.id}`,
            type:'PUT',
            data:data,
            success:()=>{
               
            }
        });
    };

    const editar = (id,botao) => {
        $('#formIncluir').show();
        $('#btnExibirInclusao').hide();
        modo = 'edicao';

        let tarefa = arrayTarefas.find((item) => {
            return item.id===id;
        });
        $('#textTarefa').val(tarefa.descricao);
        $('#textCategoria').val(tarefa.categoria);
        $('#textData').val(tarefa.data);

        tarefaSelecionada = tarefa;
    }



