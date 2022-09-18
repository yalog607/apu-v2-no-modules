
const indexController = {
    renderIndex: (req, res, next) => {
        res.render('home')
    },
    render404: (req, res, next) => {
        res.render('404')
    }
}

module.exports = indexController;
