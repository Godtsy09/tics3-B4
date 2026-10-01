// ===== Configuración =====
// Endpoint de la actividad: productos de la tienda de prueba
const URL_API = "https://fakestoreapi.com/products";

// Categorías de la API traducidas al tema de Hyrule
const CATEGORIAS = {
  "electronics": "Tecnología Sheikah",
  "men's clothing": "Vestimenta de caballero",
  "women's clothing": "Vestimenta real",
  "jewelery": "Joyería real"
};

// ===== Elementos del DOM =====
const contenedor = document.getElementById("productos");
const estado = document.getElementById("estado");
const botonRecargar = document.getElementById("recargar");

// ===== Pide los productos a la API (fetch + try...catch) =====
async function cargarProductos() {
  // Reinicia la pantalla antes de cada intento
  contenedor.innerHTML = "";
  estado.className = "";
  estado.textContent = "Escaneando la armería...";

  try {
    // Para probar el manejo de errores, abre la página con ?error al final
    const url = location.search.includes("error") ? URL_API + "-error" : URL_API;
    const respuesta = await fetch(url);

    // fetch no lanza error con códigos 404 o 500, así que lo revisamos a mano
    if (!respuesta.ok) {
      throw new Error("La API respondió con el código " + respuesta.status);
    }

    const productos = await respuesta.json();

    // Validación: debe llegar una lista con datos
    if (!Array.isArray(productos) || productos.length === 0) {
      throw new Error("La API no devolvió productos");
    }

    mostrarProductos(productos);
    estado.textContent = productos.length + " tesoros encontrados";
  } catch (error) {
    // Cualquier fallo (sin internet, URL mala, JSON inválido) llega aquí
    console.error("Error al cargar productos:", error);
    estado.className = "error";
    estado.textContent = "La Pizarra Sheikah no pudo conectarse: " + error.message;
  }
}

// ===== Crea una tarjeta por cada producto =====
function mostrarProductos(productos) {
  productos.forEach(function (producto) {
    const tarjeta = document.createElement("article");
    // La clase cambia el color: electrónica = Sheikah, lo demás = realeza
    tarjeta.className = "tarjeta " + (producto.category === "electronics" ? "sheikah" : "caballero");

    // Etiqueta de categoría
    const etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = CATEGORIAS[producto.category] || producto.category;

    // Imagen del producto
    const marco = document.createElement("div");
    marco.className = "marco";
    const imagen = document.createElement("img");
    imagen.src = producto.image;
    imagen.alt = producto.title;
    imagen.loading = "lazy";
    marco.appendChild(imagen);

    // Nombre del producto
    const nombre = document.createElement("h2");
    nombre.textContent = producto.title;

    // Precio del producto
    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = "$" + Number(producto.price).toFixed(2);

    tarjeta.append(etiqueta, marco, nombre, precio);
    contenedor.appendChild(tarjeta);
  });
}

// ===== Eventos =====
botonRecargar.addEventListener("click", cargarProductos);

// Carga inicial al abrir la página
cargarProductos();