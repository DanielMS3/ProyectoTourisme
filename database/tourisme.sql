create database Tourisme;
use Tourisme;

 -- TABLA DE ROLES (usuario, proveedor turistico, administrador unico) -- 
create table Rol(
id_rol int primary key auto_increment,
nombre varchar(100) unique not null
);


-- TABLA DE USUARIOS  --
create table Usuario(
id_usuario int primary key auto_increment,
nombre varchar(100) not null,
fecha_registro timestamp default current_timestamp,
id_rol int not null default 1, -- 1 = usuario, 2 = proveedor, 3 = administrador unico --
foreign key(id_rol) references Rol (id_rol) on delete cascade
);


-- TABAL DE AUTENTICACIÓN (Para el registro de los usuarios) --
create table autenticacion(
id_autenticacion int primary key auto_increment,
id_usuario int not null,
correo varchar(100) not null,
contrasena_hash varchar(100),
fecha_nacimiento date,
genero enum('Masculino', 'Femenino', 'Otro'),
nacionalidad varchar(100),
id_google varchar(100) unique,
tipo_autenticacion enum ('normal', 'google') not null,
foreign key (id_usuario) references Usuario (id_usuario) on delete cascade
);


-- TABLA DE RECUPERACIÓN DE CONTRASEÑA (Tokens) --
create table Token_Recuperacion(
id_token int primary key auto_increment,
id_usuario int,
token varchar(100) unique not null,
fecha_expiracion datetime not null,
foreign key (id_usuario) references Usuario(id_usuario) on delete cascade
);


-- TABLA DE CATEGORIAS TURISTICAS --
create table Categoria_Turistica(
id_categoria int primary key auto_increment,
nombre varchar(100) unique not null,
descripcion text
);


-- TABLA DE DESTINOS TURISTICOS --
create table Destinos_Turisticos(
id_destino int primary key auto_increment,
id_categoria int not null,
nombre varchar(100) not null,
descripcion text, 
ciudad varchar(100) not null,
direccion varchar(100) not null, 
foreign key (id_categoria) references Categoria_Turistica(id_categoria) on delete cascade
);


-- TABLA DE EMPRESAS (Negocios, restaurantes, atracciones) --
create table Empresa(
id_empresa int primary key auto_increment,
id_usuario int not null, 
id_destino int not null,
nombre varchar(100) not null,
descripcion text,
tipo enum('Restaurante', 'Atracción', 'Otro') not null,
horario_apertura time,
horario_cierre time,
telefono varchar(20),
foreign key(id_usuario) references Usuario(id_usuario) on delete cascade,
foreign key(id_destino) references Destinos_Turisticos(id_destino) on delete cascade
);


-- TABLA DE PRODUCTOS O SERVIOS DENTRO DE LA EMPRESA --
create table Producto_Servicio(
id_producto int primary key auto_increment,
id_empresa int not null,
nombre varchar(100) not null,
descripcion text,
precio decimal(10,2) not null,
foreign key(id_empresa) references Empresa(id_empresa) on delete cascade
);


-- TABLA DE RESERVAS --
create table Reserva(
id_reserva int primary key auto_increment,
id_usuario int not null,
id_destino int not null,
id_empresa int not null,
fecha_reserva time not null,
hora_reserva time not null,
cantidad int not null,
estado enum('Pendiente', 'Confirmada', 'Cancelada') default 'Pendiente',
foreign key(id_usuario) references Usuario(id_usuario) on delete cascade,
foreign key(id_destino) references Destinos_Turisticos(id_destino) on delete cascade,
foreign key(id_empresa) references Empresa(id_empresa) on delete cascade
);


-- TABLA DE DETALLE DE LA RESERVA --
create table Detalle_Reserva(
id_detalle_reserva int primary key auto_increment,
id_reserva int not null,
id_producto int not null,
cantidad int not null,
precio_unitario decimal(10,2) not null,
foreign key(id_reserva) references Reserva(id_reserva) on delete cascade,
foreign key(id_producto) references Producto_Servicio(id_producto) on delete cascade
);


-- TABLA DE METODO DE PAGO --
create table Metodo_Pago(
id_metodo int primary key auto_increment,
metodo varchar(100) unique not null -- Tarjeta, Transferenica, Pse, etc. --
);


-- TABLA DE PAGOS --
create table Pago(
id_pago int primary key auto_increment,
id_usuario int not null,
id_reserva int not null,
id_metodo int not null,
monto_total decimal (10,2) not null,
estado enum ('Pendiente', 'Completado', 'Fallido', 'Reembolsado') default 'Pendiente',
fecha_pago timestamp default current_timestamp,
foreign key(id_usuario) references Usuario(id_usuario) on delete cascade,
foreign key(id_reserva) references Reserva(id_reserva) on delete cascade,
foreign key(id_metodo) references Metodo_Pago(id_metodo) on delete cascade
);


-- TABLA DE CALIFICACION DE DESTINOS --
create table Calificacion_Destino(
id_calificacion int primary key auto_increment,
id_usuario int not null,
id_destino int not null,
calificacion tinyint not null check (calificacion between 1 and 5),
comentario text,
fecha timestamp default current_timestamp,
foreign key (id_usuario) references Usuario(id_usuario) on delete cascade,
foreign key(id_destino) references Destinos_Turisticos(id_destino) on delete cascade
);


-- TABLAS DE RESEÑAS DE LAS EMPRESAS --
create table Resena_Empresa(
id_resena int primary key auto_increment,
id_usuario int not null,
id_empresa int not null,
comentario text,
calificacion tinyint not null check (calificacion between 5 and 1),
fecha timestamp default current_timestamp,
foreign key(id_usuario) references Usuario(id_usuario) on delete cascade,
foreign key(id_empresa) references Empresa(id_empresa) on delete cascade
);


-- TABLA PARA AUDITORIAS DE CAMBIOS IMPORTANTES (Rol administrador) --
create table Bitacora_Auditoria(
id_bitacora int primary key auto_increment,
id_usuario int not null,
accion varchar(100) not null,
fecha timestamp default current_timestamp,
foreign key(id_usuario) references Usuario(id_usuario) on delete cascade
);



-- SEGURIDAD PARA LA BASE DE DATOS --

-- CREACIÓN DE USUARIOS (Roles) --
create user 'admin'@'localhost' identified by 'admin_password';
create user 'proveedor'@'localhost' identified by 'proveedor_password';
create user 'usuario'@'localhost' identified by 'usuario_password';


-- ASIGNACIÓN DE PERMISOS A CADA ROL --
-- ROL ADMIN: ACCESO TOTAL --
grant all privileges on tourisme.* to 'admin'@'localhost';

-- ROL PROVEEDOR: ACCESO A EMPRESA Y PRODUCTOS --
grant select, insert, update on tourisme.Empresa to 'proveedor'@'localhost';
grant select, insert, update on tourisme.Producto_Servicio to 'proveedor'@'localhost';
grant select on tourisme.Reserva to 'proveedor'@'localhost';
grant select on tourisme.pago to 'proveedor'@'localhost';

-- ROL USUARIO NORMAL: ACCESO A: 
-- Inicio de sesión y registrarse --
grant insert on tourisme.autenticacion to 'usuario'@'localhost';
grant insert on tourisme.usuario to 'usuario'@'localhost';
grant select on tourisme.reserva to 'usuario'@'localhost';

-- Recuperar contraseña --
grant insert on tourisme.token_recuperacion to 'usuario'@'localhost';

-- Explorar categorias y destinos --
grant select on tourisme.categoria_turistica to 'usuario'@'localhost';
grant select on tourisme.destinos_turisticos to 'usuario'@'localhost';

-- Visualizar productos y servicios de empresas --
grant select on tourisme.producto_servicio to 'usuario'@'localhost';

-- Visualizar reseñas de otros usuarios sobre las empresas --
grant select on tourisme.resena_empresa to 'usuario'@'localhost';

-- Realizar una reseña --
grant insert on tourisme.reserva to 'usuario'@'localhost';

-- Calificar destinos turisticos -- 
grant insert on tourisme.calificacion_destino to 'usuario'@'localhost';

-- Dejar una reseña a una empresa --
grant insert on tourisme.resena_empresa to 'usuario'@'localhost';

-- Realizar pagos --
grant insert on tourisme.pago to 'usuario'@'localhost';

-- Visualizar pagos realizados --
grant select on tourisme.pago to 'usuario'@'localhost';


-- PROCEDIMIENTOS ALMACENADOS TABLA USUARIO --
-- INSERTAR USUARIO --
DELIMITER //
create procedure insertat_usuario(
	in p_nombre varchar(100),
    in p_correo varchar(100),
    in p_fecha_nacimiento date,
    in p_genero enum('Masculino', 'Femenino', 'Otro'),
    in p_nacionalidad varchar(50),
    in p_contrasena_hash varchar(100),
    in p_id_google varchar(100),
    in p_id_rol int
)
begin
	insert into Usuario(nombre, correo, fecha_nacimiento, genero, nacionalidad, contrasena_hash, id_google, id_rol)
    values (p_nombre, p_correo, p_fecha_nacimiento, p_genero, p_nacionalidad, p_contrasena_hash, p_id_google, p_id_rol);
end //
DELIMITER ;

-- CONSULTAR USUARIO POR ID --
DELIMITER //
create procedure consultar_usuario_id(
	in p_id_usuario int
)
begin
	select * from Usuario where id_usuario = p_id_usuario;
end //
DELIMITER ;

-- CONSULTAR USUARIO EN GENERAL --
DELIMITER //
create procedure consultar_usuarios()
begin
	select * from Usuario;
end //
DELIMITER ;

-- ACTUALIZAR USUARIO --
DELIMITER //
create procedure actualizar_usuario(
	in p_id_usuario int,
    in p_nombre varchar(100),
    in p_correo varchar(100),
    in p_fecha_nacimiento date,
    in p_genero enum('Masculino', 'Femenino', 'Otro'),
    in p_nacionalidad varchar(50),
    in p_contrasena_hash varchar(100),
    in p_id_google varchar(100),
    in p_id_rol int
)
begin 
	update Usuario
    set nombre = p_nombre,
        correo = p_correo,
        fecha_nacimiento = p_fecha_nacimiento,
        genero = p_genero,
        nacionalidad = p_nacionalidad,
        contrasena_hash = p_contrasena_hash,
        id_google = p_id_google,
        id_rol = p_id_rol
	where id_usuario = p_id_usuario;
end// 
DELIMITER ;

-- ELIMINAR USUARIO --
DELIMITER //
create procedure eliminar_usuario(
	in p_id_usuario int
)
begin
	delete from Usuario where id_usuario = p_id_usuario;
end //
DELIMITER ;


-- PROCEDIMIENTOS ALMACENADOS TABLA ROL --
-- INSERTAR ROL --
DELIMITER //
create procedure insertar_rol (
	in p_nombre varchar(100)
)
begin
	insert into Rol (nombre) values (p_nombre);
end //
DELIMITER ;

-- 	CONSULTAR ROL POR ID --
DELIMITER //
create procedure consultar_rol_id(
	in p_id_rol int
)
begin 
	select * from Rol where id_rol = p_id_rol;
end //
DELIMITER ;

-- CONSULTAR ROL EN GENERAL--
DELIMITER //
create procedure consultar_roles()
begin
	select * from Rol;
end //
DELIMITER ;

-- ACTUALIZAR ROL --
DELIMITER //
create procedure actualizar_rol(
	in p_id_rol int, 
    in p_nombre varchar(100)
)
begin
	update Rol 
	set nombre = p_nombre
    where id_rol = p_id_rol;
end //
DELIMITER ;

-- ELIMINAR ROL --
DELIMITER //
create procedure eliminar_rol(
 in p_id_rol int
)
begin
	delete from Rol where id_rol = p_id_rol;
end //
DELIMITER ;


-- PROCEDIMIENTOS ALMACENADOS TABLA DESTINO TURISTICO --
-- INSERTAR DESTINO --
DELIMITER //
create procedure insertar_destino(
	in p_id_categoria int,
    in p_nombre varchar (100),
    in p_descripcion text,
    in p_ciudad varchar(100),
    in p_direccion varchar(100)
)
begin
	insert into Destinos_Turisticos(id_categoria, nombre, descripcion, ciudad, direccion)
    values(p_id_categoria,p_nombre, p_descripcion, p_ciudad, p_direccion);
end //
DELIMITER ;

-- CONSULTAR DESTINO POR ID --
DELIMITER //
create procedure consultar_destino_id(
	in p_id_destino int
)
begin
	select * from Destinos_Turisticos where id_destino = p_id_destino;
end //
DELIMITER ;

-- CONSULTAR DESTINO EN GENERAL --
DELIMITER //
create procedure consultar_destinos()
begin
	select * from  Destinos_Turisticos;
end //
DELIMITER ;

-- ACTUALIZAR DESTINO --
DELIMITER //
create procedure actualizar_destino(
	in p_id_destino int,
    in p_id_categoria int,
    in p_nombre varchar(100),
    in p_descripcion text,
    in p_ciudad varchar(100),
    in p_direccion varchar(100)
)
begin
	update Destinos_Turisticos
    set id_categoria = p_id_destino, nombre = p_nombre, descripcion = p_descripcion,
		ciudad = p_ciudad, direccion = p_direccion
	where id_destino = p_id_destino;
end //
DELIMITER ;

-- ELIMINAR DESTINO --
DELIMITER //
create procedure eliminar_destino (
	in p_id_destino int
)
begin
	delete from Destinos_Turisticos where id_destino = p_id_destino;
end //
DELIMITER ;


-- PROCEDIMIENTOS ALMACENADOS TABLA EMPRESA --
-- INSERTAR EMPRESA --
DELIMITER //
create procedure insertar_empresa(
    in p_id_usuario int,
    in p_id_destino int,
    in p_nombre varchar(100),
    in p_descripcion text,
    in p_tipo enum('restaurante', 'atraccion', 'otro'),
    in p_horario_apertura time,
    in p_horario_cierre time,
    in p_telefono varchar(20)
)
begin
    insert into Empresa (id_usuario, id_destino, nombre, descripcion, tipo, horario_apertura, horario_cierre, telefono)
    values (p_id_usuario, p_id_destino, p_nombre, p_descripcion, p_tipo, p_horario_apertura, p_horario_cierre, p_telefono);
end //
DELIMITER ;

-- CONSULTAR EMPRESA POR ID --
DELIMITER //
create procedure consultar_empresa_id(
	in p_id_empresa int
)
begin
    select * from Empresa where id_empresa = p_id_empresa;
end //
DELIMITER ;

-- CONSULTAR EMPRESA EN GENERAL --
DELIMITER //
create procedure consultar_empresas()
begin
    select * from Empresa;
end //
DELIMITER ;

-- ACTUALIZAR EMPRESA --
DELIMITER //
create procedure actualizar_empresa(
    in p_id_empresa int,
    in p_id_usuario int,
    in p_id_destino int,
    in p_nombre varchar(100),
    in p_descripcion text,
    in p_tipo enum('restaurante', 'atraccion', 'otro'),
    in p_horario_apertura time,
    in p_horario_cierre time,
    in p_telefono varchar(20)
)
begin
    update Empresa
    set id_usuario = p_id_usuario,
        id_destino = p_id_destino,
        nombre = p_nombre,
        descripcion = p_descripcion,
        tipo = p_tipo,
        horario_apertura = p_horario_apertura,
        horario_cierre = p_horario_cierre,
        telefono = p_telefono
    where id_empresa = p_id_empresa;
end //
DELIMITER ;

-- ELIMINAR EMPRESA --
DELIMITER //
create procedure eliminar_empresa(
	in p_id_empresa int
)
begin
    delete from Empresa where id_empresa = p_id_empresa;
end //
DELIMITER ;


-- PROCEDIMIENTOS ALMACENADOS TABLA PRODUCTO SERVICIO --
-- INSERTAR  --
DELIMITER //
create procedure insertar_producto_servicio(
    in p_id_empresa int,
    in p_nombre varchar(100),
    in p_descripcion text,
    in p_precio decimal(10,2)
)
begin
    insert into Producto_Servicio (id_empresa, nombre, descripcion, precio)
    values (p_id_empresa, p_nombre, p_descripcion, p_precio);
end //
DELIMITER ;

-- CONSULTAR PRODUCTO SERVICIO POR ID --
DELIMITER //
create procedure consultar_producto_id(
	in p_id_producto int
)
begin
    select * from Producto_Servicio where id_producto = p_id_producto;
end //
DELIMITER ;

-- CONSULTAR PRODUCTO SERVICIO EN GENERAL --
DELIMITER //
create procedure consultar_productos()
begin
    select * from Producto_Servicio;
end //
DELIMITER ;

-- ACTUALIZAR PRODUCTO SERVICIO --
DELIMITER //
create procedure actualizar_producto_servicio(
    in p_id_producto int,
    in p_id_empresa int,
    in p_nombre varchar(100),
    in p_descripcion text,
    in p_precio decimal(10,2)
)
begin
    update Producto_Servicio
    set id_empresa = p_id_empresa,
        nombre = p_nombre,
        descripcion = p_descripcion,
        precio = p_precio
    where id_producto = p_id_producto;
end //
DELIMITER ;

-- ELIMINAR PRODUCTO SERVICIO --
DELIMITER //
create procedure eliminar_producto_servicio(
	in p_id_producto int
)
begin
    delete from Producto_Servicio where id_producto = p_id_producto;
end //
DELIMITER ;


-- PROCEDIMIENTOS ALMACENADOS TABLA RESERVA --
-- INSERTAR RESERVA --
DELIMITER //
create procedure insertar_reserva(
    in p_id_usuario int,
    in p_id_destino int,
    in p_id_empresa int,
    in p_fecha_reserva date,
    in p_hora_reserva time,
    in p_cantidad int,
    in p_estado enum('pendiente', 'confirmada', 'cancelada')
)
begin
    insert into Reserva (id_usuario, id_destino, id_empresa, fecha_reserva, hora_reserva, cantidad, estado)
    values (p_id_usuario, p_id_destino, p_id_empresa, p_fecha_reserva, p_hora_reserva, p_cantidad, p_estado);
end //
DELIMITER ;

-- CONSULTAR RESERVA POR ID --
DELIMITER //
create procedure consultar_reserva_id(
	in p_id_reserva int
)
begin
    select * from Reserva where id_reserva = p_id_reserva;
end //
DELIMITER ;

-- CONSULTAR RESERVA EN GENERAL --
DELIMITER //
create procedure consultar_reservas()
begin
    select * from Reserva;
end //
DELIMITER ;

-- ACTUALIZAR RESERVA --
DELIMITER //
create procedure actualizar_reserva(
    in p_id_reserva int,
    in p_estado enum('pendiente', 'confirmada', 'cancelada')
)
begin
    update Reserva
    set estado = p_estado
    where id_reserva = p_id_reserva;
end //
DELIMITER ;

-- ELIMINAR RESERVA --
DELIMITER //
create procedure eliminar_reserva(
	in p_id_reserva int
)
begin
    delete from Reserva where id_reserva = p_id_reserva;
end //
DELIMITER ;


-- PROCEDIMIENTOS ALMACENADOS TABLA DETALLE RESERVA --
-- INSERTAR DETALLE_RESERVA --
DELIMITER //
create procedure insertar_detalle_reserva(
    in p_id_reserva int,
    in p_id_producto int,
    in p_cantidad int,
    in p_precio_unitario decimal(10,2)
)
begin
    insert into Detalle_Reserva (id_reserva, id_producto, cantidad, precio_unitario)
    values (p_id_reserva, p_id_producto, p_cantidad, p_precio_unitario);
end //
DELIMITER ;

-- CONSULTAR DETALLE RESERVA POR ID --
DELIMITER //
create procedure consultar_detalle_reserva_id(
	in p_id_detalle int
)
begin
    select * from Detalle_Reserva where id_detalle = p_id_detalle;
end //
DELIMITER ;

-- CONSULTAR DETALLE RESERVA EN GENERAL --
DELIMITER //
create procedure consultar_detalles_reservas()
begin
    select * from Detalle_Reserva;
end //
DELIMITER ;

-- ACTUALIZAR DETALLE RESERVA --
DELIMITER //
create procedure actualizar_detalle_reserva(
    in p_id_detalle int,
    in p_cantidad int,
    in p_precio_unitario decimal(10,2)
)
begin
    update Detalle_Reserva
    set cantidad = p_cantidad,
        precio_unitario = p_precio_unitario
    where id_detalle = p_id_detalle;
end //
DELIMITER ;

-- ELIMINAR DETALLE RESERVA --
DELIMITER //
create procedure eliminar_detalle_reserva(
	in p_id_detalle int
)
begin
    delete from Detalle_Reserva where id_detalle = p_id_detalle;
end //
DELIMITER ;


-- PROCEDIMIENTOS ALMACENADOS TABLA METODO PAGO --
-- INSERTAR METODO PAGO --
DELIMITER //
create procedure insertar_metodo_pago(
	in p_metodo varchar(50)
)
begin
    insert into Metodo_Pago (metodo) 
    values (p_metodo);
end //
DELIMITER ;

-- CONSULTAR METODO PAGO POR ID --
DELIMITER //
create procedure consultar_metodo_pago_id(
	in p_id_metodo int
)
begin
    select * from Metodo_Pago where id_metodo = p_id_metodo;
end //
DELIMITER ;

-- CONSULTAR METODO PAGO EN GENERAL --
DELIMITER //
create procedure consultar_metodos_pago()
begin
    select * from Metodo_Pago;
end //
DELIMITER ;

-- ACTUALIZAR METODO PAGO --
DELIMITER //
create procedure actualizar_metodo_pago(
	in p_id_metodo int, in p_metodo varchar(50)
)
begin
    update Metodo_Pago 
    set metodo = p_metodo 
    where id_metodo = p_id_metodo;
end //
DELIMITER ;

-- ELIMINAR METODO PAGO --
DELIMITER //
create procedure eliminar_metodo_pago(
	in p_id_metodo int
)
begin
    delete from Metodo_Pago where id_metodo = p_id_metodo;
end //
DELIMITER ;



-- PROCEDIMIENTOS ALMACENADOS TABLA PAGO --
-- INSERTAR PAGO --
DELIMITER //
create procedure insertar_pago(
    in p_id_reserva int,
    in p_id_metodo int,
    in p_monto_total decimal(10,2),
    in p_estado enum('pendiente', 'completado', 'fallido', 'reembolsado')
)
begin
    insert into Pago (id_reserva, id_metodo, monto_total, estado)
    values (p_id_reserva, p_id_metodo, p_monto_total, p_estado);
end //
DELIMITER ;

-- CONSULTAR PAGO POR ID --
DELIMITER //
create procedure consultar_pago_id(
	in p_id_pago int
)
begin
    select * from Pago where id_pago = p_id_pago;
end //
DELIMITER ;

-- CONSULTAR PAGOS EN GENERAL --
DELIMITER //
create procedure consultar_pagos()
begin
    select * from Pago;
end //
DELIMITER ;

-- ACTUALIZAR PAGO --
DELIMITER //
create procedure actualizar_pago(
    in p_id_pago int,
    in p_estado enum('pendiente', 'completado', 'fallido', 'reembolsado')
)
begin
    update Pago
    set estado = p_estado
    where id_pago = p_id_pago;
end //
DELIMITER ;

-- ELIMINAR PAGO --
DELIMITER //
create procedure eliminar_pago(
	in p_id_pago int
)
begin
    delete from Pago where id_pago = p_id_pago;
end //
DELIMITER ;



-- PROCEDIMIENTOS ALMACENADOS TABLA CALIFICACION DESTINO --
-- INSERTAR CALIFICACIÓN DESTINO --
DELIMITER //
create procedure insertar_calificacion_destino(
    in p_id_usuario int,
    in p_id_destino int,
    in p_calificacion tinyint,
    in p_comentario text
)
begin
    insert into Calificacion_Destino (id_usuario, id_destino, calificacion, comentario)
    values (p_id_usuario, p_id_destino, p_calificacion, p_comentario);
end //
DELIMITER ;


-- CONSULTAR CALIFICACION DESTINO POR ID --
DELIMITER //
create procedure consultar_calificacion_id(
	in p_id_calificacion int
)
begin
    select * from Calificacion_Destino 
    where id_calificacion = p_id_calificacion;
end //
DELIMITER ;

-- CONSULTAR CALIFICACION DESTINO EN GENERAL --
DELIMITER //
create procedure consultar_todas_calificaciones()
begin
    select * from Calificacion_Destino;
end //
DELIMITER ;

-- ACTUALIZAR CALIFICACION DESTINO --
DELIMITER //
create procedure actualizar_calificacion(
    in p_id_calificacion int,
    in p_calificacion tinyint,
    in p_comentario text
)
begin
    update Calificacion_Destino
    set calificacion = p_calificacion,
        comentario = p_comentario
    where id_calificacion = p_id_calificacion;
end //
DELIMITER ;

-- ELIMINAR CALIFICACION DESTINO --
DELIMITER //
create procedure eliminar_calificacion(
	in p_id_calificacion int
)
begin
    delete from Calificacion_Destino where id_calificacion = p_id_calificacion;
end //
DELIMITER ;



-- PROCEDIMIENTOS ALMACENADOS TABLA RESEÑA EMPRESA --
-- INSERTAR RESEÑA EMPRESA --
DELIMITER //
create procedure insertar_resena_empresa(
    in p_id_usuario int,
    in p_id_empresa int,
    in p_comentario text,
    in p_calificacion tinyint
)
begin
    insert into Resena_Empresa (id_usuario, id_empresa, comentario, calificacion)
    values (p_id_usuario, p_id_empresa, p_comentario, p_calificacion);
end //
DELIMITER ;

-- CONSULTAR RESEÑA EMPRESA POR ID --
DELIMITER //
create procedure consultar_resena_id(
	in p_id_resena int
)
begin
    select * from Resena_Empresa where id_resena = p_id_resena;
end //
DELIMITER ;

-- CONSULTAR RESEÑA EMPRESA EN GENERAL --
DELIMITER //
create procedure consultarresenas()
begin
    select * from Resena_Empresa;
end //
DELIMITER ;

-- ACTUALIZAR RESEÑA EMPRESA --
DELIMITER //
create procedure actualizar_resena(
    in p_id_resena int,
    in p_comentario text,
    in p_calificacion tinyint
)
begin
    update Resena_Empresa
    set comentario = p_comentario,
        calificacion = p_calificacion
    where id_resena = p_id_resena;
end //
DELIMITER ;

-- ELIMINAR RESEÑA EMPRESA --
DELIMITER //
create procedure eliminar_resena(
	in p_id_resena int
)
begin
    delete from Resena_Empresa where id_resena = p_id_resena;
end //
DELIMITER ;



-- PROCEDIMIENTOS ALMACENADOS TABLA BITACORA AUDITORIA --
-- INSERTAR  --
DELIMITER //
create procedure insertar_bitacora_auditoria(
    in p_id_usuario int,
    in p_accion varchar(255)
)
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (p_id_usuario, p_accion, current_timestamp());
end //
DELIMITER ;

-- CONSULTAR BITACORA AUDITORIA POR ID --
DELIMITER //
create procedure consultar_bitacora_id(
	in p_id_auditoria int
)
begin
    select * from Bitacora_Auditoria where id_auditoria = p_id_auditoria;
end //
DELIMITER ;

-- CONSULTAR BITACORA AUDITORIA EN GENERAL --
DELIMITER //
create procedure consultar_toda_bitacora()
begin
    select * from Bitacora_Auditoria;
end //
DELIMITER ;

-- ELIMINAR BITACORA AUDITORIA --
DELIMITER //
create procedure eliminar_registro_bitacora(in p_id_auditoria int)
begin
    delete from Bitacora_Auditoria where id_auditoria = p_id_auditoria;
end //
DELIMITER ;



-- TRIGGERS TABLA USUARIO --
DELIMITER //
create trigger tr_insertar_usuario
after insert on Usuario
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'Usuario creado', current_timestamp());
end //

create trigger tr_actualizar_usuario
after update on Usuario
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'Usuario actualizado', current_timestamp());
end //

create trigger tr_eliminar_usuario
after delete on Usuario
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (old.id_usuario, 'Usuario eliminado', current_timestamp());
end //
DELIMITER ;


-- TRIGGERS TABLA ROL --
DELIMITER //
create trigger tr_evitar_cambio_de_rol
before update on Rol
for each row
begin
    if old.nombre = 'administrador' then
        signal sqlstate '45000' set message_text = 'No se puede modificar el rol Administrador';
    end if;
end //
DELIMITER ;

-- TRIGGERS TABLA DESTINO TURISTICO --
DELIMITER //
create trigger tr_insertar_destino
after insert on Destinos_Turisticos
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (null, 'Destino turístico creado', current_timestamp());
end //

create trigger tr_actualizar_destino
after update on Destinos_Turisticos
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (null, 'Destino turístico actualizado', current_timestamp());
end //

create trigger tr_prevenir_eliminar_destino
before delete on Destinos_Turisticos
for each row
begin
    if (select count(*) from Reserva where id_destino = old.id_destino) > 0 then
        signal sqlstate '45000' set message_text = 'No se puede eliminar el destino porque tiene reservas asociadas';
    end if;
end //
DELIMITER ;

-- TRIGGERS TABLA EMPRESA --
DELIMITER //
create trigger tr_insertar_empresa
after insert on Empresa
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'Empresa creada', current_timestamp());
end //

create trigger tr_eliminar_empresa
before delete on Empresa
for each row
begin
    delete from Producto_Servicio where id_empresa = old.id_empresa;
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (old.id_usuario, 'Empresa eliminada junto con sus productos', current_timestamp());
end //
DELIMITER ;

-- TRIGGERS TABLA PRODUCTO SERVICIO --
DELIMITER //
create trigger tr_insertar_producto
after insert on Producto_Servicio
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (null, 'Producto/Servicio agregado', current_timestamp());
end //

create trigger tr_actualizar_producto
after update on Producto_Servicio
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (null, 'Producto/Servicio actualizado', current_timestamp());
end //

create trigger tr_eliminar_producto
after delete on Producto_Servicio
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (null, 'Producto/Servicio eliminado', current_timestamp());
end //
DELIMITER ;

-- TRIGGERS TABLA RESERVA --
DELIMITER //
create trigger tr_insertar_reserva
after insert on Reserva
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'Reserva creada', current_timestamp());
end //

create trigger tr_eliminar_reserva
after delete on Reserva
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (old.id_usuario, 'Reserva cancelada', current_timestamp());
end //

DELIMITER ;

-- TRIGGERS TABLA DETALLE RESERVA --
DELIMITER //
create trigger tr_insertar_detalle_reserva
after insert on Detalle_Reserva
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (null, 'Detalle de reserva agregado', current_timestamp());
end //
DELIMITER ;

-- TRIGGERS TABLA PAGO --
DELIMITER //
create trigger tr_insertar_pago
after insert on Pago
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'Pago realizado', current_timestamp());
end //

create trigger tr_prevenir_modificar_pago
before update on Pago
for each row
begin
    if old.estado = 'completado' then
        signal sqlstate '45000' set message_text = 'No se puede modificar un pago que ya ha sido completado';
    end if;
end //
DELIMITER ;

-- TRIGGERS TABLA CALIFICAICÓN DESTINO --
DELIMITER //
create trigger tr_insertar_calificacion
after insert on Calificacion_Destino
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'Calificación de destino creada', current_timestamp());
end //

create trigger tr_prevenir_modificacion_calificacion
before update on Calificacion_Destino
for each row
begin
    signal sqlstate '45000' set message_text = 'No se puede modificar una calificación de destino';
end //
DELIMITER ;

-- TRIGGERS TABLA RESEÑA EMPRESA --
DELIMITER //
create trigger tr_insertar_resena
after insert on Resena_Empresa
for each row
begin
    insert into Bitacora_Auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'Reseña de empresa creada', current_timestamp());
end //

create trigger tr_prevenir_modificar_resena
before update on Resena_Empresa
for each row
begin
    signal sqlstate '45000' set message_text = 'No se puede modificar una reseña de empresa';
end //
DELIMITER ;