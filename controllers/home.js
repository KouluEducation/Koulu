var UserSrv = require('../services/user');

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req, function (user) {
            var todos = [
                    {
                        done: true,
                        content: 'Learn JavaScript'
                    },
                    {
                        done: false,
                        content: 'Learn vue.js'
                    }
                ];
            res.render('home', {
                user: user,
                todos: todos
            });
        });
    });

    router.get('/todos.json', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        var todos = [
            {
                done: false,
                content: 'Learn Kraken.js'
            },
            {
                done: true,
                content: 'Learn Grunt'
            }
        ];
        res.json(todos);
    });

};