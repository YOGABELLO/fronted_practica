import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api";

// ============================================
// VISTA 1: LOGIN
// ============================================

// GET / - Muestra el formulario de login
export const getLogin = (req, res) => {
    // Si ya hay sesión activa, redirigir al menú
    if (req.session.token) {
        return res.redirect("/menu");
    }
    // Renderizar vista de login sin errores
    res.render("login", { error: null });
};

// POST /login - Procesa el formulario de login
export const postLogin = async (req, res) => {
    const { usuario, contraseña } = req.body;
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, contraseña })
        });

        const data = await response.json();

        if (!response.ok) {
            // Login fallido, mostrar error
            return res.render("login", { error: data.message || "Credenciales inválidas" });
        }

        // Login exitoso: guardar token en sesión
        req.session.token = data.token;
        res.redirect("/menu");

    } catch (error) {
        console.error("Error en login:", error);
        res.render("login", { error: "Error de conexión con el servidor" });
    }

    // VISTA 2: MENÚ PRINCIPAL
// ============================================

// GET /menu - Muestra el menú principal
export const getMenu = (req, res) => {

    res.render("menu");

};

// VISTA 3: LISTAR REGISTROS//
// ============================================

// GET /usuarios - Muestra la lista de usuarios
export const getUsuarios = async (req, res) => {

    try {

        const response = await fetch(`${API_URL}/usuarios`, {

            headers: {

                "Authorization": `Bearer ${req.session.token}`

            }

        });


        if (!response.ok) {

            throw new Error("Error al obtener usuarios");

        }


        const usuarios = await response.json();

        res.render("listar", { usuarios });


    } catch (error) {

        console.error("Error:", error);

        res.render("listar", { usuarios: [] });

    }

};

// VISTA 4: CREAR REGISTRO
// ============================================

// GET /usuarios/nuevo - Muestra formulario de creación
export const getNuevoUsuario = (req, res) => {

    res.render("crear", { error: null });

};


// POST /usuarios/crear - Procesa la creación
export const postCrearUsuario = async (req, res) => {

    const { nombre, email } = req.body;

    

    try {

        const response = await fetch(`${API_URL}/usuarios`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${req.session.token}`

            },

            body: JSON.stringify({ nombre, email })

        });


        if (!response.ok) {

            const data = await response.json();

            return res.render("crear", { error: data.message || "Error al crear usuario" });

        }


        res.redirect("/usuarios");


    } catch (error) {

        console.error("Error:", error);

        res.render("crear", { error: "Error de conexión con el servidor" });

    }

};

// GET /logout - Cierra la sesión
export const logout = (req, res) => {

    req.session.destroy((err) => {

        if (err) console.error("Error al cerrar sesión:", err);

        res.redirect("/");

    });
    
};

};