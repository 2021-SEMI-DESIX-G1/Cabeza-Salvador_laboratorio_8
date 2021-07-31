const express = require("express");
const fs = require('fs')
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const Data = [
  {
    id: 1,
    name: "Erick Agrazal",
    age: 30,
    status: "active",
  },
  {
    id: 2,
    name: "Prueba Gonzalez",
    age: 34,
    status: "active",
  },
  {
    id: 3,
    name: "Test Rodriguez",
    age: 28,
    status: "active",
  },
];


const util = {

  next_id() {

    var id = 0;

    for (var i = 0; i < Data.length; i++) {

      id = Data[i]["id"] + 1;

    }

    return id;

  },

  exist_user_by_id(id) {

    var exist = false;

    for (var i = 0; i < Data.length; i++) {

      if (Data[i]["id"] === id) {

        exist = true;

      }

    }

    return exist;

  },

  get_user(id) {

    var res = {};

    for (var i = 0; i < Data.length; i++) {

      if (Data[i]["id"] === id) {

        res = {
          user: {
            id: Data[i]["id"],
            name: Data[i]["name"],
            age: Data[i]["age"],
            status: Data[i]["status"]
          }
        }

      }

    }

    return res;

  },

  update_user(id, payload) {

    res = {};

    for (var i = 0; i < Data.length; i++) {

      if (Data[i]["id"] === id) {

        Data[i]["name"] = payload.name;
        Data[i]["age"] = payload.age;
        Data[i]["status"] = payload.status;

        res = {
          user: {
            id: Data[i]["id"],
            name: Data[i]["name"],
            age: Data[i]["age"],
            status: Data[i]["status"]
          }
        };

      }

    }

    return res;

  },

  delete_user(id) {

    for (var i = 0; i < Data.length; i++) {

      if (Data[i]["id"] === id) {

        Data.splice(i);

      }

    }

  }

};


const Users = {

  getUsers: (req, res) => {

    res.json({
      model: "Users",
      count: Data.length,
      data: Data,
    });

  },

  getUser: (req, res) => {

    var id = req.params.id;

    if (util.exist_user_by_id(parseInt(id))) {

      res.json({
        status: 200,
        msg: 'get successfully',
        data: util.get_user(parseInt(id))
      });

    } else {

      res.json({
        status: 400,
        msg: "not found"
      });

    }

  },

  createUser: (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      return res.json(errors);

    }

    const { name, age, status } = req.body;

    Data.push({ id: util.next_id(), name, age, status });

    res.json({
      model: "Users",
      count: Data.length,
      data: Data
    });

  },

  updateUser: (req, res) => {

    var id = req.params.id;

    if (util.exist_user_by_id(parseInt(id))) {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {

        return res.json({
          status: 400,
          msg: errors
        });

      };

      var user = util.update_user(parseInt(id), req.body);

      res.json({
        status: 200,
        msg: 'updated successfully',
        data: user
      });

    } else {

      res.json({
        status: 400,
        msg: "not found"
      });

    }

  },

  deleteUser: (req, res) => {

    var id = req.params.id;

    console.log('id', id);

    if (util.exist_user_by_id(parseInt(id))) {

      util.delete_user(parseInt(id));

      res.json({
        status: 200,
        msg: 'user removed successfully'
      });



    } else {

      res.json({
        status: 400,
        msg: "not found"
      });

    }

  }

};

const UsersValidations = {
  createUser: [
    body("name", "El nombre es incorrecto.").exists({
      checkNull: true,
      checkFalsy: true,
    }),
    body("age", "La edad es incorrecta.").isNumeric(),
    body("status", "El estatus es incorrecto.")
      .exists({ checkNull: true, checkFalsy: true })
      .isIn(["active", "inactive"]),
  ],
};

app.get("/api/v1/users/", Users.getUsers);
app.get("/api/v1/user/:id", Users.getUser);
app.post("/api/v1/user/", UsersValidations.createUser, Users.createUser);
app.put("/api/v1/user/:id", Users.updateUser);
app.delete("/api/v1/user/:id", Users.deleteUser);

app.listen(port, () => {

  console.log(`Ejemplo escuchando en: http://localhost:${port}`);

});
