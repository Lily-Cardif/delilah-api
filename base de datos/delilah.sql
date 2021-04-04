CREATE DATABASE delilah;

CREATE TABLE pedidos(
id_pedido INT PRIMARY KEY AUTO_INCREMENT,
estado VARCHAR(20) NOT NULL,
hora DATETIME NOT NULL,
descripcion VARCHAR(150) NOT NULL,
metodo_pago VARCHAR(20) NOT NULL,
id_usuario INT NOT NULL,
total FLOAT NOT NULL);

CREATE TABLE usuarios (
id_usuario INT PRIMARY KEY AUTO_INCREMENT,
nombre_usuario VARCHAR(50) NOT NULL,
nombre_apellido VARCHAR(60) NOT NULL,
email VARCHAR(60) NOT NULL,
telefono INT NOT NULL,
direccion VARCHAR(60) NOT NULL,
password VARCHAR(20) NOT NULL,
es_admin BOOLEAN DEFAULT FALSE);

CREATE TABLE productos (
id_producto INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(20) NOT NULL,
precio_unitario FLOAT NOT NULL,
url_imagen VARCHAR(60) NOT NULL,
descripcion VARCHAR(150) NOT NULL);

CREATE TABLE detalle_pedido(
id_producto INT,
id_pedido INT,
cantidad_producto INT NOT NULL DEFAULT 1,
PRIMARY KEY(id_producto, id_pedido));

ALTER TABLE pedidos ADD FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario);
ALTER TABLE detalle_pedido ADD FOREIGN KEY (id_producto) REFERENCES productos(id_producto);
ALTER TABLE detalle_pedido ADD FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido); 

INSERT INTO usuarios VALUES (NULL, 'Liliana', 'Esparza', 'lilianaes.cardif@gmail.com', 12121212, 'Avenida central 408', '12345678', true);
INSERT INTO usuarios VALUES (NULL, 'Brenda', 'Martinez', 'brenda.martinez@gmail.com', 13131313, 'Avenida Hidalgo 101', '12345678', false);
INSERT INTO usuarios VALUES (NULL, 'Sergio', 'Lopez', 'sergio.lopez@gmail.com', 14141414, 'Avenida Revolucion 94', '12345678', false);

INSERT INTO productos VALUES(NULL,'Quilaquiles', 80,'https://via.placeholder.com/400','Chilaquiles verdes con pollo');
INSERT INTO productos VALUES(NULL,'Enchiladas', 70,'https://via.placeholder.com/400','Enchiladas verdes con pollo');
INSERT INTO productos VALUES(NULL,'Enfrijoladas', 50,'https://via.placeholder.com/400','Enfrijoladas con crema y queso');

INSERT INTO pedidos VALUES (NULL, 'ENVIADO', NOW(), 'Quilaquiles','Efectivo', 1, 80);
INSERT INTO pedidos VALUES (NULL, 'NUEVO', NOW(), 'Enchiladas x2', 'Tarjeta', 2, 140);
INSERT INTO pedidos VALUES (NULL, 'NUEVO', NOW(), 'Enfrijoladas x4', 'Efectivo', 2, 200);

INSERT INTO detalle_pedido VALUES(1, 1, 1);
INSERT INTO detalle_pedido VALUES(2, 2, 2);
INSERT INTO detalle_pedido VALUES(3, 3, 4);