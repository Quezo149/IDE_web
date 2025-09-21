from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import docker
from docker.errors import ContainerError, ImageNotFound
import io

class CodeExecutionView(APIView):
    # Lo que se recibe en el POST request lo imprime la consola local
    def post(self, request, *args, **kwargs): #Obtenemos datos del frontend
        language = request.data.get('language')
        code = request.data.get('code')
        
        if not language or not code:
            return Response({"error": "Faltan parámetros"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Inicializar el cliente de Docker
        client = docker.from_env()
        
        # Configurar la imagen y el comando según el lenguaje
        if language == 'python':
            image = "python:3.10-alpine"
            command = ["python", "-c", code]
        elif language == 'javascript':
            image = "node:16-alpine"
            command = ["node", "-e", code]
        else:
            return Response({"error": "Lenguaje no soportado"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Ejecuta el codigo en un contenedor efimero
            container = client.containers.run(
                image=image,
                command=command,
                remove=True,    # Elimina el contenedor despues de ejecutar
                stderr=True,    # Captura el error estándar
                stdout=True     # Captura la salida estándar
            )
            
            output = container.decode('utf-8')
            return Response({"output": output}, status=status.HTTP_200_OK)

        except docker.errors.ImageNotFound as e:
            return Response({"error": "Imagen no encontrada"}, status=status.HTTP_400_BAD_REQUEST)
        
        except docker.errors.ContainerError as e:
            error_output = e.stderr.decode('utf-8')
            return Response({"error": error_output}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Error interno del servidor"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        #Logs de consola para verificar
        print(f"Ejecutando código en {language}: {code}")
        return Response({"message": "Código recibido"}, status=status.HTTP_200_OK)