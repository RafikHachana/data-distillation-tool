from celery import Celery
import subprocess
import shlex
import os
import time
import random
import flask
import requests
root_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "image_distillation")

from celery_app import celery_app

from celery import shared_task, chain
import subprocess
import shlex
from models import TaskHistory, db

@celery_app.task(bind=True)
def run_buffer_script(self, model, train_epochs, num_experts, zca, buffer_path, data_path, dataset):
    """
    Execute the buffer.py script with specified parameters.
    
    Args:
        model (str): Model type, e.g., "ConvNet".
        train_epochs (int): Number of training epochs.
        num_experts (int): Number of experts.
        zca (bool): Whether to apply ZCA whitening.
        buffer_path (str): Path to the buffer.
        data_path (str): Path to the dataset.
        dataset (str): Dataset name, e.g., "CIFAR10".

    Returns:
        dict: A dictionary containing 'stdout', 'stderr', and 'returncode'.
    """
    command = f"conda activate distillation && python3 buffer.py --model={model} --train_epochs={train_epochs} --num_experts={num_experts}"

    conda_env_name = "distillation"  # Change this to your environment name
    command = f"conda run -n {conda_env_name} python3 buffer.py --model={model} --train_epochs={train_epochs} --num_experts={num_experts}"
    if zca:
        command += " --zca"
    command += f" --buffer_path={buffer_path} --data_path={data_path} --dataset={dataset}"

    
    try:
        # args = shlex.split(f'bash -il -c "{command}"')
        args = shlex.split(command)
        os.chdir(root_dir)
        result = subprocess.run(args, capture_output=True, text=True)
        return {
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode,
        }
    except subprocess.CalledProcessError as e:
        return {
            'stdout': e.stdout,
            'stderr': e.stderr,
            'returncode': e.returncode,
        }
    except Exception as e:
        return {
            'stdout': '',
            'stderr': str(e),
            'returncode': -1,
        }
    

@celery_app.task
def run_distill_script(previous_output, dataset, ipc, syn_steps, expert_epochs, max_start_epoch, zca, lr_img, lr_lr, lr_teacher, buffer_path, data_path):
    conda_env_name = "distillation"
    command = f"conda run -n {conda_env_name} python3 distill.py --dataset={dataset} --ipc={ipc} --syn_steps={syn_steps} --expert_epochs={expert_epochs} --max_start_epoch={max_start_epoch}"
    
    if zca:
        command += " --zca"
    command += f" --lr_img={lr_img} --lr_lr={lr_lr} --lr_teacher={lr_teacher} --buffer_path={buffer_path} --data_path={data_path}"

    try:
        args = shlex.split(command)
        os.chdir(root_dir)
        result = subprocess.run(args, capture_output=True, text=True)
        return {
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode,
        }
    except subprocess.CalledProcessError as e:
        return {
            'stdout': e.stdout,
            'stderr': e.stderr,
            'returncode': e.returncode,
        }
    except Exception as e:
        return {
            'stdout': '',
            'stderr': str(e),
            'returncode': -1,
        }

@celery_app.task
def pipeline_task(buffer_args, distill_args):
    """
    Run the buffer and distill scripts in sequence.
    
    Args:
        buffer_args (dict): Arguments for the buffer script.
        distill_args (dict): Arguments for the distill script.

    Returns:
        list: A list containing the results of both tasks.
    """
    task_chain = chain(
        run_buffer_script.s(**buffer_args),
        run_distill_script.s(**distill_args)
    )
    result = task_chain.apply_async()
    return result



@shared_task
def run_cnn_classifier(mode, dataset, save_model, early_stopping, epoch, learning_rate, no_cuda):
    """
    Execute the CNN classifier script with specified parameters.
    
    Args:
        mode (str): Mode of operation, "train" or "test".
        dataset (str): Dataset name, e.g., "TREC".
        save_model (bool): Whether to save the model.
        early_stopping (bool): Whether to apply early stopping.
        epoch (int): Number of max epochs.
        learning_rate (float): Learning rate.
        no_cuda (bool): Disable CUDA training.

    Returns:
        dict: A dictionary containing 'stdout', 'stderr', and 'returncode'.
    """
    command = f"python3 cnn_classifier.py --mode={mode} --dataset={dataset}"
    if save_model:
        command += " --save_model"
    if early_stopping:
        command += " --early_stopping"
    command += f" --epoch={epoch} --learning_rate={learning_rate}"
    if no_cuda:
        command += " --no-cuda"
    
    try:
        args = shlex.split(command)
        result = subprocess.run(args, capture_output=True, text=True)
        return {
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode,
        }
    except subprocess.CalledProcessError as e:
        return {
            'stdout': e.stdout,
            'stderr': e.stderr,
            'returncode': e.returncode,
        }
    except Exception as e:
        return {
            'stdout': '',
            'stderr': str(e),
            'returncode': -1,
        }
