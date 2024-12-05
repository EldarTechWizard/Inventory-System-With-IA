# Importamos las librerías
from ultralytics import YOLO
import cv2
import time
import tkinter as tk
from tkinter import messagebox
from HttpMain import enviar_datos_con_token, obtener_id_por_string


 #Configuración de MessageBox
def show_message(title, message):
    root = tk.Tk()
    root.withdraw()
    messagebox.showinfo(title, message)
    root.destroy()


username = "Admin"
password = "Response123"
# Leer nuestro modelo
model = YOLO("Model.pt")

# Realizar VideoCaptura
cap = cv2.VideoCapture(0)

# Variables para seguimiento
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))  # Ancho de la cámara
middle_line = width // 2  # Línea divisoria de entrada/salida
last_seen_time = {}  # Última vez que se vio cada producto
direction_log = {}  # Última dirección conocida de cada producto (entrada o salida)
disappear_threshold = 3  # Tiempo de desaparición para confirmar movimiento (en segundos)

# Bucle
while True:
    # Leer nuestros fotogramas
    ret, frame = cap.read()
    if not ret:
        break

    # Leemos resultados de detección
    resultados = model.predict(frame, imgsz=640, conf=0.40)

    # Obtener el tiempo actual
    current_time = time.time()

    # Lista de productos detectados en este cuadro
    detected_products = set()

    for box in resultados[0].boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])  # Coordenadas de la caja
        center_x = (x1 + x2) // 2  # Centro en X
        product_name = box.cls  # Extraemos la etiqueta de la clase detectada
        if product_name is not None:
            product_name = model.names[int(product_name)]  # Obtener el nombre de la etiqueta
            detected_products.add(product_name)  # Agregar producto a la lista de detectados

        # Determinar si está en la mitad derecha (entrada) o izquierda (salida)
        if center_x > middle_line:
            direction_log[product_name] = "IN"
        else:
            direction_log[product_name] = "OUT"

        # Actualizar la última vez que se vio el producto
        last_seen_time[product_name] = current_time

    # Mostrar los productos detectados en este cuadro, si hay alguno
    if detected_products:
        products_list = ", ".join(detected_products)
       ## show_message("Productos Detectados", f"Productos en pantalla: {products_list}")

    # Comprobar productos que ya no están presentes
    for product in list(last_seen_time.keys()):
        if product not in detected_products:
            # Si el producto ha desaparecido por más de 'disappear_threshold' segundos
            if current_time - last_seen_time[product] > disappear_threshold:
                # Confirmar movimiento final del producto
                direction = direction_log.get(product, "desconocido")
               # show_message("Movimiento Detectado", f"{direction.capitalize()}: {product}")
                id=obtener_id_por_string(product)
                datos_a_enviar = {
                    'product': id,
                    'quantity': 1,
                    'movement_type': direction,
                    'remarks': 'Enviado desde la IA'
                }
                print(datos_a_enviar)
                resultado = enviar_datos_con_token(username, password, datos_a_enviar)
                print(f"Resultado de enviar datos: {resultado}")
                # Eliminar de los registros una vez que se muestra el mensaje
                del last_seen_time[product]
                del direction_log[product]

    # Mostrar resultados de anotación
    anotaciones = resultados[0].plot()
    cv2.imshow("DETECCION", anotaciones)

    # Cerrar el programa al presionar Esc
    if cv2.waitKey(1) == 27:
        break

# Liberamos el recurso de la cámara y cerramos ventanas
cap.release()
cv2.destroyAllWindows()
