const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const express = require('express');
const server = express();
const Sequelize = require('sequelize');
const { Console } = require('console');
const db = require('./configuracion.js');
const sequelize = new Sequelize(db.name, db.user, db.pass, { dialect: 'mysql' });
const bodyparser = require('body-parser');
server.use(bodyparser.json());
const semilla = 'proyecto';


server.get('/api/test', (req, res) => {
    return res.json("test");
});





server.get('/api/productos', (req, res) => {
    const query = 'SELECT * FROM PRODUCTOS';
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        .then((response) => {
            return res.json(response);
        }).catch(e => res.status(400).json({ error: 'No se pudieron encontrar los productos' }));
});

server.post('/api/productos', esAdmin, (req, res) => {
    const query = 'INSERT INTO PRODUCTOS VALUES (NULL,?, ?, ?, ?)';
    const { nombre, precio_unitario, url_imagen, descripcion } = req.body;
    sequelize.query(query, { replacements: [nombre, precio_unitario, url_imagen, descripcion] })
        .then((response) => {
            return res.json({ status: 'Producto creado correctamente', productos: req.body });
        }).catch(e => res.status(400).json({ error: 'No se pudo crear el producto' }));
});

server.get('/api/productos/:id_producto', (req, res) => {
    const id = req.params.id_producto;
    const query = 'SELECT * FROM PRODUCTOS WHERE ID_PRODUCTO = ?';
    sequelize.query(query, { replacements: [id], type: sequelize.QueryTypes.SELECT })
        .then(data => {
            return res.json(data);
        }).catch(e => res.status(400).json({ error: 'No se pudo encontrar el producto' }));
});

server.delete('/api/productos/:id_producto', esAdmin, (req, res) => {
    const id = req.params.id_producto;
    const query = 'DELETE FROM PRODUCTOS WHERE ID_PRODUCTO = ?';
    sequelize.query(query, { replacements: [id] })
        .then((data) => {
            return res.json({ status: 'Producto borrado correctamente' });
        }).catch(e => res.status(400).json({ error: 'No se pudo borrar el producto' }));
});

server.put('/api/productos/:id_producto', esAdmin, (req, res) => {
    const id = req.params.id_producto;
    const descripcion = req.body.descripcion;
    const precio_unitario = req.body.precio_unitario;
    const url_imagen = req.body.url_imagen;
    const nombre = req.body.nombre;
    const query = 'UPDATE productos SET descripcion = ?, precio_unitario = ?, url_imagen = ?, nombre = ? WHERE id_producto = ?';
    sequelize.query(query, { replacements: [descripcion, precio_unitario, url_imagen, nombre, id] })
        .then((data) => {
            return res.json({ status: 'Producto actualizado correctamente' });
        }).catch(e => res.status(400).json({ error: 'No se pudo actualizar el producto' }));
});

server.post('/api/usuarios', existeUsuario, (req, res) => {
    const query = 'INSERT INTO USUARIOS VALUES (NULL,?, ?, ?, ?,?,?,?)';
    const { nombre_usuario, nombre_apellido, email, telefono, direccion, password, es_admin } = req.body;
    console.log(req.body.nombre_usuario);
    sequelize.query(query, { replacements: [nombre_usuario, nombre_apellido, email, telefono, direccion, password, es_admin] })
        .then((response) => {
            return res.json({ status: 'Usuario creado correctamente', usuarios: req.body });
        }).catch(e => res.status(400).json({ error: 'No se pudo crear el usuario' }));
});

server.get('/api/usuarios', esAdmin, (req, res) => {
    const query = 'SELECT * FROM USUARIOS';
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        .then((response) => {
            return res.json(response);
            console.log(response);
        }).catch(e => console.error('Algo salio mal', e));
});

server.post("/api/usuarios/login", async (req, res) => {
    const { usuario, contrasenia } = req.body;
    await sequelize
        .query("SELECT * FROM usuarios WHERE email = ? and password = ?  and es_admin = 1", {
            type: sequelize.QueryTypes.SELECT,
            replacements: [usuario, contrasenia],
        })
        .then(async (user) => {
            let usuruario = user[0]
            if (usuruario === undefined) {
                res.status(409).send("Usuario o contraseña incorrectas");
            } else {
                const token = jwt.sign(usuruario, semilla)
                res.status(200).json({ token: token });
            }
        });
});

server.get('/api/usuarios/:id_usuario', esAdmin, (req, res) => {
    const id = req.params.id_usuario;
    const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
    sequelize.query(query, { replacements: [id], type: sequelize.QueryTypes.SELECT })
        .then(data => {
            return res.json(data);
        }).catch(e => res.status(400).json({ error: 'No se pudo encontrar el usuario' }));
});

server.delete('/api/usuarios/:id_usuario', esAdmin, (req, res) => {
    const id = req.params.id_usuario;
    const query = 'DELETE FROM usuarios WHERE ID_usuario = ?';
    sequelize.query(query, { replacements: [id] })
        .then((data) => {
            return res.json({ status: 'Usuario eliminado correctamente' });
        }).catch(e => res.status(400).json({ error: 'No se pudo eliminar al usuario' }));
});

server.put('/api/usuarios/:id_usuario', esAdmin, (req, res) => {
    const id = req.params.id_usuario;
    const nombre_usuario = req.body.nombre_usuario;
    const nombre_apellido = req.body.nombre_apellido;
    const email = req.body.email;
    const telefono = req.body.telefono;
    const direccion = req.body.direccion;
    const password = req.body.password;
    const es_admin = req.body.es_admin;
    const query = 'UPDATE usuarios SET nombre_usuario = ?, nombre_apellido = ?, email = ?, telefono = ?, direccion = ?, password=?, es_admin=? WHERE id_usuario = ?';
    sequelize.query(query, { replacements: [nombre_usuario, nombre_apellido, email, telefono, direccion, password, es_admin, id] })
        .then((data) => {
            return res.json({ status: 'Usuario actualizado correctamente' });
        }).catch(e => res.status(400).json({ error: 'No se pudo actualizar el usuario' }));
});


server.get('/api/pedidos', esAdmin, (req, res) => {
    const query = 'SELECT * FROM PEDIDOS';
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        .then((response) => {
            return res.json(response);
        }).catch(e => res.status(400).json({ error: 'No se encontraron los pedidos' }));
});

server.post('/api/pedidos', (req, res) => {
    const query = 'INSERT INTO pedidos VALUES (NULL,?, ?, ?, ?,?, ?)';
    const { estado, hora, descripcion, metodo_pago, id_usuario, total } = req.body;
    sequelize.query(query, { replacements: [estado, hora, descripcion, metodo_pago, id_usuario, total] })
        .then((response) => {
            return res.json({ status: 'Pedido creado correctamente', productos: req.body });
        }).catch(e => res.status(400).json({ error: 'No se pudo crear el pedido' }));
});

server.get('/api/pedidos/:id_pedido', (req, res) => {
    const id = req.params.id_pedido;
    const query = 'SELECT * FROM pedidos WHERE id_pedido = ?';
    sequelize.query(query, { replacements: [id], type: sequelize.QueryTypes.SELECT })
        .then(data => {
            return res.json(data);
        }).catch(e => res.status(400).json({ error: 'No se pudo encontrar el pedido' }));
});

server.delete('/api/pedidos/:id_pedido', esAdmin, (req, res) => {
    const id = req.params.id_pedido;
    const query = 'DELETE FROM pedidos WHERE id_pedido = ?';
    sequelize.query(query, { replacements: [id] })
        .then((data) => {
            return res.json({ status: 'Pedido borrado correctamente' });
        }).catch(e => res.status(400).json({ error: 'No se pudo borrar el pedido' }));
});

server.put('/api/pedidos/:id_pedido', esAdmin, (req, res) => {
    const id = req.params.id_pedido;
    const estado = req.body.estado;
    const hora = req.body.hora;
    const descripcion = req.body.descripcion;
    const metodo_pago = req.body.metodo_pago;
    const id_usuario = req.body.id_usuario;
    const total = req.body.total;
    const query = 'UPDATE pedidos SET estado = ?, hora = ?, descripcion = ?, metodo_pago = ?, id_usuario = ?, total = ? WHERE id_pedido = ?';
    sequelize.query(query, { replacements: [estado, hora, descripcion, metodo_pago, id_usuario, total, id] })
        .then((data) => {
            return res.json({ status: 'Pedido actualizado correctamente' });
        }).catch(e => res.status(400).json({ error: 'No se pudo actualizar el pedido' }));
});

server.post('/api/detalles', esAdmin, (req, res) => {
    const query = 'INSERT INTO detalle_pedido VALUES (?, ?, ?)';
    const { id_producto, id_pedido, cantidad_producto } = req.body;
    sequelize.query(query, { replacements: [id_producto, id_pedido, cantidad_producto] })
        .then((response) => {
            return res.json({ status: 'Detalle creado correctamente', detalle_pedido: req.body });
        }).catch(e => res.status(400).json({ error: 'No se pudo crear el detalle' }));
});

function existeUsuario(req, res, next) {
    const { usuario } = req.body;
    sequelize
        .query("SELECT * FROM usuarios WHERE nombre_usuario = ? ", {
            type: sequelize.QueryTypes.SELECT,
            replacements: [usuario],
        })
        .then((user) => {
            if (user.nombre_usuario !== usuario) {
                next();
            } else {
                res.status(409).send("El usuario ya existe");
            }
        });
}

function esAdmin(req, res, next) {
    const autorizacion = req.headers['authorization'];
    const token = autorizacion && autorizacion.split(' ')[1];
    if (token == null) return res.status(401).json("Accceso denegado");
    jwt.verify(token, semilla, (err, usuario) => {
        if (err) {
            return res.status(403).json("Accceso denegado");
        }
        console.log(usuario)
        sequelize
            .query("SELECT * FROM usuarios WHERE id_usuario = ?  ", {
                type: sequelize.QueryTypes.SELECT,
                replacements: [usuario.id_usuario],
            })
            .then((user) => {
                if (user[0].es_admin === 1) {
                    next();
                } else {
                    res.status(403).send("No tienes los privilegios suficientes");
                }
            });
    })
}

server.listen(8080, () => console.log("aplicación corriendo en http://localhost:8080"));