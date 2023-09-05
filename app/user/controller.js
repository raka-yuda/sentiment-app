const bcrypt = require('bcryptjs')

const User = require('../user/model')
const Scrap = require('../scrape/controller')


module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus}

            // const dataSeminar = Scrap.readJsonData();
            // console.log(dataSeminar)

            // const dataSeminar = Scrap.readJsonData("data-seminar");
            // const dataCompetition = Scrap.readJsonData("data-competition") 

            res.render("template/dashboard", {
                alert,
                title: "Compete App | Dashboard",
                activePath: "Dashboard",
                user: req.session.user,
                dataLength: {
                    // dataSeminarAll: dataSeminar.dataSeminar[0].length + dataSeminar.dataSeminar[1].length,
                    // dataSeminarSeni: dataSeminar.dataSeminar[0].length,
                    // dataSeminarTech: dataSeminar.dataSeminar[1].length,
                    // dataContest: dataCompetition.dataCompetition[0].length
                },
                content: "dashboard/user/view_user"
            })
            
        } catch (err) {
            console.log(err)
        }
    },

    userLogin: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus}

            if (req.session.user === null || req.session.user === undefined) {
                res.render('dashboard/auth/login', {
                    alert,
                    title : 'Compete App | Login'
                })
            } else {
                res.redirect('/')
            }
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            console.log(err)
        }
    },

    actionLogin: async (req, res) => {
        try {
            const { email, password } = req.body
            
            const existedUser = await User.findOne({ email: email })
            console.log("existedUser: ", existedUser)
            
            if (!existedUser) throw new Error("Error 1231231")
            
            if (existedUser) {
                if (existedUser.isActive) {
                    
                    const checkPassword = await bcrypt.compare(password, existedUser.password)
                    if (checkPassword) {
                        // console.log(existedUser)
                        req.session.user = {
                            id: existedUser._id,
                            email: existedUser.email,
                            role: existedUser.role,
                            name: existedUser.name,
                        }
                        res.redirect('/')
                    } else {
                        req.flash('alertMessage', `You've entered wrong password`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/auth/login')
                    }
        
                } else {
                    req.flash('alertMessage', `Sorry your account is inactive, please contact admin!`)
                    req.flash('alertStatus', 'danger')
                    res.redirect('/auth/login')
                }
        
            } else {
                req.flash('alertMessage', `Email not yet registered`)
                req.flash('alertStatus', 'danger')
                res.redirect('/auth/login')
            }
        
        } catch (err) {
            console.log("err login: ", err)
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/auth/login')
        }
    },

    userRegister: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            res.render("dashboard/auth/register", {
                title: "Compete App | Register"
            })
        } catch (error) {
            console.log(error)
        }
    },

    actionRegister: async (req, res, next) => {
        try {
            let payload = req.body

            payload = {
                ...payload,
                password: bcrypt.hashSync(payload.password, 8)
            }   

            const existedUser = await User.findOne({ email: payload.email })

            if(existedUser) {
                // res.status(409).json({ message : 'Email has been used' })
                req.flash('alertMessage', `Email has been used`)
                req.flash('alertStatus', 'danger')
                res.redirect('/auth/register')
            }

            let user = new User(payload)
    
            await user.save()
    
            delete user._doc.password

            res.redirect('/auth/login')
    
        } catch (err) {
            if(err && err.name === "ValidationError"){
                return res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                })
            }
            console.log(err)
            next(err)
        }
    },

    actionLogout : (req, res)=>{
        req.session = null;
        res.redirect('/auth/login')
    }
}