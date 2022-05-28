$(()=>{ 

    $('#btnIncluir').click(()=>{
        let tarefa = $('#textTarefa').val();

        let data = {
            "id": 0,
            "descricao": tarefa,
            "data": "20181003",
            "realizado": 0,
            "categoria_id": 4
        };

        $.post('http://localhost:3000/api/v1/tarefas', data, (recebido)=>{
            let id = recebido.message;
            data.id = id;
            inserirTarefa(data);
        })
    });
   
    $.get('http://localhost:3000/api/v1/tarefas', (tarefas)=>{
        tarefas.forEach(tarefa => {
            inserirTarefa(tarefa);
        });
    });
    
    const inserirTarefa = (tarefa) => {
        let linha = $(`<tr><td>${tarefa.id}</td><td>${tarefa.descricao}</td><td><img class="icon delete" onclick="deletar(${tarefa.id},this)" src="img/delete.png"></td></tr>`);
        $('.corpoTabela').append(linha);
    }



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