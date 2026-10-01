// ===== Datos: catálogo de la Armería de Hyrule =====
// Los datos viven aquí dentro, así que no se necesita ningún archivo JSON ni servidor.
const ARTICULOS = [
  { id: "pizarra-sheikah", nombre: "Pizarra Sheikah", precio: 1200, categoria: "Tecnología Sheikah",
    descripcion: "Tableta antigua con mapa, runas y cámara.",
    imagen: "img/pizarra-sheikah.svg" },
  { id: "espada-maestra", nombre: "Espada Maestra", precio: 3000, categoria: "Equipo de caballero",
    descripcion: "La hoja que sella la oscuridad.",
    imagen: "img/espada-maestra.svg" },
  { id: "escudo-hyliano", nombre: "Escudo Hyliano", precio: 900, categoria: "Equipo de caballero",
    descripcion: "Escudo de la guardia real con el emblema de Hyrule.",
    imagen: "img/escudo-hyliano.svg" },
  { id: "tunica-campeon", nombre: "Túnica del Campeón", precio: 750, categoria: "Equipo de caballero",
    descripcion: "Ropa azul con detalles dorados de la realeza.",
    imagen: "img/tunica-campeon.svg" },
  { id: "yelmo-caballero-real", nombre: "Yelmo del Caballero Real", precio: 650, categoria: "Equipo de caballero",
    descripcion: "Casco de acero con penacho azul.",
    imagen: "img/yelmo-caballero-real.svg" },
  { id: "casco-antiguo", nombre: "Casco Antiguo", precio: 1100, categoria: "Tecnología Sheikah",
    descripcion: "Armadura de tecnología Sheikah con brillo cian.",
    imagen: "img/casco-antiguo.svg" },
  { id: "flecha-ancestral", nombre: "Flecha Ancestral", precio: 800, categoria: "Tecnología Sheikah",
    descripcion: "Punta de energía cian que destruye guardianes.",
    imagen: "img/flecha-ancestral.svg" },
  { id: "ojo-sheikah", nombre: "Amuleto del Ojo Sheikah", precio: 500, categoria: "Tecnología Sheikah",
    descripcion: "Símbolo sagrado de la tribu Sheikah.",
    imagen: "img/ojo-sheikah.svg" },
  { id: "botas-caballero", nombre: "Botas de Caballero", precio: 300, categoria: "Equipo de caballero",
    descripcion: "Botas de cuero reforzado para largas travesías.",
    imagen: "img/botas-caballero.svg" },
  { id: "arco-real", nombre: "Arco Real", precio: 700, categoria: "Equipo de caballero",
    descripcion: "Arco de madera de la guardia de Hyrule.",
    imagen: "img/arco-real.svg" },
  { id: "nucleo-guardian", nombre: "Núcleo de Guardián", precio: 450, categoria: "Tecnología Sheikah",
    descripcion: "Pieza brillante de las máquinas antiguas.",
    imagen: "img/nucleo-guardian.svg" },
  { id: "sensor-sheikah", nombre: "Sensor Sheikah", precio: 950, categoria: "Tecnología Sheikah",
    descripcion: "Radar que detecta santuarios y tesoros.",
    imagen: "img/sensor-sheikah.svg" }
];

// ===== "API" local =====
// Convierte el catálogo en una dirección temporal (Blob) que fetch() puede pedir.
// Para probar el manejo de errores, abre la página con ?error al final (index.html?error).
function obtenerUrlApi() {
  if (location.search.includes("error")) {
    return "api-que-no-existe"; // fuerza un fallo para el catch
  }
  const blob = new Blob([JSON.stringify(ARTICULOS)], { type: "application/json" });
  return URL.createObjectURL(blob);
}

// ===== Elementos del DOM =====
const contenedor = document.getElementById("productos");
const estado = document.getElementById("estado");
const botonRecargar = document.getElementById("recargar");

// ===== Pide los artículos (fetch + try...catch) =====
async function cargarProductos() {
  // Reinicia la pantalla antes de cada intento
  contenedor.innerHTML = "";
  estado.className = "";
  estado.textContent = "Escaneando la armería...";

  try {
    const respuesta = await fetch(obtenerUrlApi());

    // fetch no lanza error con códigos 404 o 500, así que lo revisamos a mano
    if (!respuesta.ok) {
      throw new Error("El servidor respondió con el código " + respuesta.status);
    }

    const articulos = await respuesta.json();

    // Validación: debe llegar una lista con datos
    if (!Array.isArray(articulos) || articulos.length === 0) {
      throw new Error("No llegaron artículos");
    }

    mostrarArticulos(articulos);
    estado.textContent = articulos.length + " tesoros encontrados";
  } catch (error) {
    // Cualquier fallo (dirección incorrecta, JSON inválido, sin conexión) llega aquí
    console.error("Error al cargar artículos:", error);
    estado.className = "error";
    estado.textContent = "La Pizarra Sheikah no pudo conectarse: " + error.message;

  }
}

// ===== Crea una tarjeta por cada artículo =====
function mostrarArticulos(articulos) {
  articulos.forEach(function (articulo) {
    const tarjeta = document.createElement("article");
    // La clase cambia el color según la categoría
    tarjeta.className = "tarjeta " + (articulo.categoria === "Tecnología Sheikah" ? "sheikah" : "caballero");

    // Etiqueta de categoría
    const etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = articulo.categoria;

    // Imagen del artículo
    const marco = document.createElement("div");
    marco.className = "marco";
    const imagen = document.createElement("img");
    imagen.src = articulo.imagen;
    imagen.alt = articulo.nombre;
    marco.appendChild(imagen);

    // Nombre
    const nombre = document.createElement("h2");
    nombre.textContent = articulo.nombre;

    // Descripción
    const descripcion = document.createElement("p");
    descripcion.className = "descripcion";
    descripcion.textContent = articulo.descripcion;

    // Precio en rupias
    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = Number(articulo.precio).toLocaleString("es") + " rupias";

    tarjeta.append(etiqueta, marco, nombre, descripcion, precio);
    contenedor.appendChild(tarjeta);
  });
}

// ===== Eventos =====
botonRecargar.addEventListener("click", cargarProductos);

// Carga inicial al abrir la página
cargarProductos();