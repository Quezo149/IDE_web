from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class CodeExecutionView(APIView):
    # Lo que se recibe en el POST request lo imprime la consola local
    def post(self, request, *args, **kwargs): #Obtenemos datos del frontend
        language = request.data.get('language')
        code = request.data.get('code')

        #Logs de consola para verificar
        print(f"Ejecutando código en {language}: {code}")
        return Response({"message": "Código recibido"}, status=status.HTTP_200_OK)