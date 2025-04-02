create database tourisme_db;
use tourisme_db;

-- TABLA DE ROLES (usuario, proveedor turistico, administrador unico) -- 
create table rol(
id_rol int primary key auto_increment,
nombre varchar(100) unique not null,
CONSTRAINT chk_nombre_rol CHECK (nombre IN ('usuario', 'negocio', 'administrador'))
);

-- TABLA DE USUARIOS  --
create table usuario(
id_usuario int primary key auto_increment,
nombre varchar(100) not null,
fecha_registro timestamp default current_timestamp,
id_rol int not null default 1, -- 1 = usuario, 2 = proveedor, 3 = administrador unico --
foreign key(id_rol) references rol (id_rol) on delete cascade
);

-- MODIFICACIONES TABLA USUARIO
alter table usuario
add column id_autenticacion int unique not null,
add constraint fk_usuario_autenticacion foreign key (id_autenticacion) 
references autenticacion (id_autenticacion) on delete cascade;

alter table usuario drop foreign key fk_usuario_autenticacion;

alter table usuario drop column id_autenticacion;



-- TABLA DE AUTENTICACIÓN (Para el registro de los usuarios) --
create table autenticacion(
id_autenticacion int primary key auto_increment,
id_usuario int not null,
correo varchar(100) not null,
contrasena_hash varchar(255) not null,
fecha_nacimiento date,
genero enum('masculino', 'femenino', 'otro'),
nacionalidad varchar(100),
id_google varchar(100) null,
tipo_autenticacion enum ('normal', 'google') not null,
foreign key (id_usuario) references usuario (id_usuario) on delete cascade
);

-- MODIFICACIONES TABLA AUTENTICACIÓN
alter table autenticacion add constraint unique_correo unique (correo);

alter table autenticacion drop index unique_correo;
alter table autenticacion drop check chk_tipo_autenticacion;

show indexes from autenticacion;

alter table autenticacion drop index correo_2;
alter table autenticacion drop index id_google_2;

select constraint_name 
from information_schema.table_constraints 
where table_name = 'autenticacion' and constraint_type = 'CHECK';

alter table autenticacion drop check chk_tipo_autenticacion;

alter table autenticacion 
modify correo varchar(255) unique not null, 
modify contrasena_hash varchar(255) null, 
modify id_google varchar(255) unique null, 
add constraint chk_tipo_autenticacion check (
    (tipo_autenticacion = 'normal' and contrasena_hash is not null and id_google is null) or
    (tipo_autenticacion = 'google' and contrasena_hash is null and id_google is not null)
);

alter table autenticacion
add constraint fk_autenticacion_usuario 
foreign key (id_usuario) references usuario (id_usuario) on delete cascade;

desc autenticacion;

SHOW COLUMNS FROM autenticacion LIKE 'id_usuario';

alter table autenticacion
modify id_usuario int unique not null;

select constraint_name 
from information_schema.key_column_usage 
where table_name = 'autenticacion' 
and column_name = 'id_usuario';

alter table autenticacion drop foreign key fk_autenticacion_usuario;



-- TABLA DE RECUPERACIÓN DE CONTRASEÑA (Tokens) --
create table token_recuperacion(
id_token int primary key auto_increment,
id_usuario int,
token varchar(100) unique not null,
fecha_expiracion timestamp not null,
foreign key (id_usuario) references usuario(id_usuario) on delete cascade
);


-- TABLA DE CATEGORIAS TURISTICAS --
create table categoria_turistica(
id_categoria int primary key auto_increment,
nombre varchar(100) unique not null,
descripcion text
);


-- TABLA DE DESTINOS TURISTICOS --
create table destino_turistico(
id_destino int primary key auto_increment,
id_categoria int not null,
nombre varchar(100) not null,
descripcion text, 
ciudad varchar(100) not null,
direccion varchar(100) not null, 
foreign key (id_categoria) references categoria_turistica(id_categoria) on delete cascade
);


-- TABLA DE EMPRESAS (Negocios, restaurantes, atracciones) --
create table empresa(
id_empresa int primary key auto_increment,
id_usuario int not null, 
id_destino int not null,
nombre varchar(100) not null,
descripcion text,
tipo enum('Restaurante', 'Atracción', 'Otro') not null,
horario_apertura timestamp,
horario_cierre timestamp,
telefono varchar(25),
foreign key(id_usuario) references usuario(id_usuario) on delete cascade,
foreign key(id_destino) references destino_turistico(id_destino) on delete cascade
);


-- TABLA DE PRODUCTOS O SERVIOS DENTRO DE LA EMPRESA --
create table producto_servicio(
id_producto int primary key auto_increment,
id_empresa int not null,
nombre varchar(100) not null,
descripcion text,
precio decimal(10,2) not null,
foreign key(id_empresa) references empresa(id_empresa) on delete cascade
);


-- TABLA RESERVA --
create table reserva (
    id_reserva int primary key auto_increment,
    id_usuario int not null,
    id_destino int not null,
    id_empresa int not null,
    fecha_reserva date not null, 
    hora_reserva time not null,
    cantidad int not null check (cantidad > 0), 
    estado enum('pendiente', 'confirmada', 'cancelada') default 'pendiente',
    foreign key (id_usuario) references usuario (id_usuario) on delete cascade,
    foreign key (id_destino) references destino_turistico(id_destino) on delete cascade,
    foreign key (id_empresa) references empresa (id_empresa) on delete cascade
);


-- TABLA DETALLE RESERVA 
create table detalle_reserva (
    id_detalle_reserva int primary key auto_increment,
    id_reserva int not null,
    id_producto int not null,
    cantidad int not null check (cantidad > 0), 
    precio_unitario decimal(10,2) not null check (precio_unitario >= 0), 
    foreign key (id_reserva) references reserva (id_reserva) on delete cascade,
    foreign key (id_producto) references producto_servicio (id_producto) on delete cascade
);


-- TABLA METODO DE PAGO
create table metodo_pago (
    id_metodo int primary key auto_increment,
    metodo varchar(100) unique not null
);


-- TABLA PAGOS
create table pago (
    id_pago int primary key auto_increment,
    id_usuario int not null,
    id_reserva int not null,
    id_metodo int not null,
    monto_total decimal(10,2) not null check (monto_total >= 0), 
    estado enum ('pendiente', 'completado', 'fallido', 'reembolsado') default 'pendiente',
    fecha_pago timestamp default current_timestamp,
    foreign key (id_usuario) references usuario (id_usuario) on delete cascade,
    foreign key (id_reserva) references reserva (id_reserva) on delete cascade,
    foreign key (id_metodo) references metodo_pago (id_metodo) on delete cascade
);


-- TABLA DE CALIFICACION DE DESTINOS --
create table calificacion_destino (
    id_calificacion int primary key auto_increment,
    id_usuario int not null,
    id_destino int not null,
    calificacion tinyint not null check (calificacion between 1 and 5),
    comentario text,
    fecha timestamp default current_timestamp,
    foreign key (id_usuario) references usuario (id_usuario) on delete cascade,
    foreign key (id_destino) references destino_turistico (id_destino) on delete cascade
);


-- TABLAS DE RESEÑAS DE LAS EMPRESAS --
create table resena_empresa (
    id_resena int primary key auto_increment,
    id_usuario int not null,
    id_empresa int not null,
    comentario text,
    calificacion tinyint not null check (calificacion between 1 and 5), 
    fecha timestamp default current_timestamp,
    foreign key (id_usuario) references usuario (id_usuario) on delete cascade,
    foreign key (id_empresa) references empresa (id_empresa) on delete cascade
);


-- TABLA PARA AUDITORIAS DE CAMBIOS IMPORTANTES (Rol administrador) --
create table bitacora_auditoria (
    id_bitacora int primary key auto_increment,
    id_usuario int not null,
    accion varchar(100) not null,
    fecha timestamp default current_timestamp,
    foreign key (id_usuario) references usuario (id_usuario) on delete cascade
);


-- TABLA CONTENIDO --
create table contenido (
    id_contenido int primary key auto_increment,
    titulo varchar(200) not null,
    descripcion text not null,
    imagen varchar(500) not null,
    precio decimal(10,2) not null check (precio >= 0), 
    fecha_creacion timestamp default current_timestamp,
    id_destino int,
    id_empresa int,
    foreign key (id_destino) references destino_turistico (id_destino) on delete cascade,
    foreign key (id_empresa) references empresa (id_empresa) on delete cascade
);


-- TABLA HISTORIAL CONTENIDO
create table historial_contenido (
    id_historial int primary key auto_increment,
    id_contenido int not null,
    titulo_anterior varchar(200),
    descripcion_anterior text,
    precio_anterior decimal(10,2),
    fecha_cambio timestamp default current_timestamp,
    foreign key (id_contenido) references contenido (id_contenido) on delete cascade
);



-- TABLA ELIMINACIONES CONTENIDO
create table eliminaciones_contenido (
    id_eliminacion int primary key auto_increment,
    id_contenido int not null,
    titulo varchar(200),
    descripcion text,
    precio decimal(10,2),
    fecha_eliminacion timestamp default current_timestamp,
    foreign key (id_contenido) references contenido (id_contenido) on delete cascade
);




-- ------------------------------- PROCEDIMIENTOS ALMACENADOS ------------------------------------- --

-- TABLA ROL --
-- CONSULTAR ROL POR ID
DELIMITER //
create procedure consultar_rol_id (
    in p_id_rol int
)
begin 
    select * from rol where id_rol = p_id_rol;
end //
DELIMITER ;


-- CONSULTAR ROL EN GENERAL
DELIMITER //
create procedure consultar_roles()
begin
    select * from rol;
end //
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------- --

-- TABLA USUARIO
-- INSERTAR USUARIO 
DELIMITER //
create procedure insertar_usuario(
    in p_nombre varchar(100),
    in p_id_rol int,
    in p_correo varchar(100),
    in p_contrasena_hash varchar(100),
    in p_fecha_nacimiento date,
    in p_genero enum('masculino', 'femenino', 'otro'),
    in p_nacionalidad varchar(50),
    in p_id_google varchar(100),
    in p_tipo_autenticacion enum('normal','google')
)
begin
    -- asignar rol por defecto si no se proporciona
    if p_id_rol is null then
        set p_id_rol = 1;
    end if;

    -- verificar si el correo ya está registrado en autenticacion
    if (select count(*) from autenticacion where correo = p_correo) > 0 then
        signal sqlstate '45000'
        set message_text = 'error: el correo ya está en uso.';
    end if;

    -- evitar que haya más de un administrador
    if p_id_rol = 3 and (select count(*) from usuario where id_rol = 3) >= 1 then
        signal sqlstate '45000'
        set message_text = 'error: ya existe un administrador registrado.';
    end if;

    -- insertar el usuario en la tabla usuario
    insert into usuario(nombre, id_rol)
    values(p_nombre, p_id_rol);

    -- obtener el id del usuario recién insertado
    set @id_usuario = last_insert_id();

    -- insertar en la tabla autenticacion
    insert into autenticacion(id_usuario, correo, contrasena_hash, fecha_nacimiento, 
                              genero, nacionalidad, id_google, tipo_autenticacion) 
    values (@id_usuario, p_correo, p_contrasena_hash, p_fecha_nacimiento, 
            p_genero, p_nacionalidad, p_id_google, p_tipo_autenticacion);
end //
DELIMITER ;


-- CONSULTAR USUARIO POR ID
DELIMITER //
create procedure consultar_usuario_id(
	in p_id_usuario int
)
begin
	select * from usuario where id_usuario = p_id_usuario;
end //
DELIMITER ;


-- CONSULTAR USUARIO EN GENERAL
DELIMITER //
create procedure consultar_usuarios()
begin
	select * from usuario;
end //
DELIMITER ;


-- ACTUALIZAR USUARIO
DELIMITER //
create procedure actualizar_usuario(
    in p_id_usuario int,
    in p_nombre varchar(100),
    in p_id_rol int,
    in p_correo varchar(100),
    in p_contrasena_hash varchar(100),
    in p_fecha_nacimiento date,
    in p_genero enum('masculino', 'femenino', 'otro'),
    in p_nacionalidad varchar(50),
    in p_id_google varchar(100),
    in p_tipo_autenticacion enum('normal', 'google')
)
begin 
    -- verificar que el usuario exista
    if not exists (select 1 from usuario where id_usuario = p_id_usuario) then
        signal sqlstate '45000'
        set message_text = 'error: el usuario no existe.';
    end if;

    -- verificar que el nuevo correo no esté en uso por otro usuario
    if (select count(*) from autenticacion where correo = p_correo and id_usuario != p_id_usuario) > 0 then
        signal sqlstate '45000'
        set message_text = 'error: el correo ya está en uso por otro usuario.';
    end if;

    -- evitar que haya más de un administrador
    if p_id_rol = 3 and (select count(*) from usuario where id_rol = 3 and id_usuario != p_id_usuario) >= 1 then
        signal sqlstate '45000'
        set message_text = 'error: ya existe un administrador registrado.';
    end if;

    -- actualizar el usuario (solo nombre y rol)
    update usuario
    set nombre = p_nombre,
        id_rol = p_id_rol
    where id_usuario = p_id_usuario;

    -- actualizar autenticación
    update autenticacion
    set correo = p_correo, fecha_nacimiento = p_fecha_nacimiento, genero = p_genero,
        nacionalidad = p_nacionalidad, contrasena_hash = p_contrasena_hash,
        id_google = p_id_google, tipo_autenticacion = p_tipo_autenticacion
    where id_usuario = p_id_usuario;
end //
DELIMITER ;


-- ELIMINAR USUARIO
DELIMITER //
create procedure eliminar_usuario(
    in p_id_usuario int
)
begin
    -- verificar si el usuario existe
    if not exists (select 1 from usuario where id_usuario = p_id_usuario) then
        signal sqlstate '45000'
        set message_text = 'error: el usuario no existe.';
    end if;

    -- evitar la eliminación del único administrador
    if (select id_rol from usuario where id_usuario = p_id_usuario) = 3 
       and (select count(*) from usuario where id_rol = 3) = 1 then
        signal sqlstate '45000'
        set message_text = 'error: no se puede eliminar el único administrador.';
    end if;

    -- verificar si el usuario tiene dependencias antes de eliminarlo
    if (select count(*) from empresa where id_usuario = p_id_usuario) > 0 then
        delete from empresa where id_usuario = p_id_usuario;
    end if;

    -- eliminar usuario (autenticacion se eliminará automáticamente por cascade)
    delete from usuario where id_usuario = p_id_usuario;
end //
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------------------- --

-- TABLA AUTENTICACION
-- INSERTAR AUTENTICACION - NUEVO CON VERIFICACIONES
DELIMITER //
create procedure insertar_autenticacion(
    in p_id_usuario int,
    in p_correo varchar(100),
    in p_contrasena_hash varchar(255),
    in p_fecha_nacimiento date,
    in p_genero enum('masculino', 'femenino', 'otro'),
    in p_nacionalidad varchar(100),
    in p_id_google varchar(100),
    in p_tipo_autenticacion enum('normal', 'google')
)
begin
    -- verificar si el correo ya existe (en cualquier tipo de autenticación)
    if exists (select 1 from autenticacion where correo = p_correo) then
        signal sqlstate '45000'
        set message_text = 'error: el correo ya está registrado.';
    end if;

    -- verificar que un usuario con google no tenga contraseña
    if p_tipo_autenticacion = 'google' and p_contrasena_hash is not null then
        signal sqlstate '45000'
        set message_text = 'error: los usuarios con autenticación de google no deben tener contraseña.';
    end if;

    -- verificar que un usuario con autenticación normal tenga una contraseña
    if p_tipo_autenticacion = 'normal' and (p_contrasena_hash is null or p_contrasena_hash = '') then
        signal sqlstate '45000'
        set message_text = 'error: los usuarios con autenticación normal deben tener una contraseña.';
    end if;

    -- Verificar que un usuario con autenticación de google tenga el id_google no nulo
    if p_tipo_autenticacion = 'google' and (p_id_google is null or p_id_google = '') then
        signal sqlstate '45000'
        set message_text = 'error: los usuarios con autenticación de google deben tener un id_google.';
    end if;

    insert into autenticacion(id_usuario, correo, contrasena_hash, fecha_nacimiento, genero, 
                              nacionalidad, id_google, tipo_autenticacion)
    values (p_id_usuario, p_correo_

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_autenticacion_id(
    in p_id_usuario int
)
begin
    select * from autenticacion where id_usuario = p_id_usuario;
end //
DELIMITER ;

-- CONSULTAR EN GENERAL
DELIMITER //
create procedure consultar_autenticaciones()
begin
    select * from autenticacion;
end //
DELIMITER ;

-- ACTUALIZAR - NUEVO CON RESTRICCIONES
-- ACTUALIZAR - NUEVO CON RESTRICCIONES
DELIMITER //
create procedure actualizar_autenticacion(
    in p_id_usuario int,
    in p_correo varchar(100),
    in p_contrasena_hash varchar(255),
    in p_fecha_nacimiento date,
    in p_genero enum('masculino', 'femenino', 'otro'),
    in p_nacionalidad varchar(100),
    in p_id_google varchar(100),
    in p_tipo_autenticacion enum('normal', 'google')
)
begin
    -- verificar que el nuevo correo no esté en uso por otro usuario
    if exists (select 1 from autenticacion where correo = p_correo and id_usuario != p_id_usuario) then
        signal sqlstate '45000'
        set message_text = 'error: el correo ya está en uso por otro usuario.';
    end if;

    -- verificar si el usuario se autenticó con google, que no pueda cambiar su correo
    if (select tipo_autenticacion from autenticacion where id_usuario = p_id_usuario) = 'google' 
        and p_correo != (select correo from autenticacion where id_usuario = p_id_usuario) then
        signal sqlstate '45000'
        set message_text = 'error: los usuarios autenticados con google no pueden cambiar su correo.';
    end if;

    -- verificar que un usuario con google no tenga contraseña
    if p_tipo_autenticacion = 'google' and p_contrasena_hash is not null then
        signal sqlstate '45000'
        set message_text = 'error: los usuarios con autenticación de google no deben tener contraseña.';
    end if;

    -- verificar que un usuario con autenticación normal tenga una contraseña
    if p_tipo_autenticacion = 'normal' and (p_contrasena_hash is null or p_contrasena_hash = '') then
        signal sqlstate '45000'
        set message_text = 'error: los usuarios con autenticación normal deben tener una contraseña.';
    end if;

    -- Verificar que un usuario con autenticación de google tenga el id_google no nulo
    if p_tipo_autenticacion = 'google' and (p_id_google is null or p_id_google = '') then
        signal sqlstate '45000'
        set message_text = 'error: los usuarios con autenticación de google deben tener un id_google.';
    end if;

    update autenticacion
    set correo = p_correo,
        contrasena_hash = p_contrasena_hash,
        fecha_nacimiento = p_fecha_nacimiento,
        genero = p_genero,
        nacionalidad = p_nacionalidad,
        id_google = p_id_google,
        tipo_autenticacion = p_tipo_autenticacion
    where id_usuario = p_id_usuario;
end //
DELIMITER ;


-- ELIMINACION DE PROCEDIMIENTOS PARA CORREGIR COSAS DE AUTENTICACIÓN 
drop procedure if exists insertar_autenticacion;
drop procedure if exists actualizar_autenticacion;


-- ------------------------------------------------------------------------------------------------------------------ --

-- TABLA TOKEN DE RECUPERACION 
-- GENERAR TOKEN
DELIMITER //
create procedure generar_token_recuperacion(
    in p_id_usuario int,
    in p_token varchar(100),
    in p_fecha_expiracion datetime
)
begin
    -- eliminar tokens previos del usuario para evitar duplicidad
    delete from token_recuperacion where id_usuario = p_id_usuario;
    
    -- insertar el nuevo token
    insert into token_recuperacion(id_usuario, token, fecha_expiracion)
    values (p_id_usuario, p_token, p_fecha_expiracion);
end //
DELIMITER ;

--  VALIDAR TOKEN DE RECUPERACIÓN 
DELIMITER //
create procedure validar_token_recuperacion(
    in p_token varchar(100)
)
begin
    -- verificar si el token es válido y no ha expirado
    if not exists (select 1 from token_recuperacion where token = p_token and fecha_expiracion > now()) then
        signal sqlstate '45000'
        set message_text = 'error: token inválido o expirado.';
    end if;
end //
DELIMITER ;

-- ------------------------------------------------------------------------------------------------------------------- --

-- TABLA CATEGORIA TURISTICA
-- INSERTAR CATEGORIA 
DELIMITER //
create procedure insertar_categoria_turistica(
    in p_nombre varchar(100),
    in p_descripcion text
)
begin
    -- verificar si la categoría ya existe
    if exists (select 1 from categoria_turistica where nombre = p_nombre) then
        signal sqlstate '45000'
        set message_text = 'Error: La categoría ya existe.';
    else
        insert into categoria_turistica(nombre, descripcion)
        values (p_nombre, p_descripcion);
    end if;
end //	
DELIMITER ;


-- ACTUALIZAR CATEGORIA 
DELIMITER //
create procedure actualizar_categoria_turistica(
    in p_id_categoria int,
    in p_nombre varchar(100),
    in p_descripcion text
)
begin
    -- verificar si la categoría existe
    if not exists (select 1 from categoria_turistica where id_categoria = p_id_categoria) then
        signal sqlstate '45000'
        set message_text = 'Error: La categoría no existe.';
    else
        update categoria_turistica
        set nombre = p_nombre, descripcion = p_descripcion
        where id_categoria = p_id_categoria;
    end if;
end //
DELIMITER ;

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_categoria_por_id(
    in p_id_categoria int
)
begin
    -- retornar la categoría correspondiente al id
    select * from categoria_turistica where id_categoria = p_id_categoria;
end //
DELIMITER ;

-- CONSULTA EN GENERAL
DELIMITER //
create procedure consultar_categorias()
begin
    -- retornar todas las categorías
    select * from categoria_turistica;
end //
DELIMITER ;

-- ELIMINAR CATEGORIA
DELIMITER //
create procedure eliminar_categoria_turistica(
    in p_id_categoria int
)
begin
    -- verificar si la categoría existe antes de eliminar
    if not exists (select 1 from categoria_turistica where id_categoria = p_id_categoria) then
        signal sqlstate '45000'
        set message_text = 'Error: La categoría no existe.';
    elseif exists (select 1 from lugar_turistico where id_categoria = p_id_categoria) then
        signal sqlstate '45000'
        set message_text = 'Error: No se puede eliminar la categoría porque está en uso.';
    else
        delete from categoria_turistica where id_categoria = p_id_categoria;
    end if;
end //
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------------------- --
-- TABLA DESTINO TURISTICO
-- INSERTAR DESTINO
DELIMITER //
create procedure insertar_destino(
    in p_id_categoria int,
    in p_nombre varchar (100),
    in p_descripcion text,
    in p_ciudad varchar(100),
    in p_direccion varchar(100)
)
begin
    -- verificar si el destino ya existe en la misma ciudad
    if exists (select 1 from destino_turistico where nombre = p_nombre and ciudad = p_ciudad) then
        signal sqlstate '45000'
        set message_text = 'error: el destino ya existe en esta ciudad.';
    else
        insert into destino_turistico(id_categoria, nombre, descripcion, ciudad, direccion)
        values(p_id_categoria, p_nombre, p_descripcion, p_ciudad, p_direccion);
    end if;
end //
DELIMITER ;


-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_destino_id(
    in p_id_destino int
)
begin
    -- verificar si el destino existe
    if not exists (select 1 from destino_turistico where id_destino = p_id_destino) then
        signal sqlstate '45000'
        set message_text = 'error: el destino no existe.';
    else
        select * from destino_turistico where id_destino = p_id_destino;
    end if;
end //
DELIMITER ;


-- CONSULTAR EN GENERAL
DELIMITER //
create procedure consultar_destinos()
begin
    select * from destino_turistico;
end //
DELIMITER ;

-- ACTUALIZAR DESTINO
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
    -- verificar si el destino existe antes de actualizar
    if not exists (select 1 from destino_turistico where id_destino = p_id_destino) then
        signal sqlstate '45000'
        set message_text = 'error: el destino no existe.';
    else
        update destino_turistico
        set id_categoria = p_id_categoria, 
            nombre = p_nombre, 
            descripcion = p_descripcion,
            ciudad = p_ciudad, 
            direccion = p_direccion
        where id_destino = p_id_destino;
    end if;
end //
DELIMITER ;

-- ELIMINAR DESTINO
DELIMITER //
create procedure eliminar_destino (
    in p_id_destino int
)
begin
    -- verificar si el destino existe antes de eliminarlo
    if not exists (select 1 from destino_turistico where id_destino = p_id_destino) then
        signal sqlstate '45000'
        set message_text = 'error: el destino no existe.';
    else
        delete from destino_turistico where id_destino = p_id_destino;
    end if;
end //
DELIMITER ;


-- ----------------------------------------------------------------------------------------------------------------- --

-- TABLA EMPRESA
-- INSERTAR EMPRESA 
DELIMITER //
create procedure insertar_empresa(
    in p_id_usuario int,
    in p_id_destino int,
    in p_nombre varchar(100),
    in p_descripcion text,
    in p_tipo enum('restaurante', 'atracción', 'otro'),
    in p_horario_apertura time,
    in p_horario_cierre time,
    in p_telefono varchar(20)
)
begin
    -- verificar si el usuario existe antes de proceder
    if not exists (select 1 from usuario where id_usuario = p_id_usuario) then
        signal sqlstate '45000'
        set message_text = 'error: el usuario no existe.';
    end if;

    -- verificar si el usuario ya tiene una empresa
    if exists (select 1 from empresa where id_usuario = p_id_usuario) then
        signal sqlstate '45000'
        set message_text = 'error: el usuario ya tiene una empresa registrada.';
    else
        insert into empresa(id_usuario, id_destino, nombre, descripcion, tipo, 
                            horario_apertura, horario_cierre, telefono)
        values (p_id_usuario, p_id_destino, p_nombre, p_descripcion, p_tipo, 
                p_horario_apertura, p_horario_cierre, p_telefono);
    end if;
end //
DELIMITER ;

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_empresa_id(
    in p_id_empresa int
)
begin
    select * from empresa where id_empresa = p_id_empresa;
end //
DELIMITER ;

-- CONSULTAR EN GENERAL
DELIMITER //
create procedure consultar_empresas()
begin
    select * from empresa;
end //
DELIMITER ;

-- ACTUALIZAR 
DELIMITER //
create procedure actualizar_empresa(
    in p_id_empresa int,
    in p_id_usuario int,
    in p_id_destino int,
    in p_nombre varchar(100),
    in p_descripcion text,
    in p_tipo varchar(20),
    in p_horario_apertura time,
    in p_horario_cierre time,
    in p_telefono varchar(20)
)
begin
    -- validar que la empresa exista
    if (select count(*) from empresa where id_empresa = p_id_empresa) = 0 then
        signal sqlstate '45000'
        set message_text = 'error: la empresa no existe.';
    else
        -- validar el tipo de empresa
        if p_tipo not in ('restaurante', 'atracción', 'otro') then
            signal sqlstate '45000'
            set message_text = 'error: tipo de empresa inválido.';
        else
            update empresa
            set id_usuario = p_id_usuario,
                id_destino = p_id_destino,
                nombre = p_nombre,
                descripcion = p_descripcion,
                tipo = p_tipo,
                horario_apertura = p_horario_apertura,
                horario_cierre = p_horario_cierre,
                telefono = p_telefono
            where id_empresa = p_id_empresa;
        end if;
    end if;
end //
DELIMITER ;

-- ELIMINAR 
DELIMITER //
create procedure eliminar_empresa(
    in p_id_empresa int
)
begin
    declare exit handler for sqlexception 
    begin
        rollback;
        signal sqlstate '45000'
        set message_text = 'error al eliminar la empresa';
    end;
    
    start transaction;
    
    -- verificar si la empresa existe
    if (select count(*) from empresa where id_empresa = p_id_empresa) = 0 then
        signal sqlstate '45000'
        set message_text = 'error: la empresa no existe.';
    else
        -- verificar si la empresa tiene productos o servicios asociados
        if (select count(*) from producto_servicio where id_empresa = p_id_empresa) > 0 then
            signal sqlstate '45000'
            set message_text = 'error: no se puede eliminar la empresa 
								porque tiene productos o servicios asociados.';
        else
            -- eliminar la empresa
            delete from empresa where id_empresa = p_id_empresa;
        end if;
    end if;
    
    commit;
end //
DELIMITER ;

-- ------------------------------------------------------------------------------------------------------------------ --
-- TABLA PRODUCTO SERVICIO
-- INSERTAR PRODCUTO
DELIMITER //
create procedure insertar_producto_servicio(
    in p_id_empresa int,
    in p_nombre varchar(100),
    in p_descripcion text,
    in p_precio decimal(10,2)
)
begin
    -- verificar si la empresa existe
    if not exists (select 1 from empresa where id_empresa = p_id_empresa) then
        signal sqlstate '45000'
        set message_text = 'error: la empresa no existe.';
    elseif p_precio <= 0 then
        signal sqlstate '45000'
        set message_text = 'error: el precio debe ser mayor a 0.';
    else
        insert into producto_servicio (id_empresa, nombre, descripcion, precio)
        values (p_id_empresa, p_nombre, p_descripcion, p_precio);
    end if;
end //
DELIMITER ;

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_producto_id(
	in p_id_producto int
)
begin
    select * from producto_servicio where id_producto = p_id_producto;
end //
DELIMITER ;

-- CONSULTA EN GENERAL
DELIMITER //
create procedure consultar_productos()
begin
    select * from producto_servicio;
end //
DELIMITER ;

-- ACTUALIZAR
DELIMITER //
create procedure actualizar_producto_servicio(
    in p_id_producto int,
    in p_id_empresa int,
    in p_nombre varchar(100),
    in p_descripcion text,
    in p_precio decimal(10,2)
)
begin
    -- verificar si el producto existe
    if not exists (select 1 from producto_servicio where id_producto = p_id_producto) then
        signal sqlstate '45000'
        set message_text = 'error: el producto no existe.';
    elseif p_precio <= 0 then
        signal sqlstate '45000'
        set message_text = 'error: el precio debe ser mayor a 0.';
    else
        update producto_servicio
        set id_empresa = p_id_empresa,
            nombre = p_nombre,
            descripcion = p_descripcion,
            precio = p_precio
        where id_producto = p_id_producto;
    end if;
end //
DELIMITER ;

-- ELIMINAR 
DELIMITER //
create procedure eliminar_producto_servicio(
    in p_id_producto int
)
begin
    -- verificar si el producto existe
    if not exists (select 1 from producto_servicio where id_producto = p_id_producto) then
        signal sqlstate '45000'
        set message_text = 'error: el producto no existe.';
    else
        delete from producto_servicio where id_producto = p_id_producto;
    end if;
end //
DELIMITER ;


-- ----------------------------------------------------------------------------------------------------------------- --
-- TABLA RESERVA 
-- INSERTAR RESERVA
DELIMITER //
create procedure insertar_reserva(
    in p_id_usuario int,
    in p_id_destino int,
    in p_id_empresa int,
    in p_fecha_reserva date,
    in p_hora_reserva time,
    in p_cantidad int,
    in p_estado varchar(20) -- Se cambia ENUM por VARCHAR(20)
)
begin
    -- Verificar existencia de usuario, destino y empresa
    if not exists (select 1 from usuario where id_usuario = p_id_usuario) then
        signal sqlstate '45000'
        set message_text = 'Error: el usuario no existe.';
    elseif not exists (select 1 from destinos_turisticos where id_destino = p_id_destino) then
        signal sqlstate '45000'
        set message_text = 'Error: el destino no existe.';
    elseif not exists (select 1 from empresa where id_empresa = p_id_empresa) then
        signal sqlstate '45000'
        set message_text = 'Error: la empresa no existe.';
    else
        insert into reserva (id_usuario, id_destino, id_empresa, fecha_reserva, hora_reserva, cantidad, estado)
        values (p_id_usuario, p_id_destino, p_id_empresa, p_fecha_reserva, p_hora_reserva, p_cantidad, p_estado);
    end if;
end //
DELIMITER ;

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_reserva_id(
    in p_id_reserva int
)
begin
    select * from reserva where id_reserva = p_id_reserva;
end //
DELIMITER ;

-- CONSULTAR EN GENERAL
DELIMITER //
create procedure consultar_reservas()
begin
    select * from reserva;
end //
DELIMITER ;

-- ACTUALIZAR
DELIMITER //
create procedure actualizar_reserva(
    in p_id_reserva int,
    in p_estado varchar(20) -- Se cambia ENUM por VARCHAR(20)
)
begin
    -- Verificar que la reserva existe antes de actualizar
    if not exists (select 1 from reserva where id_reserva = p_id_reserva) then
        signal sqlstate '45000'
        set message_text = 'Error: la reserva no existe.';
    else
        update reserva
        set estado = p_estado
        where id_reserva = p_id_reserva;
    end if;
end //
DELIMITER ;

-- ELIMINAR 
DELIMITER //
create procedure eliminar_reserva(
    in p_id_reserva int
)
begin
    -- Verificar que la reserva existe antes de eliminarla
    if not exists (select 1 from reserva where id_reserva = p_id_reserva) then
        signal sqlstate '45000'
        set message_text = 'Error: la reserva no existe.';
    else
        delete from reserva where id_reserva = p_id_reserva;
    end if;
end //
DELIMITER ;

-- ---------------------------------------------------------------------------------------------------------------- --
-- TABLA DETALLE RESERVA
-- INSERTAR DETALLE RESERVA
DELIMITER //
create procedure insertar_detalle_reserva(
    in p_id_reserva int,
    in p_id_producto int,
    in p_cantidad int,
    in p_precio_unitario decimal(10,2)
)
begin
    -- Verificar existencia de la reserva y del producto antes de insertar
    if not exists (select 1 from reserva where id_reserva = p_id_reserva) then
        signal sqlstate '45000'
        set message_text = 'Error: la reserva no existe.';
    elseif not exists (select 1 from producto_servicio where id_producto = p_id_producto) then
        signal sqlstate '45000'
        set message_text = 'Error: el producto no existe.';
    else
        insert into detalle_reserva (id_reserva, id_producto, cantidad, precio_unitario)
        values (p_id_reserva, p_id_producto, p_cantidad, p_precio_unitario);
    end if;
end //
DELIMITER ;


-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_detalle_reserva_id(
    in p_id_detalle_reserva int
)
begin
    select * from detalle_reserva where id_detalle_reserva = p_id_detalle_reserva;
end //
DELIMITER ;

-- CONSULTAR EN GENERAL
DELIMITER //
create procedure consultar_detalles_reservas()
begin
    select * from detalle_reserva;
end //
DELIMITER ;

-- ACTUALIZAR
DELIMITER //
create procedure actualizar_detalle_reserva(
    in p_id_detalle_reserva int,
    in p_cantidad int,
    in p_precio_unitario decimal(10,2)
)
begin
    -- Verificar si el detalle de reserva existe
    if not exists (select 1 from detalle_reserva where id_detalle_reserva = p_id_detalle_reserva) then
        signal sqlstate '45000'
        set message_text = 'Error: el detalle de reserva no existe.';
    else
        update detalle_reserva
        set cantidad = p_cantidad,
            precio_unitario = p_precio_unitario
        where id_detalle_reserva = p_id_detalle_reserva;
    end if;
end //
DELIMITER ;

-- ELIMINAR 
DELIMITER //
create procedure eliminar_detalle_reserva(
    in p_id_detalle_reserva int
)
begin
    -- Verificar si el detalle de reserva existe antes de eliminarlo
    if not exists (select 1 from detalle_reserva where id_detalle_reserva = p_id_detalle_reserva) then
        signal sqlstate '45000'
        set message_text = 'Error: el detalle de reserva no existe.';
    else
        delete from detalle_reserva where id_detalle_reserva = p_id_detalle_reserva;
    end if;
end //
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------------------- --

-- TABLA METODO PAGO
-- INSERTAR METODO PAGO
DELIMITER //
create procedure insertar_metodo_pago(
    in p_metodo varchar(100)
)
begin
    -- Verificar si el método de pago ya existe
    if exists (select 1 from metodo_pago where metodo = p_metodo) then
        signal sqlstate '45000'
        set message_text = 'Error: El método de pago ya existe.';
    else
        insert into metodo_pago (metodo) 
        values (p_metodo);
    end if;
end //
DELIMITER ;

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_metodo_pago_id(
    in p_id_metodo int
)
begin
    select * from metodo_pago where id_metodo = p_id_metodo;
end //
DELIMITER ;

-- CONSULTA EN GENERAL
DELIMITER //
create procedure consultar_metodos_pago()
begin
    select * from metodo_pago;
end //
DELIMITER ;

-- ACTUALIZAR METODO PAGO 
DELIMITER //
create procedure actualizar_metodo_pago(
    in p_id_metodo int,
    in p_metodo varchar(100)
)
begin
    -- Verificar si el método de pago existe antes de actualizarlo
    if not exists (select 1 from metodo_pago where id_metodo = p_id_metodo) then
        signal sqlstate '45000'
        set message_text = 'Error: El método de pago no existe.';
    elseif exists (select 1 from metodo_pago where metodo = p_metodo and id_metodo <> p_id_metodo) then
        signal sqlstate '45000'
        set message_text = 'Error: Ya existe otro método de pago con ese nombre.';
    else
        update metodo_pago 
        set metodo = p_metodo 
        where id_metodo = p_id_metodo;
    end if;
end //
DELIMITER ;

-- ELIMINAR METODO PAGO 
DELIMITER //
create procedure eliminar_metodo_pago(
    in p_id_metodo int
)
begin
    -- Verificar si el método de pago existe antes de eliminarlo
    if not exists (select 1 from metodo_pago where id_metodo = p_id_metodo) then
        signal sqlstate '45000'
        set message_text = 'Error: El método de pago no existe.';
    else
        delete from metodo_pago where id_metodo = p_id_metodo;
    end if;
end //
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------------------- --
-- TABLA PAGO
-- INSERTAR PAGO
DELIMITER //
create procedure insertar_pago(
    in p_id_usuario int,
    in p_id_reserva int,
    in p_id_metodo int,
    in p_monto_total decimal(10,2),
    in p_estado enum('pendiente', 'completado', 'fallido', 'reembolsado')
)
begin
    if p_monto_total <= 0 then
        signal sqlstate '45000' set message_text = 'El monto total debe ser mayor a 0';
    end if;

    insert into pago (id_usuario, id_reserva, id_metodo, monto_total, estado)
    values (p_id_usuario, p_id_reserva, p_id_metodo, p_monto_total, p_estado);
end //
DELIMITER ;

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_pago_id(
    in p_id_pago int
)
begin
    select * from pago where id_pago = p_id_pago;
end //
DELIMITER ;

-- CONSULTA EN GENERAL
DELIMITER //
create procedure consultar_pagos()
begin
    select * from pago;
end //
DELIMITER ;

-- ACTUALIZAR PAGO
DELIMITER //
create procedure actualizar_pago(
    in p_id_pago int,
    in p_estado enum('pendiente', 'completado', 'fallido', 'reembolsado')
)
begin
    if (select estado from pago where id_pago = p_id_pago) = 'completado' then
        signal sqlstate '45000' set message_text = 'No se puede modificar un pago que ya ha sido completado';
    end if;

    update pago
    set estado = p_estado
    where id_pago = p_id_pago;
end //
DELIMITER ;

-- ELIMINAR PAGO
DELIMITER //
create procedure eliminar_pago(
    in p_id_pago int
)
begin
    delete from pago where id_pago = p_id_pago;
end //
DELIMITER ;

-- ------------------------------------------------------------------------------------------------------------------ --

-- TABLA CALIFICACION DESTINO
-- INSERTAR CALIFICACION DESTINO
DELIMITER //
create procedure insertar_calificacion_destino(
    in p_id_usuario int,
    in p_id_destino int,
    in p_calificacion tinyint,
    in p_comentario text
)
begin
    -- Validar que la calificación esté entre 1 y 5
    if p_calificacion < 1 or p_calificacion > 5 then
        signal sqlstate '45000' set message_text = 'La calificación debe estar entre 1 y 5';
    end if;

    -- Insertar nueva calificación
    insert into calificacion_destino (id_usuario, id_destino, calificacion, comentario)
    values (p_id_usuario, p_id_destino, p_calificacion, p_comentario);
end //
DELIMITER ;

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_calificacion_id(
    in p_id_calificacion int
)
begin
    -- Verificar si la calificación existe
    if not exists (select 1 from calificacion_destino where id_calificacion = p_id_calificacion) then
        signal sqlstate '45000' set message_text = 'La calificación no existe';
    end if;

    -- Consultar calificación
    select * from calificacion_destino where id_calificacion = p_id_calificacion;
end //
DELIMITER ;

-- CONSULTA GENERAL
DELIMITER //
create procedure consultar_todas_calificaciones()
begin
    select * from calificacion_destino;
end //
DELIMITER ;

-- ACTUALIZAR CALIFICACION DESTINO
DELIMITER //
create procedure actualizar_calificacion(
    in p_id_calificacion int,
    in p_calificacion tinyint,
    in p_comentario text
)
begin
    -- Verificar si la calificación existe
    if not exists (select 1 from calificacion_destino where id_calificacion = p_id_calificacion) then
        signal sqlstate '45000' set message_text = 'La calificación no existe';
    end if;

    -- Validar que la calificación esté entre 1 y 5
    if p_calificacion < 1 or p_calificacion > 5 then
        signal sqlstate '45000' set message_text = 'La calificación debe estar entre 1 y 5';
    end if;

    -- No permitir modificaciones después de 24 horas
    if (select timestampdiff(hour, fecha, now()) from calificacion_destino where id_calificacion = p_id_calificacion) > 24 then
        signal sqlstate '45000' set message_text = 'No se puede modificar una calificación después de 24 horas';
    end if;

    -- Actualizar calificación y comentario
    update calificacion_destino
    set calificacion = p_calificacion,
        comentario = p_comentario
    where id_calificacion = p_id_calificacion;
end //
DELIMITER ;

-- ELIMINAR CALIFICACION DESTINO
DELIMITER //
create procedure eliminar_calificacion(
    in p_id_calificacion int
)
begin
    -- Verificar si la calificación existe
    if not exists (select 1 from calificacion_destino where id_calificacion = p_id_calificacion) then
        signal sqlstate '45000' set message_text = 'La calificación no existe';
    end if;

    -- No permitir eliminación después de 24 horas
    if (select timestampdiff(hour, fecha, now()) from calificacion_destino where id_calificacion = p_id_calificacion) > 24 then
        signal sqlstate '45000' set message_text = 'No se puede eliminar una calificación después de 24 horas';
    end if;

    -- Eliminar calificación
    delete from calificacion_destino where id_calificacion = p_id_calificacion;
end //
DELIMITER ;

-- ------------------------------------------------------------------------------------------------------------------- --
-- TABLA RESEÑA EMPRESA
-- INSERTAR RESEÑA
DELIMITER //
create procedure insertar_resena_empresa(
    in p_id_usuario int,
    in p_id_empresa int,
    in p_comentario text,
    in p_calificacion tinyint
)
begin
    -- Validar que la calificación esté entre 1 y 5
    if p_calificacion < 1 or p_calificacion > 5 then
        signal sqlstate '45000' set message_text = 'La calificación debe estar entre 1 y 5';
    end if;

    -- Insertar nueva reseña
    insert into resena_empresa (id_usuario, id_empresa, comentario, calificacion)
    values (p_id_usuario, p_id_empresa, p_comentario, p_calificacion);
end //
DELIMITER ;

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_resena_id(
    in p_id_resena int
)
begin
    -- Verificar si la reseña existe
    if not exists (select 1 from resena_empresa where id_resena = p_id_resena) then
        signal sqlstate '45000' set message_text = 'La reseña no existe';
    end if;

    -- Consultar reseña
    select * from resena_empresa where id_resena = p_id_resena;
end //
DELIMITER ;

-- CONSULTA EN GENERAL
DELIMITER //
create procedure consultar_resenas()
begin
    select * from resena_empresa;
end //
DELIMITER ;

-- ACTUALIZAR RESEÑA
DELIMITER //
create procedure actualizar_resena(
    in p_id_resena int,
    in p_comentario text,
    in p_calificacion tinyint
)
begin
    -- Verificar si la reseña existe
    if not exists (select 1 from resena_empresa where id_resena = p_id_resena) then
        signal sqlstate '45000' set message_text = 'La reseña no existe';
    end if;

    -- Validar que la calificación esté entre 1 y 5
    if p_calificacion < 1 or p_calificacion > 5 then
        signal sqlstate '45000' set message_text = 'La calificación debe estar entre 1 y 5';
    end if;

    -- No permitir modificaciones después de 24 horas
    if (select timestampdiff(hour, fecha, now()) from resena_empresa where id_resena = p_id_resena) > 24 then
        signal sqlstate '45000' set message_text = 'No se puede modificar una reseña después de 24 horas';
    end if;

    -- Actualizar reseña
    update resena_empresa
    set comentario = p_comentario,
        calificacion = p_calificacion
    where id_resena = p_id_resena;
end //
DELIMITER ;

-- ELIMINAR RESEÑA
DELIMITER //
create procedure eliminar_resena(
    in p_id_resena int
)
begin
    -- Verificar si la reseña existe
    if not exists (select 1 from resena_empresa where id_resena = p_id_resena) then
        signal sqlstate '45000' set message_text = 'La reseña no existe';
    end if;

    -- No permitir eliminación después de 24 horas
    if (select timestampdiff(hour, fecha, now()) from resena_empresa where id_resena = p_id_resena) > 24 then
        signal sqlstate '45000' set message_text = 'No se puede eliminar una reseña después de 24 horas';
    end if;

    -- Eliminar reseña
    delete from resena_empresa where id_resena = p_id_resena;
end //
DELIMITER ;

-- ------------------------------------------------------------------------------------------------------------------- --
-- TABLA AUDITORIA
-- INSERTAR AUDITORIA
DELIMITER //
create procedure insertar_bitacora_auditoria(
    in p_id_usuario int,
    in p_accion varchar(100)
)
begin
    -- Validar que la acción no supere los 100 caracteres
    if char_length(p_accion) > 100 then
        signal sqlstate '45000' set message_text = 'El campo acción no puede superar los 100 caracteres';
    end if;

    -- Insertar en la bitácora
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (p_id_usuario, p_accion, current_timestamp());
end //
DELIMITER ;

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_bitacora_id(
    in p_id_bitacora int
)
begin
    -- Verificar si el registro existe
    if not exists (select 1 from bitacora_auditoria where id_bitacora = p_id_bitacora) then
        signal sqlstate '45000' set message_text = 'El registro de bitácora no existe';
    end if;

    -- Consultar registro
    select * from bitacora_auditoria where id_bitacora = p_id_bitacora;
end //
DELIMITER ;

-- CONSULTA EN GENERAL
DELIMITER //
create procedure consultar_toda_bitacora()
begin
    select * from bitacora_auditoria order by fecha desc;
end //
DELIMITER ;

-- ELIMINAR AUDITORIA
DELIMITER //
create procedure eliminar_registro_bitacora(in p_id_bitacora int)
begin
    signal sqlstate '45000' set message_text = 'No se permite la eliminación de registros en la bitácora';
end //
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------------------- --
-- TABLA CONTENIDO
-- INSERTAR CONTENIDO
DELIMITER //
create procedure insertar_contenido(
    in p_titulo varchar(200),
    in p_descripcion text,
    in p_imagen varchar(500),
    in p_precio decimal(10,2),
    in p_id_destino int,
    in p_id_empresa int
)
begin
    -- Verificar que los campos obligatorios no estén vacíos
    if p_titulo = '' or p_descripcion = '' or p_imagen = '' then
        signal sqlstate '45000' 
        set message_text = 'El título, la descripción y la imagen no pueden estar vacíos';
    end if;

    -- Verificar que el precio no sea negativo
    if p_precio < 0 then
        signal sqlstate '45000' 
        set message_text = 'El precio no puede ser negativo';
    end if;

    -- Verificar que el destino exista
    if (select count(*) from destinos_turisticos where id_destino = p_id_destino) = 0 then
        signal sqlstate '45000' 
        set message_text = 'El destino turístico no existe';
    end if;

    -- Verificar que la empresa exista
    if (select count(*) from empresa where id_empresa = p_id_empresa) = 0 then
        signal sqlstate '45000' 
        set message_text = 'La empresa no existe';
    end if;

    -- Insertar el contenido si todo está correcto
    insert into contenido (titulo, descripcion, imagen, precio, id_destino, id_empresa)
    values (p_titulo, p_descripcion, p_imagen, p_precio, p_id_destino, p_id_empresa);
end;
//
DELIMITER ;


-- CONSULTA POR ID
DELIMITER //
create procedure consultar_contenido_id(in p_id_contenido int)
begin
    -- Verificar si el contenido existe
    if not exists (select 1 from contenido where id_contenido = p_id_contenido) then
        signal sqlstate '45000' set message_text = 'El contenido no existe';
    end if;

    -- Consultar el contenido
    select * from contenido where id_contenido = p_id_contenido;
end //
DELIMITER ;

-- CONSULTA EN GENERAL
DELIMITER //
create procedure consultar_contenidos()
begin
    select * from contenido order by fecha_creacion desc;
end //
DELIMITER ;

-- ACTUALIZAR CONTENIDO
DELIMITER //
create procedure actualizar_contenido(
    in p_id_contenido int,
    in p_titulo varchar(200),
    in p_descripcion text,
    in p_imagen varchar(500),
    in p_precio decimal(10,2),
    in p_id_destino int,
    in p_id_empresa int
)
begin
    -- Verificar que el contenido exista
    if (select count(*) from contenido where id_contenido = p_id_contenido) = 0 then
        signal sqlstate '45000' 
        set message_text = 'El contenido especificado no existe';
    end if;

    -- Verificar que los campos obligatorios no estén vacíos
    if p_titulo = '' or p_descripcion = '' or p_imagen = '' then
        signal sqlstate '45000' 
        set message_text = 'El título, la descripción y la imagen no pueden estar vacíos';
    end if;

    -- Verificar que el precio no sea negativo
    if p_precio < 0 then
        signal sqlstate '45000' 
        set message_text = 'El precio no puede ser negativo';
    end if;

    -- Verificar que el destino exista
    if (select count(*) from destinos_turisticos where id_destino = p_id_destino) = 0 then
        signal sqlstate '45000' 
        set message_text = 'El destino turístico no existe';
    end if;

    -- Verificar que la empresa exista
    if (select count(*) from empresa where id_empresa = p_id_empresa) = 0 then
        signal sqlstate '45000' 
        set message_text = 'La empresa no existe';
    end if;

    -- Actualizar el contenido si todo está correcto
    update contenido
    set titulo = p_titulo,
        descripcion = p_descripcion,
        imagen = p_imagen,
        precio = p_precio,
        id_destino = p_id_destino,
        id_empresa = p_id_empresa
    where id_contenido = p_id_contenido;
end;
//
DELIMITER ;


-- ELIMINAR CONTENIDO
DELIMITER //
create procedure eliminar_contenido(in p_id_contenido int)
begin
    -- Verificar que el contenido exista
    if (select count(*) from contenido where id_contenido = p_id_contenido) = 0 then
        signal sqlstate '45000' 
        set message_text = 'El contenido especificado no existe';
    end if;

    -- Eliminar el contenido
    delete from contenido where id_contenido = p_id_contenido;
end;
//
DELIMITER ;


-- ----------------------------------------------------------------------------------------------------------------- --

-- TABLA HISTORIAL CONTENIDO
-- INSERTAR REGISTRO HISTORIAL CONTENIDO
DELIMITER //
create procedure insertar_historial_contenido(
    in p_id_contenido int,
    in p_titulo_anterior varchar(200),
    in p_descripcion_anterior text,
    in p_precio_anterior decimal(10,2)
)
begin
    -- Verificar si el contenido existe antes de insertarlo en el historial
    if not exists (select 1 from contenido where id_contenido = p_id_contenido) then
        signal sqlstate '45000'
        set message_text = 'El contenido especificado no existe';
    else
        insert into historial_contenido (id_contenido, titulo_anterior, descripcion_anterior, precio_anterior)
        values (p_id_contenido, p_titulo_anterior, p_descripcion_anterior, p_precio_anterior);
    end if;
end //
DELIMITER ;

-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_historial_contenido(
    in p_id_contenido int
)
begin
    select * from historial_contenido 
    where id_contenido = p_id_contenido
    order by fecha_cambio desc;
end //
DELIMITER ;

-- CONSULTA EN GENERAL 
DELIMITER //
create procedure consultar_todo_historial_contenido()
begin
    select * from historial_contenido order by fecha_cambio desc;
end //
DELIMITER ;

-- ACTUALIZAR 
DELIMITER //
create procedure actualizar_historial_contenido(
    in p_id_historial int,
    in p_titulo_anterior varchar(200),
    in p_descripcion_anterior text,
    in p_precio_anterior decimal(10,2)
)
begin
    -- Verificar que el ID del historial existe
    if not exists (select 1 from historial_contenido where id_historial = p_id_historial) then
        signal sqlstate '45000'
        set message_text = 'Error: El ID del historial no existe.';
    end if;

    -- Verificar que el precio no sea negativo
    if p_precio_anterior < 0 then
        signal sqlstate '45000'
        set message_text = 'Error: El precio anterior no puede ser negativo.';
    end if;

    -- Actualizar el historial solo si pasa las validaciones
    update historial_contenido
    set titulo_anterior = p_titulo_anterior,
        descripcion_anterior = p_descripcion_anterior,
        precio_anterior = p_precio_anterior
    where id_historial = p_id_historial;
end //
DELIMITER ;

-- ELIMINAR 
DELIMITER //
create procedure eliminar_historial_contenido(
    in p_id_historial int
)
begin
    -- Verificar si el historial existe
    if not exists (select 1 from historial_contenido where id_historial = p_id_historial) then
        signal sqlstate '45000'
        set message_text = 'El historial de contenido no existe en la base de datos';
    else
        -- Verificar si el contenido tiene algún historial activo
        if exists (select 1 from contenido where id_contenido = (select id_contenido from historial_contenido where id_historial = p_id_historial) and fecha_creacion > (select fecha_cambio from historial_contenido where id_historial = p_id_historial)) then
            signal sqlstate '45000'
            set message_text = 'No se puede eliminar el historial de contenido porque existe un historial activo asociado a este contenido';
        else
            delete from historial_contenido where id_historial = p_id_historial;
        end if;
    end if;
end //
DELIMITER ;


-- -------------------------------------------------------------------------------------------------------------------- --

-- TABLA ELIMINACIONES CONTENIDO
-- INSERTAR ELIMINACIÓN 
DELIMITER //
create procedure insertar_eliminacion_contenido(
    in p_id_contenido int,
    in p_titulo varchar(200),
    in p_descripcion text,
    in p_precio decimal(10,2)
)
begin
    -- Verificar si el contenido existía antes de eliminar
    if not exists (select 1 from contenido where id_contenido = p_id_contenido) then
        signal sqlstate '45000'
        set message_text = 'El contenido a eliminar no existe en la base de datos';
    else
        insert into eliminaciones_contenido (id_contenido, titulo, descripcion, precio)
        values (p_id_contenido, p_titulo, p_descripcion, p_precio);
    end if;
end //
DELIMITER ;


-- CONSULTAR POR ID
DELIMITER //
create procedure consultar_eliminaciones_contenido(
    in p_id_contenido int
)
begin
    select * from eliminaciones_contenido 
    where id_contenido = p_id_contenido
    order by fecha_eliminacion desc;
end //
DELIMITER ;

-- CONSULTA EN GENERAL 
DELIMITER //
create procedure consultar_eliminaciones_contenido_general()
begin
    select * from eliminaciones_contenido 
    order by fecha_eliminacion desc;
end //
DELIMITER ;

-- ACTUALIZAR 
DELIMITER //
create procedure actualizar_eliminacion_contenido(
    in p_id_eliminacion int,
    in p_titulo varchar(200),
    in p_descripcion text,
    in p_precio decimal(10,2)
)
begin
    -- Verificar si la eliminación existe antes de actualizar
    if not exists (select 1 from eliminaciones_contenido where id_eliminacion = p_id_eliminacion) then
        signal sqlstate '45000'
        set message_text = 'Error: La eliminación de contenido no existe.';
    end if;

    -- Actualizar la eliminación si pasa la validación
    update eliminaciones_contenido
    set titulo = p_titulo,
        descripcion = p_descripcion,
        precio = p_precio
    where id_eliminacion = p_id_eliminacion;
end //
DELIMITER ;


-- ELIMINAR
DELIMITER //
create procedure eliminar_contenido1(
    in p_id_contenido int
)
begin
    -- Verificar si el contenido tiene registros en historial_contenido
    if exists (select 1 from historial_contenido where id_contenido = p_id_contenido) then
        signal sqlstate '45000'
        set message_text = 'No se puede eliminar el contenido porque existe un historial asociado';
    -- Verificar si el contenido tiene registros en eliminaciones_contenido
    elseif exists (select 1 from eliminaciones_contenido where id_contenido = p_id_contenido) then
        signal sqlstate '45000'
        set message_text = 'No se puede eliminar el contenido porque ya ha sido marcado como eliminado';
    else
        delete from contenido where id_contenido = p_id_contenido;
    end if;
end //
DELIMITER ;

-- ELIMINAR - VERIFICA QUE EL REGISTRO DE ELIMIACIÓN EXISTA ANTES DE ELIMINARLO
DELIMITER //
create procedure eliminar_eliminacion_contenido(
    in p_id_eliminacion int
)
begin
    -- Verificar si la eliminación existe
    if not exists (select 1 from eliminaciones_contenido where id_eliminacion = p_id_eliminacion) then
        signal sqlstate '45000'
        set message_text = 'La eliminación de contenido no existe en la base de datos';
    else
        delete from eliminaciones_contenido where id_eliminacion = p_id_eliminacion;
    end if;
end //
DELIMITER ;





-- ------------------------------------------------- INICIO DE TRIGGERS -------------------------------------------- --

-- TRIGGERS TABLA ROL
-- EVITAR ELIMINACIÓN DE ROLES
DELIMITER //
create trigger tr_evitar_eliminar_roles
before delete on rol
for each row
begin
    signal sqlstate '45000'
    set message_text = 'Error: No se pueden eliminar roles del sistema.';
end //
DELIMITER ;

show triggers;
-- ---------------------------------------------------------------------------------------------------------------------- --


-- TRIGGERS TABLA USUARIO --
-- INSERTAR USUARIO
DELIMITER //
create trigger tr_insertar_usuario
after insert on usuario
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'usuario creado', current_timestamp());
end //
DELIMITER ;

-- ACTUALIZAR USUARIO
DELIMITER //
create trigger tr_actualizar_usuario
after update on usuario
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'usuario actualizado', current_timestamp());
end //
DELIMITER ;

-- ELIMINAR USUARIO
DELIMITER //
create trigger tr_eliminar_usuario
after delete on usuario
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (old.id_usuario, 'usuario eliminado', current_timestamp());
end //
DELIMITER ;

drop trigger if exists tr_eliminar_usuario;


-- --------------------------------------------------------------------------------------------------------------- --

-- TRIGGERS TABLA AUTENTICACIÓN
-- ANTES DE ACTUALIZAR CORREO
DELIMITER //
create trigger tr_antes_de_actualizar_correo
before update on autenticacion
for each row
begin
    if old.tipo_autenticacion = 'google' and new.correo != old.correo then
        signal sqlstate '45000'
        set message_text = 'error: no se puede cambiar el correo de un usuario registrado con google.';
    end if;
end //
DELIMITER ;


-- ANTES DE INSERTAR AUTENTICACION
DELIMITER //
create trigger tr_antes_de_actualizar_correo
before update on autenticacion
for each row
begin
    if old.tipo_autenticacion = 'google' and new.correo != old.correo then
        signal sqlstate '45000'
        set message_text = 'error: no se puede cambiar el correo de un usuario registrado con google.';
    end if;
end //
DELIMITER ;

-- ------------------------------------------------------------------------------------------------------------ --
-- EVENTO TABLA TOKEN RECUPERACION
-- EVENTO ELIMINAR TOKENS EXPIRADOS 
DELIMITER //
create event if not exists evento_eliminar_tokens_expirados
on schedule every 1 minute
do
begin
    delete from token_recuperacion where fecha_expiracion < now();
end //
DELIMITER ;

-- ---------------------------------------------------------------------------------------------------------------- --

-- TRIGGER TABLA CATEGORIA TURISTICA
-- ANTES DE ACTUALIZAR
DELIMITER //
create trigger tr_antes_de_actualizar_categoria
before update on categoria_turistica
for each row
begin
    if exists (select 1 from categoria_turistica where nombre = new.nombre and id_categoria != old.id_categoria) then
        signal sqlstate '45000'
        set message_text = 'Error: El nombre de la categoría ya existe.';
    end if;
end //
DELIMITER ;

-- DESPUES DE ELIMINAR 
DELIMITER //
create trigger tr_despues_de_eliminar_categoria
after delete on categoria_turistica
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (1, concat('Eliminó la categoría con ID ', old.id_categoria, ' y nombre ', old.nombre), now());
end //
DELIMITER ;

ALTER TABLE destino_turistico ADD COLUMN id_usuario INT;

-- -------------------------------------------------------------------------------------------------------------------- --

-- TRIGERS TABLA DESTINO TURISTICO
-- DESPUES DE INSERTAR
DELIMITER //
create trigger tr_despues_de_insertar_destino
after insert on destino_turistico
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'destino turístico creado', current_timestamp());
end //
DELIMITER ;


-- DESPUES DE ACTUALIZAR 
DELIMITER //
create trigger tr_despues_de_actualizar_destino
after update on destino_turistico
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (null, 'Destino turístico actualizado', current_timestamp());

    insert into bitacora_detalle (id_bitacora, detalle)
    values (
        (select last_insert_id()),
        concat('Destino actualizado: ', old.nombre, ' en ', old.ciudad, 
               ' → Nuevo: ', new.nombre, ' en ', new.ciudad)
    );
end //
DELIMITER ;

-- ANTES DE ELIMINAR 
DELIMITER //
create trigger tr_antes_de_eliminar_destino
before delete on destino_turistico
for each row
begin
    if exists (select 1 from reserva where id_destino = old.id_destino) then
        signal sqlstate '45000' 
        set message_text = 'No se puede eliminar el destino porque tiene reservas asociadas.';
    end if;
end //
DELIMITER ;

-- ------------------------------------------------------------------------------------------------------------------ --

-- TABLA EMPRESA
-- INSERTAR EMPRESA
DELIMITER //
create trigger tr_insertar_empresa
after insert on empresa
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, tabla_afectada, fecha)
    values (new.id_usuario, concat('empresa creada (ID: ', new.id_empresa, ')'), 
		    'empresa', current_timestamp());
end //
DELIMITER ;

-- ELIMINAR EMPRESA
DELIMITER //
create trigger tr_eliminar_empresa
before delete on empresa
for each row
begin
    -- verificar si la empresa tiene productos o servicios asociados
    if exists (select 1 from producto_servicio where id_empresa = old.id_empresa) then
        delete from producto_servicio where id_empresa = old.id_empresa;
    end if;
    
    -- registrar en la bitácora
    insert into bitacora_auditoria (id_usuario, accion, tabla_afectada, fecha)
    values (old.id_usuario, concat('empresa eliminada (ID: ', old.id_empresa, ') junto con sus productos'), 
		    'empresa', current_timestamp());
end //
DELIMITER ;

-- ------------------------------------------------------------------------------------------------------------------ --
-- TABLA PRODCUTO SERVICIO
-- INSERTAR PRODUCTO
DELIMITER //
create trigger tr_insertar_producto
after insert on producto_servicio
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (
        (select id_usuario from empresa where id_empresa = new.id_empresa),
        concat('producto/servicio agregado: ', new.nombre),
        current_timestamp()
    );
end //
DELIMITER ;


-- ACTUALIZAR PRODUCTO
DELIMITER //
create trigger tr_actualizar_producto
after update on producto_servicio
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (
        (select id_usuario from empresa where id_empresa = new.id_empresa),
        concat('producto/servicio actualizado: ', new.nombre),
        current_timestamp()
    );
end //
DELIMITER ;


-- ELIMINAR PRODUCTO
DELIMITER //
create trigger tr_eliminar_producto
before delete on producto_servicio
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (
        (select id_usuario from empresa where id_empresa = old.id_empresa),
        concat('producto/servicio eliminado: ', old.nombre),
        current_timestamp()
    );
end //
DELIMITER ;

-- ------------------------------------------------------------------------------------------------------------------- --

-- TABLA RESERA
-- INSERTAR RESERVA
DELIMITER //
create trigger tr_insertar_reserva
after insert on reserva
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, concat('Reserva creada: ', new.id_reserva), current_timestamp());
end //
DELIMITER ;

-- ACTUALIZA RESERVA
DELIMITER //
create trigger tr_actualizar_reserva
after update on reserva
for each row
begin
    if old.estado <> new.estado then
        insert into bitacora_auditoria (id_usuario, accion, fecha)
        values (new.id_usuario, concat('Estado de reserva actualizado: ', new.id_reserva, ' -> ', new.estado), current_timestamp());
    end if;
end //
DELIMITER ;

-- ELIMINA RESERVA
DELIMITER //
create trigger tr_eliminar_reserva
before delete on reserva
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (old.id_usuario, concat('Reserva eliminada: ', old.id_reserva), current_timestamp());
end //
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------------------- --

-- TABLA DETALLE RESERVA
-- INSERTAR DETALLA RESERVA
DELIMITER //
create trigger tr_insertar_detalle_reserva
after insert on detalle_reserva
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values ((select id_usuario from reserva where id_reserva = new.id_reserva),
            concat('Detalle de reserva agregado: ', new.id_detalle_reserva),
            current_timestamp());
end //
DELIMITER ;


-- ACTUALIZAR DETALLE RESERVA
DELIMITER //
create trigger tr_actualizar_detalle_reserva
after update on detalle_reserva
for each row
begin
    if old.cantidad <> new.cantidad or old.precio_unitario <> new.precio_unitario then
        insert into bitacora_auditoria (id_usuario, accion, fecha)
        values ((select id_usuario from reserva where id_reserva = new.id_reserva),
                concat('Detalle de reserva actualizado: ', new.id_detalle_reserva),
                current_timestamp());
    end if;
end //
DELIMITER ;


-- ELIMINAR DETALLE RESERVA 
DELIMITER //
create trigger tr_eliminar_detalle_reserva
before delete on detalle_reserva
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values ((select id_usuario from reserva where id_reserva = old.id_reserva),
            concat('Detalle de reserva eliminado: ', old.id_detalle_reserva),
            current_timestamp());
end //
DELIMITER ;

-- -------------------------------------------------------------------------------------------------------------------- --

-- TABLA METODO PAGO
-- INSERTAR METODO PAGO
DELIMITER //
create trigger tr_insertar_metodo_pago
after insert on metodo_pago
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (null, concat('método de pago agregado: ', new.metodo), current_timestamp());
end //
DELIMITER ;


-- ELIMINAR METODO PAGO
DELIMITER //
create trigger tr_eliminar_metodo_pago
after delete on metodo_pago
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (null, concat('método de pago eliminado: ', old.metodo), current_timestamp());
end //
DELIMITER ;


-- ------------------------------------------------------------------------------------------------------------------- --

-- TABLA PAGO
-- INSERTAR PAGO
DELIMITER //
create trigger tr_insertar_pago
after insert on pago
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, concat('Pago realizado: ', new.monto_total, 
			' con método ', new.id_metodo), current_timestamp());
end //
DELIMITER ;


-- PREVENIR MODIFICAR PAGO
DELIMITER //
create trigger tr_prevenir_modificar_pago
before update on pago
for each row
begin
    if old.estado = 'completado' then
        signal sqlstate '45000' set message_text = 'No se puede modificar un pago que ya ha sido completado';
    end if;
end //
DELIMITER ;


-- ELIMINAR PAGO
DELIMITER //
create trigger tr_eliminar_pago
after delete on pago
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (old.id_usuario, concat('Pago eliminado: ', old.monto_total, 
			' con método ', old.id_metodo), current_timestamp());
end //
DELIMITER ;


-- ------------------------------------------------------------------------------------------------------------------ --
-- TABLA CALIFICACIÓN DESTINO
-- INSERTAR CALIFICACION
DELIMITER //
create trigger tr_insertar_calificacion
after insert on calificacion_destino
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'Calificación de destino creada', current_timestamp());
end //
DELIMITER ;


-- PREVENIR MODIFICACION
DELIMITER //
create trigger tr_prevenir_modificacion_calificacion
before update on calificacion_destino
for each row
begin
    signal sqlstate '45000' set message_text = 'No se puede modificar una calificación de destino después de 24 horas';
end //
DELIMITER ;


-- ------------------------------------------------------------------------------------------------------------------ --
-- TABLA RESEÑA EMPRESA
-- INSETAR RESEÑA
DELIMITER //
create trigger tr_insertar_resena
after insert on resena_empresa
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'Reseña de empresa creada', current_timestamp());
end //
DELIMITER ;

-- PREVENIR MODIFICACION
DELIMITER //
create trigger tr_prevenir_modificar_resena
before update on resena_empresa
for each row
begin
    if timestampdiff(hour, old.fecha, now()) > 24 then
        signal sqlstate '45000' set message_text = 'No se puede modificar una reseña después de 24 horas';
    end if;
end //
DELIMITER ;


-- ------------------------------------------------------------------------------------------------------------------ --
-- TABLA AUDITORIA

-- MODIFICAR USUARIO (Registrar en Bitácora Modificaciones en la Tabla usuario)
DELIMITER //
create trigger tr_modificar_usuario
after update on usuario
for each row
begin
    insert into bitacora_auditoria (id_usuario, accion, fecha)
    values (new.id_usuario, 'Usuario modificado', current_timestamp());
end //
DELIMITER ;


-- ------------------------------------------------------------------------------------------------------------------ --
-- TABLA CONTENIDO
-- ANTES DE INSERTAR CONTENIDO
DELIMITER //
create trigger antes_insertar_contenido
before insert on contenido
for each row
begin
    if new.precio < 0 then
        signal sqlstate '45000'
        set message_text = 'el precio no puede ser negativo';
    end if;
end;
DELIMITER ; 

-- ANTES DE ACTUALIZAR CONTENIDO
DELIMITER //
create trigger antes_actualizar_contenido
before update on contenido
for each row
begin
    if new.precio < 0 then
        signal sqlstate '45000'
        set message_text = 'el precio no puede ser negativo';
    end if;
end;
DELIMITER ;

-- DESPUES DE ACTUALIZAR CONTENIDO
DELIMITER //
create trigger despues_actualizar_contenido
after update on contenido
for each row
begin
    insert into historial_contenido (id_contenido, titulo_anterior, descripcion_anterior, precio_anterior, fecha_cambio)
    values (old.id_contenido, old.titulo, old.descripcion, old.precio, current_timestamp());
end;
DELIMITER ;

-- DESPUES DE ELIMINAR CONTENIDO
DELIMITER //
create trigger despues_eliminar_contenido
after delete on contenido
for each row
begin
    insert into eliminaciones_contenido (id_contenido, titulo, descripcion, precio, fecha_eliminacion)
    values (old.id_contenido, old.titulo, old.descripcion, old.precio, current_timestamp());
end;
DELIMITER ;

-- ------------------------------------------------------------------------------------------------------------------ --

show triggers;

DROP TRIGGER IF EXISTS tr_antes_de_actualizar_correo;
DROP TRIGGER IF EXISTS tr_antes_de_actualizar_correo;
