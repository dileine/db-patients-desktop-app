const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  user: "user_name",
  password: "password",
  server: "localhost",
  database: "pacientes",
  options: {
    encrypt: false, // true for Windows Azure
    trustServerCertificate: true,
  },
};

// Connect to the database
async function getPool() {
  try {
    return await sql.connect(dbConfig);
  } catch (error) {
    console.error("Errorde conexión a la base de datos", error.message);
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
        "SELECT * FROM Pacientes WHERE nombre LIKE '%' + @name + '%' OR apellido LIKE '%' + @name + '%' OR codMutua = @insurance + '%'"
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
      .query("SELECT * FROM pacientes WHERE codigo = @codigo");

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
    nombre,
    apellido,
    codMutua,
    codDoctor,
    dni,
    numHist,
    fechaNac,
    direccion,
    poblacion,
    cp,
    telefono,
    telefono2,
    movil,
    movil2,
    email,
  } = req.body;
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("codMutua", sql.Int, codMutua)
      .input("codDoctor", sql.Int, codDoctor)
      .input("dni", sql.VarChar, dni)
      .input("numHist", sql.VarChar, numHist)
      .input("fechaNac", sql.Date, fechaNac)
      .input("direccion", sql.VarChar, direccion)
      .input("poblacion", sql.VarChar, poblacion)
      .input("cp", sql.VarChar, cp)
      .input("telefono", sql.VarChar, telefono)
      .input("telefono2", sql.VarChar, telefono2)
      .input("movil", sql.VarChar, movil)
      .input("movil2", sql.VarChar, movil2)
      .input("email", sql.VarChar, email)
      .query(
        "INSERT INTO pacientes (nombre, apellido, codMutua, codDoctor, dni, numHist, fechaNac, direccion, poblacion, cp, telefono, telefono2, movil, movil2, email) VALUES (@nombre, @apellido, @codMutua, @codDoctor, @dni, @numHist, @fechaNac, @direccion, @poblacion, @cp, @telefono, @telefono2, @movil, @movil2, @email)"
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
    codigo,
    nombre,
    apellido,
    codMutua,
    codDoctor,
    dni,
    numHist,
    fechaNac,
    direccion,
    poblacion,
    cp,
    telefono,
    telefono2,
    movil,
    movil2,
    email,
  } = req.body;
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("codigo", sql.Int, codigo)
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("codMutua", sql.Int, codMutua)
      .input("codDoctor", sql.Int, codDoctor)
      .input("dni", sql.VarChar, dni)
      .input("numHist", sql.VarChar, numHist)
      .input("fechaNac", sql.Date, fechaNac)
      .input("direccion", sql.VarChar, direccion)
      .input("poblacion", sql.VarChar, poblacion)
      .input("cp", sql.VarChar, cp)
      .input("telefono", sql.VarChar, telefono)
      .input("telefono2", sql.VarChar, telefono2)
      .input("movil", sql.VarChar, movil)
      .input("movil2", sql.VarChar, movil2)
      .input("email", sql.VarChar, email)
      .query(
        "UPDATE pacientes SET nombre = @nombre, apellido = @apellido, codMutua = @codMutua, codDoctor = @codDoctor, dni = @dni, numHist = @numHist, fechaNac = @fechaNac, direccion = @direccion, poblacion = @poblacion, cp = @cp, telefono = @telefono, telefono2 = @telefono2, movil = @movil, movil2 = @movil2, email = @email WHERE codigo = @codigo"
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
  const { codigo } = req.body;
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("codigo", sql.Int, codigo)
      .query("DELETE FROM pacientes WHERE codigo = @codigo");

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
