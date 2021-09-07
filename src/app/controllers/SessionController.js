const crypto = require("crypto");
const User = require("../models/User");
const mailer = require("../../lib/mailer");
const { hash } = require("bcryptjs");

module.exports = {
  loginForm(req, res) {
    return res.render("login");
  },
  async login(req, res) {
    try {
      req.session.userId = req.user.id;
      req.session.is_admin = req.user.userId;
      req.session.save((error) => {
        if (error) throw error;
        return res.redirect("/admin/profile");
      });
    } catch (error) {
      console.log(error);
      return res.render("admin/users/login", {
        error: "Algo deu errado ao logar",
      });
    }
  },
  logout(req, res) {
    try {
      req.session.destroy();
      res.clearCookie("sid");
      return res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  },
  forgotForm(req, res) {
    return res.render("admin/users/forgot-password");
  },
  async forgot(req, res) {
    try {
      const user = req.user;
      const token = crypto.randomBytes(20).toString("hex");

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now,
      });

      await mailer.sendMail({
        to: user.email,
        from: process.env.APP_MAIL,
        subject: "Recuperação de senha",
        html: `<h2>Recupere sua senha</h2>
        <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
        <p><a href="http://127.0.0.1:3000/password-reset?token=${token}" target="_blank">RECUPERAR SENHA</a></p>`,
      });
      return res.render("signup", {
        success: "Enviamos um link para seu email!",
      });
    } catch (err) {
      console.error(err);
      return res.render("signup", {
        error: "Erro inseperado, tente novamente!",
      });
    }
  },
  resetForm(req, res) {
    return res.render("reset-password", { token: req.query.token });
  },
  async reset(req, res) {
    const { user } = req;
    const { password, token } = req.body;
    try {
      const newPassword = await hash(password, 8);
      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: "",
      });
      return res.render("login", {
        success: "Senha atualizada com sucesso!",
      });
    } catch (err) {
      console.error(err);
      return res.render("reset-password", {
        data: req.body,
        token,
        error: "Erro inseperado, tente novamente!",
      });
    }
  },
};
