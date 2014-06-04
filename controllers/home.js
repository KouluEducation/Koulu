module.exports = function (router) {

    /**
     * Index
     */
    router.get('/', function (req, res) {
        res.send("I'm home controller!");
    });

};