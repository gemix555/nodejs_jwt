const Router = require("express");
const router = new Router();
const authController = require("../controllers/auth.controller");
const { check } = require("express-validator");
//const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/users",roleMiddleware(['USER', 'ADMIN']), authController.getUsers);

router.post(
  "/login",
  [
    check("username", "Имя пользователя не можыт быть пустым").notEmpty(),
    check(
      "password",
      "Пароль должен быть больш 4 и меньше 10 сиволов"
    ).isLength({ min: 4, max: 10 }),
  ],
  authController.login
);
router.post(
  "/registration",
  [
    check("username", "Имя пользователя не можыт быть пустым").notEmpty(),
    check(
      "password",
      "Пароль должен быть больш 4 и меньше 10 сиволов"
    ).isLength({ min: 4, max: 10 }),
  ],
  authController.registration
);

module.exports = router;
