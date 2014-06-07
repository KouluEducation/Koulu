var klTodos = new Vue({
    el: '#kl-todos',
    data: {
        title: 'todos',
        todos: window.klTodos
    },
    methods: {
        refresh: function (e) {
            e.stopPropagation();
            window.superagent
                .get('/home/todos.json')
                .end(function (res) {
                    klTodos.$data.todos = res.body;
                });
        }
    }
});