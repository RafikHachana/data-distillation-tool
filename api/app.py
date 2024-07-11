import os
from flask import Flask, request, jsonify
from celery import Celery
import subprocess

app = Flask(__name__)

# Configure Celery
app.config['CELERY_BROKER_URL'] = os.getenv('CELERY_BROKER_URL', 'amqp://rabbitmq')
app.config['CELERY_RESULT_BACKEND'] = os.getenv('CELERY_RESULT_BACKEND', 'rpc://')

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

@celery.task
def launch_distillation_task(dataset, dataset_type):
    """
    Celery task to launch the distillation process based on dataset type.
    """
    if dataset_type == "image":
        command = f"python3 examples/distillation_cnn.py --dataset {dataset} --net-t resnet110 --net-s resnet20 --path-t ./save/models"
    elif dataset_type == "text":
        command = f"python3 examples/text_distill.py --mode train --dataset {dataset} --save_model --early_stopping --epoch 100 --learning_rate 1.0 --no-cuda"
    else:
        raise ValueError("Invalid dataset_type. Must be 'image' or 'text'.")
    
    subprocess.run(command, shell=True, check=True)
    return {"status": "Distillation process completed successfully"}

@app.route('/distill', methods=['POST'])
def distill():
    """
    API endpoint to start the distillation process.
    """
    data = request.json
    dataset = data.get('dataset')
    dataset_type = data.get('dataset_type')
    
    if not dataset:
        return jsonify({"error": "Missing 'dataset' parameter"}), 400
    if dataset_type not in ['image', 'text']:
        return jsonify({"error": "Invalid 'dataset_type' parameter"}), 400

    task = launch_distillation_task.apply_async(args=[dataset, dataset_type])
    return jsonify({"task_id": task.id}), 202

@app.route('/status/<task_id>', methods=['GET'])
def task_status(task_id):
    """
    API endpoint to check the status of a Celery task.
    """
    task = launch_distillation_task.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'status': task.info.get('status', ''),
        }
        if 'result' in task.info:
            response['result'] = task.info['result']
    else:
        # Something went wrong in the background job
        response = {
            'state': task.state,
            'status': str(task.info),  # This is the exception raised
        }
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
