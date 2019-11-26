const express = require("express");
const logger = require("morgan");
const mongojs = require("mongojs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

const databaseUrl = "workoutTracker";
const collections = ["workouts"];
const db = mongojs(databaseUrl, collections);

db.on("err", err => {
  console.log(err);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post("/submit", (req, res) => {  
  db.workouts.insert(req.body, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
  
app.get("/all", (req, res) => {
    db.workouts.find({}, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    });
});

app.get("/find/:id", (req, res) => {
  db.workouts.findOne(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    }
  );
});
  
app.post("/update/:id", (req, res) => {
  db.workouts.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        title: req.body.title,
        type: req.body.type,
        muscle: req.body.muscle,
        workout: req.body.workout,
      }
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  db.workouts.remove(
    {
      _id: mongojs.ObjectID(req.params.id)
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    }
  );
});

app.delete("/clearall", (req, res) => {
  db.workouts.remove({}, (err, response) => {
    if (err) {
      res.send(err);
    } else {
      res.send(response);
    }
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});