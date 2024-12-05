import requests
import json

# URL del endpoint para obtener el token JWT
TOKEN_URL = 'http://192.168.1.97:8000/auth/jwt/create/'

# URL de la API protegida a la que enviarás datos
SEND_DATA_URL = 'http://192.168.1.97:8000/api/inventory-movements/'


def obtener_token(username, password):
    """
    Función para obtener el token JWT desde el backend de Django
    :param username: Nombre de usuario
    :param password: Contraseña del usuario
    :return: Diccionario con el 'access' y 'refresh' tokens, o None si hay un error
    """
    data = {
        'username': username,
        'password': password
    }

    # Hacer la solicitud POST para obtener el token
    response = requests.post(TOKEN_URL, data=data)

    if response.status_code == 200:
        # Si la respuesta es exitosa, devolver los tokens
        return response.json()
    else:
        # Si hubo un error, mostrar el mensaje
        print(f"Error al obtener el token: {response.status_code}")
        print(response.text)
        return None


def enviar_datos_con_token(username, password, datos):
    """
    Función para enviar datos JSON a una API protegida usando un token JWT
    :param username: Nombre de usuario
    :param password: Contraseña del usuario
    :param datos: Datos a enviar en formato JSON
    :return: La respuesta de la API, o None si ocurre un error
    """
    # Obtener el token
    tokens = obtener_token(username, password)

    if tokens:
        access_token = tokens.get('access')

        # Definir los encabezados de la solicitud con el token JWT
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'  # Indicamos que vamos a enviar JSON
        }

        # Convertir los datos a JSON (si no es un diccionario ya)
        json_data = json.dumps(datos)

        # Realizar la solicitud POST con los datos en formato JSON
        response = requests.post(SEND_DATA_URL, headers=headers, data=json_data)

        if response.status_code == 201:
            # Si la solicitud fue exitosa, devolver la respuesta
            return response.json()
        else:
            print(f"Error al enviar los datos: {response.status_code}")
            print(response.text)
            return None
    else:
        print("No se pudo obtener el token, no se pueden enviar los datos.")
        return None

def obtener_id_por_string(nombre: str) -> int:
    # Mapeo de nombres a IDs
    mapeo = {
        'Desodorante(OldSpice)': 1,
        'CremaHinds': 2,
        'Shampoo': 3,
        'Sedal': 4,
        'Bolsa Navidad': 5
    }

    # Devolver el ID correspondiente o un mensaje si el nombre no está en el mapeo
    return mapeo.get(nombre, -1)  # -1 es el valor por defecto si el nombre no está en el diccionario
