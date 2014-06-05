module.exports = function (router) {

    /**
     * Index
     */
    router.get('/', function (req, res) {
        res.render('home');
    });

};