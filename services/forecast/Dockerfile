FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
# Trained parameters persist here; mounted as a volume in docker-compose.
RUN mkdir -p /app/artifacts
ENV FORECAST_ARTIFACTS=/app/artifacts

EXPOSE 8200
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8200"]
