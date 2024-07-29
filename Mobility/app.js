const mariadb = require("mariadb");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const pool = mariadb.createPool({
  host: "192.168.178.24",
  user: "root",
  password: "Hevi2001!",
  database: "user",
  connectionLimit: 5,
});

let conn;

app.get("/users", async (req, res) => {
  console.log("Hier");
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM user");
    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Server error: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

app.post("/register", async (req, res) => {
  console.log("Registering user");
  const { name, password } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();

    // Überprüfen, ob das Passwort bereits existiert
    const rows = await conn.query("SELECT * FROM user WHERE password = ?", [
      password,
    ]);
    if (rows.length > 0) {
      res.json({ passwordExists: true });
    } else {
      // Benutzer hinzufügen, wenn das Passwort nicht existiert
      await conn.query("INSERT INTO user (name, password) VALUES (?, ?)", [
        name,
        password,
      ]);
      res.status(200).send("User added successfully");
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Server error: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

app.post("/addUser", async (req, res) => {
  console.log("Adding user");
  const { name } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("INSERT INTO user (name) VALUES (?)", [name]);
    res.status(200).send("User added successfully");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Server error: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

app.post("/login", async (req, res) => {
  console.log("login");
  const { name, password } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM user WHERE name = ? AND password = ?",
      [name, password]
    );
    if (rows.length > 0) {
      const user = rows[0];
      res.json({ success: true, id: user.id });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Server error: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

// let conn;

app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  let conn;

  pool
    .getConnection()
    .then((connection) => {
      return connection
        .query(
          `
              SELECT * FROM user WHERE id = ?
            `,
          [id]
        )
        .then((rows) => {
          connection.release();
          if (rows.length > 0) {
            const user = rows[0];
            res.json({ success: true, user });
          } else {
            res.json({ success: false });
          }
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
});

app.post("/updateSteps", (req, res) => {
  const { steps, id } = req.body;

  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET steps = COALESCE(steps, 0) + ? WHERE id = ?
      `,
        [steps, id]
      ); // Setzen Sie steps auf 0, wenn es NULL ist, bevor Sie die neuen Schritte hinzufügen
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateStepsAfterMaps", (req, res) => {
  const { steps, id } = req.body;
  let connection;
  console.log("steps", steps);

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET steps = ? WHERE id = ?
      `,
        [steps, id]
      ); // Setzen Sie steps auf den neuen Wert
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateDmgPoints", (req, res) => {
  const { dmgPoints, id } = req.body;
  let connection;
  console.log("Backend dmgPoints", dmgPoints);

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET dmgPoints = ? WHERE id = ?
      `,
        [dmgPoints, id]
      );
    })
    .then((result) => {
      res.json({
        success: true,
        message: "Successfully updated damage points",
      });
      if (connection) connection.release();
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "Failed to update damage points" });
      if (connection) connection.release();
    });
});

app.post("/updateStepsLastDay", (req, res) => {
  const { steps, id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET stepsLastDay = COALESCE(stepsLastDay, 0) + ? WHERE id = ?
      `,
        [steps, id]
      ); // Setzen Sie stepsLastDay auf 0, wenn es NULL ist, bevor Sie die neuen Schritte hinzufügen
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getUserLevel", (req, res) => {
  const { id } = req.query;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT COALESCE(level, 1) as level FROM user WHERE id = ?
      `,
        [id]
      ); // Setzen Sie level auf 1, wenn es NULL ist
    })
    .then((result) => {
      if (result.length > 0) {
        res.json({ success: true, level: result[0].level });
      } else {
        res.json({ success: false, message: "User not found" });
      }
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getUserSteps", (req, res) => {
  console.log(1, "Endpunkt getUserSteps");
  const { id } = req.query;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT COALESCE(steps, 0) as steps FROM user WHERE id = ?
      `,
        [id]
      ); // Setzen Sie steps auf 0, wenn es NULL ist
    })
    .then((result) => {
      if (result.length > 0) {
        res.json({ success: true, steps: result[0].steps });
      } else {
        res.json({ success: false, message: "User not found" });
      }
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getUserDmgPoints", (req, res) => {
  const { id } = req.query;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT COALESCE(dmgPoints, 0) as dmgPoints FROM user WHERE id = ?
      `,
        [id]
      ); // Setzen Sie dmgPoints auf 0, wenn es NULL ist
    })
    .then((result) => {
      if (result.length > 0) {
        res.json({ success: true, dmgPoints: result[0].dmgPoints });
      } else {
        res.json({ success: false, message: "User not found" });
      }
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/everynameandstepsandlevel", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name, COALESCE(steps, 0) as steps, COALESCE(level, 1) as level FROM user"
    );
    //console.log(result.rows); // Log only the data
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message }); // Send the error message in the response
  }
});

app.get("/everynameandstepsandlevelandidandpoisened", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, COALESCE(steps, 0) as steps, COALESCE(level, 1) as level, poisened FROM user"
    );
    //console.log(result.rows); // Log only the data
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message }); // Send the error message in the response
  }
});

app.post("/updateLevel", (req, res) => {
  const { level, id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET level = ? WHERE id = ?
      `,
        [level, id]
      );
    })
    .then(() => {
      res.json({ success: true, message: "Level updated successfully" });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "An error occurred", error: err });
      if (connection) connection.release();
    });
});

const isMidnight = () => {
  const now = new Date();
  //console.log(now.getHours(), now.getMinutes());
  return now.getHours() === 0 && now.getMinutes() === 0;
};

setInterval(() => {
  if (isMidnight()) {
    pool.getConnection().then((connection) => {
      return connection
        .query(
          `
        UPDATE user
        SET dmgPoints = CEIL(stepsLastDay * 0.25) + level * 100,
            stepsLastDay = 0,
            lastClick = 0,
            singed = 1000,
            steps = CASE
                      WHEN poisened = 1 THEN GREATEST(steps - 3000, 0)
                      ELSE steps
                    END,
            poisened = 0,
            potionClick = 0
        `
        )
        .then(() => {
          console.log("Die Spalten wurden erfolgreich aktualisiert");
          if (connection) connection.release();
        })
        .catch((err) => {
          console.log(err);
          if (connection) connection.release();
        });
    });
  }
}, 60000); // Überprüfen Sie jede Minute

app.get("/getDmgPoints", (req, res) => {
  const { id } = req.query;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT dmgPoints FROM user WHERE id = ?
      `,
        [id]
      );
    })
    .then((result) => {
      res.json({ success: true, dmgPoints: result[0].dmgPoints });
      if (connection) connection.release();
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getNumberOfDebuff", (req, res) => {
  const { id } = req.query;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT COALESCE(numberOfDebuff, 0) as numberOfDebuff FROM user WHERE id = ?
      `,
        [id]
      );
    })
    .then((result) => {
      res.json({ success: true, numberOfDebuff: result[0].numberOfDebuff });
      if (connection) connection.release();
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/attackUser", (req, res) => {
  const { user2, dmgPoints, userId } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET steps = CASE WHEN steps - ? < 0 THEN 0 ELSE steps - ? END WHERE id = ?
      `,
        [dmgPoints, dmgPoints, user2]
      );
    })
    .then((result) => {
      return connection.query(
        `
        UPDATE user SET dmgPoints = 0 WHERE id = ?
      `,
        [userId]
      );
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release();
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getLastClick", (req, res) => {
  const { id } = req.query;
  let connection;
  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT lastClick FROM user WHERE id = ?
      `,
        [id]
      );
    })
    .then((result) => {
      if (result.length > 0) {
        let lastClick = result[0].lastClick;
        if (lastClick === null) {
          lastClick = 0;
        }
        res.json({ success: true, lastClick: lastClick });
      } else {
        res.json({ success: false, message: "User not found" });
      }
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateLastClick", (req, res) => {
  const { lastClick, id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET lastClick = ? WHERE id = ?
      `,
        [lastClick, id]
      );
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getLastPotionClick", (req, res) => {
  const { id } = req.query;
  let connection;
  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT potionClick FROM user WHERE id = ?
      `,
        [id]
      );
    })
    .then((result) => {
      if (result.length > 0) {
        let lastPotionClick = result[0].potionClick;
        if (lastPotionClick === null) {
          lastPotionClick = 0;
        }
        res.json({ success: true, potionClick: lastPotionClick });
      } else {
        res.json({ success: false, message: "User not found" });
      }
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateLastPotionClick", (req, res) => {
  const { id, potionClick } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET potionClick = ? WHERE id = ?
      `,
        [potionClick, id]
      );
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateStepAfterBuff", (req, res) => {
  const { id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET steps = steps + 3000 WHERE id = ?
      `,
        [id]
      ); // Setzen Sie steps auf 0, wenn es NULL ist, bevor Sie die neuen Schritte hinzufügen
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updatePoisendAfterHeal", (req, res) => {
  const { id } = req.body;
  let connection;
  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
      UPDATE user SET poisened = 0, singed = 1000 WHERE id = ?
    `,
        [id]
      );
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateNumberOfDebuff", (req, res) => {
  const { id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET numberOfDebuff = COALESCE(numberOfDebuff, 0) + 1 WHERE id = ?
      `,
        [id]
      ); // Setzen Sie numberOfDebuff auf 0, wenn es NULL ist, bevor Sie 1 hinzufügen
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/addresses", (req, res) => {
  pool
    .getConnection()
    .then((connection) => {
      return connection.query("SELECT id, adr FROM adressen").then((rows) => {
        connection.release();
        if (rows.length > 0) {
          res.json({ success: true, addresses: rows }); // send all rows
        } else {
          res.json({ success: false });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
});

app.post("/updateAddress", (req, res) => {
  const { adr, id } = req.body;
  let connection;
  // console.log("adr", adr);
  // console.log("id", id);

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE adressen SET adr = ? WHERE id = ?
      `,
        [adr, id]
      );
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release(); // Release the connection back to the pool
    });
});

app.post("/reduceNumberOfDebuff", (req, res) => {
  const { userId } = req.body;
  let connection;
  // console.log("userId", userId);

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET numberOfDebuff = numberOfDebuff - 1 WHERE id = ?
      `,
        [userId]
      );
    })
    .then(() => {
      res.json({
        success: true,
        message: "numberOfDebuff updated successfully",
      });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "An error occurred", error: err });
      if (connection) connection.release();
    });
});

app.post("/raisePoisened", (req, res) => {
  const { userId } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET poisened = 1 WHERE id = ?
      `,
        [userId]
      );
    })
    .then(() => {
      res.json({
        success: true,
        message: "Poisened user updated successfully",
      });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "An error occurred", error: err });
      if (connection) connection.release();
    });
});

app.get("/getPoisened", (req, res) => {
  const { userId } = req.query;
  // console.log(userId);
  let connection;
  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT poisened FROM user WHERE id = ?
      `,
        [userId]
      );
    })
    .then((result) => {
      if (result.length > 0) {
        let user = result[0];
        // console.log(user.poisened);
        res.json({ success: true, user: user });
      } else {
        res.json({ success: false, message: "User not found or not poisened" });
      }
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/setSinged", (req, res) => {
  const { user2, userId } = req.body;
  // console.log("user2", user2);
  // console.log("userId", userId);
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET singed = ? WHERE id = ?
      `,
        [userId, user2]
      );
    })
    .then(() => {
      res.json({
        success: true,
        message: "Singed user updated successfully",
      });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "An error occurred", error: err });
      if (connection) connection.release();
    });
});

app.get("/getSinged", (req, res) => {
  const { id } = req.query;

  let connection;
  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT singed FROM user WHERE id = ?
      `,
        [id]
      );
    })
    .then((result) => {
      if (result.length > 0) {
        let singedId = result[0].singed;
        if (singedId === null || singedId === 1000) {
          res.json({ success: true, singedName: "" });
        } else {
          return connection.query(
            `
            SELECT name FROM user WHERE id = ?
          `,
            [singedId]
          );
        }
      } else {
        res.json({ success: false, message: "User not found" });
      }
    })
    .then((result) => {
      if (result && result.length > 0) {
        let singedName = result[0].name;
        res.json({ success: true, singedName: singedName });
      }
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateStepAfterPotion", (req, res) => {
  const { id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE user SET steps = COALESCE(steps, 0) + 750 WHERE id = ?
      `,
        [id]
      ); // Setzen Sie steps auf 0, wenn es NULL ist, bevor Sie die neuen Schritte hinzufügen
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});
