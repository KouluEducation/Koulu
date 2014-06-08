var klClassrooms = new Vue({
    el: '#kl-classrooms',
    data: {
        classrooms: window.klClassrooms
    },
    methods: {
        refresh: function (e) {
            e.stopPropagation();
            window.superagent
                .get('/home/classrooms.json')
                .end(function (res) {
                    klClassrooms.$data.classrooms = res.body;
                });
        }
    }
});
