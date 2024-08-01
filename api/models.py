from app import db
from sqlalchemy.dialects.postgresql import ENUM, ARRAY

class TaskHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    celery_task_id = db.Column(db.String(36), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    data_url = db.Column(db.String(255), nullable=False)
    distillation_type = db.Column(ENUM('image', 'text', name='distillation_types'), nullable=False)
    distillation_hyperparameters = db.Column(ARRAY(db.String), nullable=False)
    task_status = db.Column(ENUM('uploading', 'distilling', 'evaluating', 'done', name='task_statuses'), nullable=False)
    current_stage_percentage = db.Column(db.Integer, nullable=False)
    distilled_data_url = db.Column(db.String(255))
    evaluation_plot_url = db.Column(db.String(255))
    user_id = db.Column(db.Integer, nullable=False)

    @property
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "distillation_type": self.distillation_type,
            "task_status": self.task_status,
            "celery_task_id": self.celery_task_id,
            "data_url": self.data_url,
            "distillation_hyperparameters": self.distillation_hyperparameters,
            "current_stage_percentage": self.current_stage_percentage,
            "evaluation_plot_url": self.evaluation_plot_url,
            "distilled_data_url": self.distilled_data_url,
            "user_id": self.user_id
        }
