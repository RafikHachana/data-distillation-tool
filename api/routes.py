from flask import Blueprint, jsonify, request
from models import db, TaskHistory
from celery import Celery
from flasgger import swag_from

bp = Blueprint('api', __name__)

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
    return jsonify(tasks)

@bp.route('/task/<int:task_id>', methods=['GET'])
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
    return jsonify(task)

@bp.route('/task', methods=['POST'])
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
    # Add logic for adding a task
    return jsonify({'message': 'Task added'}), 201

@bp.route('/hyperparameters', methods=['GET'])
@swag_from({
    'tags': ['Hyperparameters'],
    'summary': 'Get hyperparameters',
    'description': 'Retrieve a list of hardcoded hyperparameters.',
    'responses': {
        200: {
            'description': 'A list of hyperparameters',
            'examples': {
                'application/json': [("param1", "value1"), ("param2", "value2")]
            }
        }
    }
})
def get_hyperparameters():
    hyperparameters = [("param1", "value1"), ("param2", "value2")]
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

# Setup Celery
celery = Celery(__name__, broker='redis://localhost:6379/0')

@celery.task
def example_celery_task(task_id):
    # Task logic
    pass
