module.exports = {
  isAuthenticated: async (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
        req.flash('alertMessage', `Sorry, your session has expired, please log back in`)
        req.flash('alertStatus', 'danger')
        res.redirect('/auth/login')
    } else {
        next()
    }
  },
}