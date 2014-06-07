var demo = new Vue({
    el: '#demo',
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
                    demo.$data.todos = res.body;
                });
        }
    }
});