const User = require("../model/User");
const Role = require("../model/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config/config");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, {expiresIn: "24h"});
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка регистрации", errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: "UserName уже есть" });
      }
      const userRole = await Role.findOne({ value: "ADMIN" });
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json({ message: "Пользователь Создан" });
    } catch (error) {
      console.log("ERROR_Registration", error.message);
      res.status(400).json({ message: "ERROR_Registration" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь ${username} не существует` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Введен неверный пароль" });
      }

      const token = generateAccessToken(user._id, user.roles);
      return res.json({token})
    } catch (error) {
      console.log("ERROR_Login", error.message);
      res.status(400).json({ message: "ERROR_Login" });
    }
  }

  async getUsers(req, res) {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
      console.log("ERROR_GetUsers", error.message);
      res.status(400).json({ message: "ERROR_GetUsers" });
    }
  }
}

module.exports = new authController();
