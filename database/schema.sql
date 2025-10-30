-- Crear base de datos
CREATE DATABASE IF NOT EXISTS maxwavex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE maxwavex;

-- Tabla de usuarioss ya
CREATE TABLE usuarioss (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    tipo_usuarios ENUM('estudiante', 'profesor', 'admin') DEFAULT 'estudiante',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    esta_activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL
);

-- Tabla de sesiones de invitados ya
CREATE TABLE sesiones_invitados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de módulos educativos ya
CREATE TABLE modulos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo_contenido ENUM('teoria', 'ecuaciones', 'aplicaciones', 'simulacion', 'juego') NOT NULL,
    nivel_dificultad ENUM('basico', 'intermedio', 'avanzado') DEFAULT 'basico',
    order_index INT DEFAULT 0,
    esta_activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de progreso del usuarios ya
CREATE TABLE progreso_usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuarios_id INT NOT NULL,
    modulo_id INT NOT NULL,
    porcentaje_completado DECIMAL(5,2) DEFAULT 0.00,
    tiempo_dedicado INT DEFAULT 0, -- en segundos
    ultimo_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    esta_completado BOOLEAN DEFAULT FALSE,
    puntuacion INT DEFAULT 0,
    FOREIGN KEY (usuarios_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (modulo_id) REFERENCES modulos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_module (usuarios_id, modulo_id)
);

-- Tabla de resultados de juegos/simulaciones
CREATE TABLE resultados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuarios_id INT,
    sesion_invitado_id INT,
    tipo_juego VARCHAR(100) NOT NULL,
    puntuacion INT NOT NULL,
    nivel_alcanzado INT DEFAULT 1,
    tiempo_jugado INT NOT NULL, -- en segundos
    metadata TEXT, -- datos adicionales del juego
    jugado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarios_id) REFERENCES usuarioss(id) ON DELETE CASCADE,
    FOREIGN KEY (sesion_invitado_id) REFERENCES sesiones_invitados(id) ON DELETE CASCADE
);

-- Tabla de configuraciones del sistema
CREATE TABLE system_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar módulos básicos
INSERT INTO modulos (titulo, descripcion, tipo_contenido, nivel_dificultad, order_index) VALUES
('Ondas Electromagnéticas', 'Introducción a las ondas electromagnéticas y su propagación', 'teoria', 'basico', 1),
('Campo Eléctrico', 'Fundamentos del campo eléctrico y sus propiedades', 'teoria', 'basico', 2),
('Campo Magnético', 'Bases del campo magnético y su relación con la electricidad', 'teoria', 'basico', 3),
('Ley de Gauss', 'Primera ecuación de Maxwell: Ley de Gauss para el campo eléctrico', 'ecuaciones', 'intermedio', 4),
('Ley de Gauss Magnética', 'Segunda ecuación de Maxwell: No existen monopolos magnéticos', 'ecuaciones', 'intermedio', 5),
('Ley de Faraday', 'Tercera ecuación de Maxwell: Inducción electromagnética', 'ecuaciones', 'intermedio', 6),
('Ley de Ampère-Maxwell', 'Cuarta ecuación de Maxwell: Generación de campos magnéticos', 'ecuaciones', 'intermedio', 7),
('Simulación de Campos', 'Simulación interactiva de campos electromagnéticos', 'simulacion', 'avanzado', 8),
('Juego de Ondas', 'Juego interactivo sobre propagación de ondas', 'juego', 'basico', 9),
('Aplicaciones Tecnológicas', 'Aplicaciones del electromagnetismo en la tecnología', 'aplicaciones', 'avanzado', 10);

-- Insertar configuraciones del sistema
INSERT INTO system_config (config_key, config_value, description) VALUES
('app_version', '1.0.0', 'Versión actual de la aplicación'),
('maintenance_mode', 'false', 'Modo de mantenimiento activado/desactivado'),
('guest_session_duration', '3600', 'Duración de sesiones de invitado en segundos'),
('max_score_per_game', '1000', 'Puntuación máxima por juego');

-- Crear índices para mejor rendimiento
CREATE INDEX idx_users_email ON usuarios(email);
CREATE INDEX idx_users_active ON usuarios(is_active);
CREATE INDEX idx_user_progress_user ON progreso_usuarios(usuarios_id);
CREATE INDEX idx_user_progress_module ON progreso_usuarios(modulo_id);
CREATE INDEX idx_game_results_user ON resultados(usuarios_id);
CREATE INDEX idx_game_results_guest ON resultados(sesion_invitado_id);
CREATE INDEX idx_modules_type ON modulos(tipo_contenido);
CREATE INDEX idx_modules_active ON modulos(esta_activo);