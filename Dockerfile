FROM python:3.12-slim

WORKDIR /app
COPY pyproject.toml requirements.txt ./
RUN pip install --no-cache-dir fastapi uvicorn pydantic

COPY src ./src
COPY data ./data

ENV PYTHONPATH=/app/src
ENV CORPUS_DIR=/app/data/corpus
EXPOSE 8000
CMD ["uvicorn", "discovery.api:app", "--host", "0.0.0.0", "--port", "8000"]
