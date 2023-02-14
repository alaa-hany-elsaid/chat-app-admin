const jwt = require("jsonwebtoken");
const { hashPassword, validatePassword } = require("../services/auth");
const db = require("../database/models");

exports.signup = async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  const hashedPassword = await hashPassword(password);
  const newUser = await db.User.create({
    firstName,
    lastName,
    phone,
    email,
    password: hashedPassword,
    role: "normal",
  });
  const accessToken = jwt.sign(
    { userId: newUser.id, role: newUser.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  await newUser.save();
  res.cookie("accessToken", accessToken);
  res.json({
    data: {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await db.User.findOne({ where: { email } });
  if (!user || !(await validatePassword(password, user.password)))
    return res.status(400).json({
      errors: [{ param: "email", msg: "email or password is incorrect" }],
    });
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.cookie("accessToken", accessToken);
  res.status(200).json({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
    },
    accessToken,
  });
};

exports.updateProfile = async function (req, res) {
  const { email, password, firstName, lastName, phone } = req.body;
  let data = {
    email,
    password,
    firstName,
    lastName,
    phone,
  };
  data = Object.fromEntries(Object.entries(data).filter(([k, v]) => !!v));
  if (!!data["password"]) {
    data["password"] = await hashPassword(data["password"]);
  }
  const user = await db.User.findOne({ where: { id: req.auth.userId } });
  await user.update(data);
  res.json({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
    },
  });
};

exports.getProfile = async function (req, res) {
  const user = await db.User.findOne({ where: { id: req.auth.userId } });
  res.json({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
    },
  });
};
