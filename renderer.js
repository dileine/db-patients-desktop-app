document.getElementById("searchBttn").addEventListener("click", async () => {
  const surname = document.getElementById("patientSurname").value;
  const phone = document.getElementById("phone").value;
  const insurance = document.getElementById("insurance").value;
  console.log(
    `Buscando paciente: por apellido ${surname} o mutua ${insurance} o telefono ${phone}`
  );

  const response = await fetch("http://localhost:3000/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ surname, phone, insurance }),
  });

  const data = await response.json();
  console.log("Respuesta del servidor:", data);
  const result = document.getElementById("result");

  if (data.exist && data.patient.length > 0) {
    if (data.patient.length === 1) {
      const patient = data.patient[0];
      result.innerHTML = `
      <h3>Datos del paciente</h3>
      <p> Nombre: ${patient.Nombre} ${patient.Apellido}</p>
      <p> Fecha de nacimiento: ${patient.FechaNac || "No especificado"}</p>
      <p> Mutua: ${patient.CodMutua || "No especificado"}</p>
      <p> Doctor: ${patient.CodDoctor || "No especificado"}</p>
      <p> DNI: ${patient.Dni || "No especificado"}</p>
      <p> Número de historia: ${patient.NumHist || "No especificado"}</p>
      <p> Dirección: ${patient.Direccion || "No especificado"}</p>
      <p> Población: ${patient.Poblacion || "No especificado"}</p>
      <p> Código postal: ${patient.Cp || "No especificado"}</p>
      <p> Teléfono: ${patient.Telefono || "No especificado"}</p>
      <p> Teléfono 2: ${patient.Telefono2 || "No especificado"}</p>
      <p> Móvil: ${patient.Movil || "No especificado"}</p>
      <p> Móvil 2: ${patient.Movil2 || "No especificado"}</p>
      <p> Email: ${patient.Email || "No especificado"}</p>
      <button onclick="editPatient(${patient.Codigo})">Editar</button>
      <button onclick="deletePatient(${patient.Codigo})">Eliminar</button>`;
    } else {
      result.innerHTML = "<h3>Pacientes encontrados</h3><ul>";
      data.patient.forEach((patient) => {
        result.innerHTML += `<li><a href="#" onclick="showPatient(${patient.Codigo})">${patient.Nombre} ${patient.Apellido}</a></li>`;
      });
      result.innerHTML += "</ul>";
    }
  } else {
    alert("Paciente no encontrado");

    result.innerHTML = `
    <h3>Crear paciente</h3>
    <form id="createPatient">
    <input type="text" id="newName" placeholder="Nombre" required>
    <input type="text" id="newLastname" placeholder="Apellidos">
    <input type="text" id="newInsurance" placeholder="Mutua">
    <input type="text" id="newDoctor" placeholder="Doctor">
    <input type="text" id="newDNI" placeholder="DNI">
    <input type="text" id="newNumHistoria" placeholder="Número de historia">
    <input type="date" id="newBirthdate" placeholder="Fecha de nacimiento">
    <input type="text" id="newAddress" placeholder="Dirección">
    <input type="text" id="newCity" placeholder="Poblacinón">
    <input type="text" id="newCP" placeholder="Código postal">
    <input type="tel" id="newPhone" placeholder="Teléfono">
    <input type="tel" id="newPhone2" placeholder="Teléfono 2">
    <input type="tel" id="newMobile" placeholder="Móvil">
    <input type="tel" id="newMobile2" placeholder="Móvil 2">
    <input type="email" id="newEmail" placeholder="Correo electrónico">
    <button type="submit">Crear</button>
    </form>`;

    document
      .getElementById("createPatient")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const newName = document.getElementById("newName").value;
        const newLastname = document.getElementById("newLastname").value;
        const newInsurance = document.getElementById("newInsurance").value;
        const newDoctor = document.getElementById("newDoctor").value;
        const newDNI = document.getElementById("newDNI").value;
        const newNumHistoria = document.getElementById("newNumHistoria").value;
        const newBirthdate = document.getElementById("newBirthdate").value;
        const newAddress = document.getElementById("newAddress").value;
        const newCity = document.getElementById("newCity").value;
        const newCP = document.getElementById("newCP").value;
        const newPhone = document.getElementById("newPhone").value;
        const newPhone2 = document.getElementById("newPhone2").value;
        const newMobile = document.getElementById("newMobile").value;
        const newMobile2 = document.getElementById("newMobile2").value;
        const newEmail = document.getElementById("newEmail").value;

        if (!newName) {
          alert("Por favor, introduce un nombre");
          return;
        }

        console.log("Creando paciente:", {
          name: newName,
          lastname: newLastname,
          birthdate: newBirthdate,
        });

        const response = await fetch("http://localhost:3000/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Nombre: newName,
            Apellido: newLastname,
            CodMutua: newInsurance,
            CodDoctor: newDoctor,
            Dni: newDNI,
            NumHist: newNumHistoria,
            FechaNac: newBirthdate,
            Direccion: newAddress,
            Poblacion: newCity,
            Cp: newCP,
            Telefono: newPhone,
            Telefono2: newPhone2,
            Movil: newMobile,
            Movil2: newMobile2,
            Email: newEmail,
          }),
        });

        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        alert(data.mensaje);

        document.getElementById("result").innerHTML = `
        <h3>Datos del paciente</h3>
        <p>Nombre: ${newName} ${newLastname}</p>
        <p>Fecha de nacimiento: ${newBirthdate || "No especificado"}</p>
        <p>Mutua: ${newInsurance || "No especificado"}</p>
        <p>Doctor: ${newDoctor || "No especificado"}</p>
        <p>DNI: ${newDNI || "No especificado"}</p>
        <p>Número de historia: ${newNumHistoria || "No especificado"}</p>
        <p>Dirección: ${newAddress || "No especificado"}</p>
        <p>Población: ${newCity || "No especificado"}</p>
        <p>Código postal: ${newCP || "No especificado"}</p>
        <p>Teléfono: ${newPhone || "No especificado"}</p>
        <p>Teléfono 2: ${newPhone2 || "No especificado"}</p>
        <p>Móvil: ${newMobile || "No especificado"}</p>
        <p>Móvil 2: ${newMobile2 || "No especificado"}</p>
        <p>Email: ${newEmail || "No especificado"}</p>

        <button onclick="editPatient(${data.Codigo})">Editar</button>
        <button onclick="deletePatient(${data.Codigo})">Eliminar</button>
        <button onclick="location.reload()">Volver a buscar</button>
        `;
      });
  }
});

async function showPatient(Codigo) {
  const response = await fetch("http://localhost:3000/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Codigo }),
  });

  const data = await response.json();
  if (data.exist) {
    const patient = data.patient[0];
    document.getElementById("result").innerHTML = `
      <h3>Datos del paciente</h3>
      <p> Nombre: ${patient.Nombre} ${patient.Apellido}</p>
      <p> Fecha de nacimiento: ${patient.FechaNac || "No especificado"}</p>
      <p> Mutua: ${patient.CodMutua || "No especificado"}</p>
      <p> Doctor: ${patient.CodDoctor || "No especificado"}</p>
      <p> DNI: ${patient.Dni || "No especificado"}</p>
      <p> Número de historia: ${patient.NumHist || "No especificado"}</p>
      <p> Dirección: ${patient.Direccion || "No especificado"}</p>
      <p> Población: ${patient.Poblacion || "No especificado"}</p>
      <p> Código postal: ${patient.Cp || "No especificado"}</p>
      <p> Teléfono: ${patient.Telefono || "No especificado"}</p>
      <p> Teléfono 2: ${patient.Telefono2 || "No especificado"}</p>
      <p> Móvil: ${patient.Movil || "No especificado"}</p>
      <p> Móvil 2: ${patient.Movil2 || "No especificado"}</p>
      <p> Email: ${patient.Email || "No especificado"}</p>
      <button onclick="editPatient(${patient.Codigo})">Editar</button>
      <button onclick="deletePatient(${patient.Codigo})">Eliminar</button>`;
  }
}
