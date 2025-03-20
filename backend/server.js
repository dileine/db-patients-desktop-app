const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  user: "user_name",
  password: "user_password",
  server: "localhost",
  database: "database_name",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Connect to the database
async function getPool() {
  try {
    return await sql.connect(dbConfig);
  } catch (error) {
    console.error("Error de conexión a la base de datos", error.message);
    throw new Error("Error al conectarse a la base de datos");
  }
}

// Search for a patient
app.post("/search", async (req, res) => {
  const { name, insurance } = req.body;
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("insurance", sql.VarChar, insurance)
      .query(
        "SELECT * FROM Pacientes WHERE Nombre LIKE '%' + @name + '%' OR Apellido LIKE '%' + @name + '%' OR CodMutua = @insurance + '%'"
      );

    res.json({
      exist: result.recordset.length > 0,
      patient: result.recordset,
    });
  } catch (error) {
    console.error("Error al buscar paciente", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/searchById", async (req, res) => {
  const { codigo } = req.body;
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("codigo", sql.Int, codigo)
      .query("SELECT * FROM pacientes WHERE Codigo = @codigo");

    res.json({
      exist: result.recordset.length > 0,
      patient: result.recordset,
    });
  } catch (error) {
    console.error("Error al buscar paciente", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create a patient
app.post("/create", async (req, res) => {
  const {
    Nombre,
    Apellido,
    CodMutua,
    CodDoctor,
    Dni,
    NumHist,
    FechaNac,
    Direccion,
    Poblacion,
    Cp,
    Telefono,
    Telefono2,
    Movil,
    Movil2,
    Email,
  } = req.body;
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("nombre", sql.VarChar, Nombre)
      .input("apellido", sql.VarChar, Apellido)
      .input("codMutua", sql.Int, CodMutua)
      .input("codDoctor", sql.Int, CodDoctor)
      .input("dni", sql.VarChar, Dni)
      .input("numHist", sql.VarChar, NumHist)
      .input("fechaNac", sql.Date, FechaNac)
      .input("direccion", sql.VarChar, Direccion)
      .input("poblacion", sql.VarChar, Poblacion)
      .input("cp", sql.VarChar, Cp)
      .input("telefono", sql.VarChar, Telefono)
      .input("telefono2", sql.VarChar, Telefono2)
      .input("movil", sql.VarChar, Movil)
      .input("movil2", sql.VarChar, Movil2)
      .input("email", sql.VarChar, Email)
      .query(
        "INSERT INTO pacientes (Nombre, Apellido, CodMutua, CodDoctor, Dni, NumHist, FechaNac, Direccion, Poblacion, Cp, Telefono, Telefono2, Movil, Movil2, Email) VALUES (@nombre, @apellido, @codMutua, @codDoctor, @dni, @numHist, @fechaNac, @direccion, @poblacion, @cp, @telefono, @telefono2, @movil, @movil2, @email)"
      );

    res.json({ mensaje: "Paciente creado correctamente" });
  } catch (error) {
    console.error("Error al crear paciente", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update a patient
app.put("/update", async (req, res) => {
  const {
    Codigo,
    Nombre,
    Apellido,
    CodMutua,
    CodDoctor,
    Dni,
    NumHist,
    FechaNac,
    Direccion,
    Poblacion,
    Cp,
    Telefono,
    Telefono2,
    Movil,
    Movil2,
    Email,
  } = req.body;
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("codigo", sql.Int, Codigo)
      .input("nombre", sql.VarChar, Nombre)
      .input("apellido", sql.VarChar, Apellido)
      .input("codMutua", sql.Int, CodMutua)
      .input("codDoctor", sql.Int, CodDoctor)
      .input("dni", sql.VarChar, Dni)
      .input("numHist", sql.VarChar, NumHist)
      .input("fechaNac", sql.Date, FechaNac)
      .input("direccion", sql.VarChar, Direccion)
      .input("poblacion", sql.VarChar, Poblacion)
      .input("cp", sql.VarChar, Cp)
      .input("telefono", sql.VarChar, Telefono)
      .input("telefono2", sql.VarChar, Telefono2)
      .input("movil", sql.VarChar, Movil)
      .input("movil2", sql.VarChar, Movil2)
      .input("email", sql.VarChar, Email)
      .query(
        "UPDATE pacientes SET Nombre = @nombre, Apellido = @apellido, CodMutua = @codMutua, CodDoctor = @codDoctor, Dni = @dni, NumHist = @numHist, FechaNac = @fechaNac, Direccion = @direccion, Poblacion = @poblacion, Cp = @cp, Telefono = @telefono, Telefono2 = @telefono2, Movil = @movil, Movil2 = @movil2, Email = @email WHERE Codigo = @codigo"
      );

    if (result.rowsAffected[0] > 0) {
      res.json({ mensaje: "Paciente actualizado correctamente" });
    } else {
      res.status(404).json({ error: "Paciente no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar paciente", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete a patient
app.delete("/delete", async (req, res) => {
  const { Codigo } = req.body;
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("codigo", sql.Int, Codigo)
      .query("DELETE FROM pacientes WHERE Codigo = @codigo");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }
    res.json({ mensaje: "Paciente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar paciente", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
