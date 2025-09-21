# IDE_web
Prototipo de un IDE web para ejecutar código de forma segura usando Django y Docker

## Configuración del Entorno

### Requisitos Previos
- Python 3.10 o superior
- Django
- Docker
- Node.js (para el editor Monaco)

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Quezo149/IDE_web.git
cd IDE_web
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto
   - Copiar el contenido de `.env.example` y ajustar los valores:
```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
```

4. Aplicar migraciones:
```bash
python manage.py migrate
```

5. Iniciar el servidor:
```bash
python manage.py runserver
```

### Seguridad
- El archivo `.env` contiene configuraciones sensibles y no debe subirse al repositorio
- Asegúrese de cambiar la SECRET_KEY en producción
- Mantenga DEBUG=False en producción
- Configure ALLOWED_HOSTS y CORS_ALLOWED_ORIGINS según sus necesidades
