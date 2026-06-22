const nodemailer = require('nodemailer')
const env = require('./env')

const transporter = nodemailer.createTransport({
  host: env.emailHost,
  port: env.emailPort,
  secure: false,
  auth: {
    user: env.emailUser,
    pass: env.emailPass
  }
})

async function sendMail({ to, subject, html }) {
  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    html
  })
}

module.exports = { sendMail }
