from django.urls import path
from .views import predict_student_performance, prediction_history

urlpatterns = [
    # POST /api/predict/          → run AI prediction for a student
    path('predict/', predict_student_performance, name='predict'),

    # GET  /api/predict/history/  → view past predictions
    path('predict/history/', prediction_history, name='predict-history'),
]
