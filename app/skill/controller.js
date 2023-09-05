const Scrap = require('../scrape/controller')


module.exports = {
    getDataSeminar: async (req, res) => {
        try {

            const { page = 1, limit = 1 } = req.query;

            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus}

            const dataSeminar = Scrap.readJsonData("data-seminar");

            // const baseUrl = req.protocol + "://" + req.headers.host;
            // const apiSeminar = '/scrape/seminar-new';
            // const seminarUrlAPI = `${baseUrl + apiSeminar}?page=${page}&limit=${limit}` 

            res.render("template/dashboard", {
                alert,
                title: "Compete App | Dashboard",
                activePath: "Seminar",
                user: req.session.user,
                dataSeminar,
                content: "dashboard/skill/view_seminar"
            })
            
        } catch (error) {
            console.log(error)
        }
    },

    getDataContest: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus}

            const dataCompetition = Scrap.readJsonData("data-competition") ?? [];

            console.log(dataCompetition)

            res.render("template/dashboard", {
                alert,
                title: "Compete App | Dashboard",
                activePath: "Contest",
                user: req.session.user,
                dataCompetition,
                content: "dashboard/skill/view_competition"
            })
            
        } catch (error) {
            console.log(error)
        }
    },

    getListDataContest: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus}

            res.render("template/dashboard", {
                alert,
                title: "Compete App | Dashboard",
                activePath: "List Contest",
                user: req.session.user,
                content: "dashboard/skill/view_list_competition"
            })
            
        } catch (error) {
            console.log(error)
        }
    },
    
}