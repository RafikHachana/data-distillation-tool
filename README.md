# Universal Data Distillation

This project offers a Data Distillation SaaS which supports 2 methods for Dataset Distillation, for image and text datasets respectively.

![Homepage](homepage.png)
## Local Setup Guide

### Setup the conda environments for the data distillers

In each of the directories `text_distillation` and `image_distillation` , create a Conda environment with the name of the directory, you can use the `environment.yml` or `requirements.txt` file in the directory to get all the requirements. These environments are necessary for Celery to run the distillation in the background.

### Set up the Backend API

1. Setup a postgres database locally using Docker

   ```bash
   docker run -d --name data-distiller -e POSTGRES_PASSWORD=mysecretpassword -p 127.0.0.1:5432:5432 postgres:14-alpine
   ```

2. Create a custom database inside postgres for the API (Optional)

   ```bash
   psql postgresql://postgres:mysecretpassword@localhost:5432
   
   # Then inside PSQL
   psql> CREATE DATABASE distiller;
   ```

   

3. Spin up a Redis instance using Docker 

   ```bash
   docker run --name redis-db --net=host -d redis
   ```

   

4. Create a virtual environment for the API and install requirements

   ```bash
   cd api
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. Make sure to put the correct URI for the postgres database and the Redis backend, the `api/config.py` file.

6. Create all the database tables

   ```bash
   python3 api/create_db_tables.py
   ```

7. Run the Flask API

   ```
   python3 api/run.py
   ```

8. Run the Celery background task worker

   ```bash
   cd api && celery -A celery_worker worker -l info --concurrency=3
   ```

9. Access the API documentation at the `/redoc` endpoint to read about the endpoints and what they do.
![API Docs](docs.png)
### Run the frontend UI

1. Install the dependencies

```bash
npm install
```

2. Make sure to put the right API base URL in the `.env` file.

3. Run the dev server

```bash
npm run dev
```

