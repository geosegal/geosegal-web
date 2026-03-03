// ==========================
// DATOS SIMULADOS
// ==========================

const clientes = [
  {
    rut: "14.245.559-5",
    proyectos: {
      topografia: [
        {
          nombre: "Levantamiento Lote A",
          estado: "finalizado",
          fecha: "Enero 2026",
          archivos: [
            { nombre: "Plano.pdf", link: "https://drive.google.com/file/d/XXXXXXXX/view?usp=sharing" }
          ]
        }
      ],
      arquitectura: [],
      ingenieria: [
        {
          nombre: "Cálculo estructural Bodega",
          estado: "proceso",
          fecha: "Febrero 2026",
          archivos: [
            { nombre: "Memoria.pdf", link: "https://drive.google.com/file/d/XXXXXXXX/view?usp=sharing" }
          ]
        }
      ]
    }
  },

  {
  rut: "20.311.655-1",
  proyectos: {
    topografia: [],
    arquitectura: [
      {
        nombre: "Regularización Vivienda Rural",
        estado: "finalizado",
        fecha: "Diciembre 2025",
        archivos: [
          { nombre: "Expediente.pdf", link: "LINK_DRIVE" }
        ]
      }
    ],
    ingenieria: []
  }
}
];

// ==========================
// VALIDAR FORMATO RUT
// ==========================

function validarRutCompleto(rut) {

  rut = rut.replace(/\./g, '').replace('-', '');
  const cuerpo = rut.slice(0, -1);
  let dv = rut.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * cuerpo.charAt(i);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvFinal = dvEsperado === 11 ? '0' :
                  dvEsperado === 10 ? 'K' :
                  dvEsperado.toString();

  return dvFinal === dv;
}
// ==========================
// ELEMENTOS
// ==========================

const loginBtn = document.getElementById("loginBtn");
const rutInput = document.getElementById("rutInput");
const errorMessage = document.getElementById("errorMessage");
const loginSection = document.getElementById("loginSection");
const portalSection = document.getElementById("portalSection");
const projectsContainer = document.getElementById("projectsContainer");
const logoutBtn = document.getElementById("logoutBtn");

// ==========================
// LOGIN
// ==========================

loginBtn.addEventListener("click", () => {

  const rutIngresado = rutInput.value.trim();

  if (!validarRutCompleto(rutIngresado)) {
  errorMessage.textContent = "RUT inválido.";
  return;
}

  const cliente = clientes.find(c => c.rut === rutIngresado);

  if (!cliente) {
    errorMessage.textContent = "No se encontraron proyectos asociados a este RUT.";
    return;
  }

  errorMessage.textContent = "";
  mostrarProyectos(cliente.proyectos);

  loginSection.classList.add("hidden");
  portalSection.classList.remove("hidden");
});

// ==========================
// MOSTRAR PROYECTOS
// ==========================

function mostrarProyectos(proyectos) {

  projectsContainer.innerHTML = "";

  crearCategoria("Topografía", proyectos.topografia);
  crearCategoria("Arquitectura", proyectos.arquitectura);
  crearCategoria("Ingeniería", proyectos.ingenieria);
}

function crearCategoria(titulo, lista) {

  const category = document.createElement("div");
  category.classList.add("category");

  const title = document.createElement("h3");
  title.textContent = titulo;
  category.appendChild(title);

  if (!lista || lista.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No existen proyectos en esta categoría.";
    empty.style.fontSize = "14px";
    empty.style.color = "#777";
    category.appendChild(empty);
  } else {

    lista.forEach(proyecto => {

      const card = document.createElement("div");
      card.classList.add("project-card");

      const info = document.createElement("div");
      info.classList.add("project-info");

      const nombre = document.createElement("strong");
      nombre.textContent = proyecto.nombre;

      const estado = document.createElement("span");
      estado.classList.add("status");

      if (proyecto.estado === "finalizado") {
        estado.textContent = "🟢 Finalizado";
        estado.classList.add("finalizado");
      } 
      else if (proyecto.estado === "proceso") {
        estado.textContent = "🟠 En proceso";
        estado.classList.add("proceso");
      } 
      else {
        estado.textContent = "🔴 Sin iniciar";
        estado.classList.add("sin-iniciar");
      }

      info.appendChild(nombre);
      info.appendChild(estado);

      if (proyecto.fecha) {
        const fecha = document.createElement("small");
        fecha.textContent = proyecto.fecha;
        info.appendChild(fecha);
      }

      card.appendChild(info);

      if (proyecto.archivos && proyecto.archivos.length > 0) {
        const btn = document.createElement("a");
        btn.href = proyecto.archivos[0].link;
        btn.target = "_blank";
        btn.classList.add("download-btn");
        btn.textContent = "Descargar archivos";
        card.appendChild(btn);
      }

      category.appendChild(card);
    });
  }

  projectsContainer.appendChild(category);
}

// ==========================
// LOGOUT
// ==========================

logoutBtn.addEventListener("click", () => {
  portalSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  rutInput.value = "";
});
