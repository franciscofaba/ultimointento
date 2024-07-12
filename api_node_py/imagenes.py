from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import time
import torch
import cv2
import torch.backends.cudnn as cudnn
from PIL import Image
import numpy as np
from ultralytics import YOLO
import shutil  # Importa shutil para manejar operaciones de archivo
# Importar más dependencias según tu código original...

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "C:\\Users\\OMEN\\Pictures\\Saved Pictures"
PROCESSED_FOLDER = "C:\\Users\\OMEN\\Pictures\\Screenshots\\output"  # Directorio para guardar las imágenes procesadas
PROCESSED_FOLDER_PREDICT = "C:\\Users\\OMEN\\Pictures\\Screenshots\\output\\predict"  # Directorio para guardar las imágenes procesadas
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(PROCESSED_FOLDER):
    os.makedirs(PROCESSED_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['PROCESSED_FOLDER_PREDICT'] = PROCESSED_FOLDER_PREDICT

# Cargar el modelo YOLOv8
model = YOLO("yolov8m.pt")

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        count = 0
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        predict_folder = os.path.join(app.config['PROCESSED_FOLDER'], 'predict')
        if os.path.exists(predict_folder):
            shutil.rmtree(predict_folder)  # Elimina la carpeta
        # Procesar imagen con el modelo
        results = model(file_path, save=True, project=app.config['PROCESSED_FOLDER'])

        # La ruta procesada será siempre la misma
        processed_file_path = os.path.join(predict_folder, filename)
        for result in results:
            boxes = result.boxes  # Boxes object for bbox outputs
            cls = boxes.cls.tolist()  # Convert tensor to list
            print(cls)
            for class_index in cls:
                if class_index==0:
                    count+=1
        print(count)        

             

        return jsonify({
            'message': 'File uploaded and processed successfully',
            'file_path': file_path,
            'processed_file_path': filename,
            'face_count': count
        }), 200
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['PROCESSED_FOLDER_PREDICT'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5001)