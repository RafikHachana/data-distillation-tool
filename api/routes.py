from flask import Blueprint, jsonify, request, send_from_directory, abort
from models import db, TaskHistory
from flasgger import swag_from
from datetime import datetime
from celery_tasks import pipeline_task
import uuid
import os

bp = Blueprint('api', __name__)


UPLOAD_FOLDER= "./uploads"
ALLOWED_EXTENSIONS = {'zip'}
# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/tasks', methods=['GET'])
@swag_from({
    'tags': ['Tasks'],
    'summary': 'Get task history summary',
    'description': 'Returns a summary of task history, including ID, name, distillation type, and task status.',
    'responses': {
        200: {
            'description': 'A list of tasks',
            'examples': {
                'application/json': [
                    {'id': 1, 'name': 'Task 1', 'distillation_type': 'image', 'task_status': 'done'},
                    {'id': 2, 'name': 'Task 2', 'distillation_type': 'text', 'task_status': 'distilling'}
                ]
            }
        }
    }
})
def get_tasks():
    tasks = TaskHistory.query.with_entities(TaskHistory.id, TaskHistory.name, TaskHistory.distillation_type, TaskHistory.task_status).all()

    res = [
        {
            "id": x.id,
            "name": x.name,
            "distillation_type": x.distillation_type,
            "task_status": x.task_status
        }
        for x in tasks
    ]
    return jsonify(res)

@bp.route('/tasks/<int:task_id>', methods=['GET'])
@swag_from({
    'tags': ['Tasks'],
    'summary': 'Get task details by ID',
    'description': 'Fetch detailed information about a task by its ID.',
    'parameters': [
        {
            'name': 'task_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The ID of the task'
        }
    ],
    'responses': {
        200: {
            'description': 'Task details',
            'examples': {
                'application/json': {
                    'id': 1,
                    'celery_task_id': 'task-uuid',
                    'name': 'Task 1',
                    'data_url': 'http://example.com/data',
                    'distillation_type': 'image',
                    'distillation_hyperparameters': [('param1', 'value1')],
                    'task_status': 'done',
                    'current_stage_percentage': 100,
                    'distilled_data_url': 'http://example.com/distilled_data',
                    'evaluation_plot_url': 'http://example.com/evaluation_plot',
                    'user_id': 1
                }
            }
        },
        404: {
            'description': 'Task not found'
        }
    }
})
def get_task(task_id):
    task = TaskHistory.query.get_or_404(task_id)
    return jsonify(task.serialize)

@bp.route('/tasks', methods=['POST'])
@swag_from({
    'tags': ['Tasks'],
    'summary': 'Add a new task',
    'description': 'Add a new task and trigger a Celery task.',
    'parameters': [
        {
            'name': 'task',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name': {'type': 'string'},
                    'data_url': {'type': 'string'},
                    'distillation_type': {'type': 'string', 'enum': ['image', 'text']},
                    'distillation_hyperparameters': {
                        'type': 'array',
                        'items': {'type': 'string'}
                    },
                    'user_id': {'type': 'integer'}
                },
                'required': ['name', 'data_url', 'distillation_type', 'distillation_hyperparameters', 'user_id']
            }
        }
    ],
    'responses': {
        201: {
            'description': 'Task created',
            'examples': {
                'application/json': {'message': 'Task added'}
            }
        },
        400: {
            'description': 'Invalid input data'
        }
    }
})
def add_task():
    body = request.json
    task = TaskHistory(
        celery_task_id=str(uuid.uuid4()),
        name=f"{body['distillation_type']}-distillation-{datetime.now().strftime('%d-%m@%H:%M')}",
        data_url="",
        distillation_type=body['distillation_type'],
        task_status="distilling",
        current_stage_percentage=0,
        distilled_data_url="/download-dataset/distilled_image_dataset" if body['distillation_type'] == 'image' else "/download-dataset/distilled_text_dataset",
        evaluation_plot_url="",
        user_id=body.get('user_id') or 1,
        distillation_hyperparameters=body['distillation_hyperparameters']
    )
    db.session.add(task)
    db.session.commit()


    buffer_args = {
        'model': 'ConvNet',
        'train_epochs': 1,
        'num_experts': 1,
        'zca': False,
        'buffer_path': '/path/to/buffer',
        'data_path': '/path/to/data',
        'dataset': 'CIFAR10'
    }

    distill_args = {
        'dataset': 'CIFAR10',
        'ipc': 1,
        'syn_steps': 1,
        'expert_epochs': 1,
        'max_start_epoch': 2,
        'zca': False,
        'lr_img': 1000,
        'lr_lr': 1e-05,
        'lr_teacher': 0.01,
        'buffer_path': 'cifar-10-buffer',
        'data_path': 'cifar-10-python'
    }

    # To execute the pipeline
    pipeline_task.delay(buffer_args, distill_args)

    return jsonify({'message': 'Task added', 'task_id': task.id}), 201

@bp.route('/tasks/status', methods=['PATCH'])
@swag_from({
    'summary': 'Update the status of a task',
    'description': 'This endpoint allows updating the status and current stage percentage of a task using its ID.',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {
                        'type': 'integer',
                        'description': 'The ID of the task to update'
                    },
                    'task_status': {
                        'type': 'string',
                        'description': 'The new status of the task'
                    },
                    'current_stage_percentage': {
                        'type': 'number',
                        'description': 'The percentage of the current stage completion'
                    }
                },
                'required': ['id', 'task_status', 'current_stage_percentage']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Task updated successfully',
            'examples': {
                'application/json': {
                    'message': 'Task updated'
                }
            }
        },
        400: {
            'description': 'Invalid request data',
            'examples': {
                'application/json': {
                    'error': 'Invalid data provided'
                }
            }
        },
        404: {
            'description': 'Task not found',
            'examples': {
                'application/json': {
                    'error': 'Task not found'
                }
            }
        }
    }
})
def update_task_status():
    body = request.json
    task = TaskHistory.query.get(body['id'])
    task.task_status = body['task_status']
    task.current_stage_percentage = body['current_stage_percentage']
    db.session.add(task)
    db.session.commit()
    return jsonify({'message': 'Task updated'}), 200


@bp.route('/upload-dataset/<string:task_id>', methods=['PUT'])
@swag_from({
    'summary': 'Upload a ZIP file with a specified ID',
    'description': 'Endpoint to upload a ZIP file. The file will be saved with a name based on the provided ID parameter.',
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'ID to use for naming the uploaded file.'
        },
        {
            'name': 'file',
            'in': 'formData',
            'type': 'file',
            'required': True,
            'description': 'The ZIP file to upload.'
        }
    ],
    'responses': {
        200: {
            'description': 'File uploaded successfully',
            'examples': {
                'application/json': {
                    'message': 'File uploaded successfully',
                    'filename': 'example_id.zip'
                }
            }
        },
        400: {
            'description': 'Invalid input or file type',
            'examples': {
                'application/json': {
                    'error': 'No file part in the request'
                }
            }
        }
    }
})
def upload_file(task_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = f"{task_id}.zip"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        return jsonify({"message": "File uploaded successfully", "filename": filename}), 200
    else:
        return jsonify({"error": "File is not a zip"}), 400
    
@bp.route('/download-dataset/<string:id>', methods=['GET'])
@swag_from({
    'summary': 'Download a ZIP file by ID',
    'description': 'Endpoint to download a previously uploaded ZIP file using the provided ID.',
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'ID of the file to download.'
        }
    ],
    'responses': {
        200: {
            'description': 'File downloaded successfully',
            'content': {
                'application/zip': {
                    'schema': {
                        'type': 'file'
                    }
                }
            }
        },
        404: {
            'description': 'File not found',
            'examples': {
                'application/json': {
                    'error': 'File not found'
                }
            }
        }
    }
})
def download_file(id):
    filename = f"{id}.zip"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(filepath):
        return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)
    else:
        return jsonify({"error": "File not found"}), 404

@bp.route('/hyperparameters', methods=['GET'])
@swag_from({
    'tags': ['Hyperparameters'],
    'summary': 'Get hyperparameters for different distillation types',
    'description': 'Retrieve a list of hyperparameters available for image and text distillation types. Each category includes hyperparameter names mapped to their possible values.',
    'responses': {
        200: {
            'description': 'A dictionary of hyperparameters categorized by distillation type',
            'examples': {
                'application/json': {
                    "image": {
                        "param1": ["value1", "value2"],
                        "param2": ["value1", "value2", "value3"]
                    },
                    "text": {
                        "param1": ["value1", "value2"],
                        "param2": ["value1", "value2", "value3"]
                    }
                }
            }
        }
    }
})
def get_hyperparameters():
    hyperparameters = {
        "image": {
            # Buffer part
            "zca": ["True", "False"],
            "model": ["ConvNet", "ResNet18", "VGG11"],
            "train_epochs": [1, 5, 25, 100],
            "num_experts": [1, 5, 50],

            # Distillation part
            "ipc": [1, 2, 5, 20],
            "syn_steps": [1, 5, 10],
            "expert_epochs": [1, 5, 25],
            "max_start_epoch": [1, 5, 20],
            "lr_img": [500, 1000, 2000],
            "lr_teacher": [0.001, 0.01, 0.05],
        },
        "text": {
            "param1": ["value1", "value2"],
            "param2": ["value1", "value2", "value3"]
        }
    }
    return jsonify(hyperparameters)

@bp.route('/login', methods=['POST'])
@swag_from({
    'tags': ['Auth'],
    'summary': 'User login',
    'description': 'Authenticate a user based on a list of hardcoded credentials.',
    'parameters': [
        {
            'name': 'credentials',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'username': {'type': 'string'},
                    'password': {'type': 'string'}
                },
                'required': ['username', 'password']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'User authenticated',
            'examples': {
                'application/json': {'message': 'Logged in'}
            }
        },
        401: {
            'description': 'Invalid credentials'
        }
    }
})
def login():
    # Simple login check against hardcoded users
    return jsonify({'message': 'Logged in'})
