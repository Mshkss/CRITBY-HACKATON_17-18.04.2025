from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt  # Отключаем CSRF для упрощения (в продакшене лучше настроить токены)
def double_number(request):
    if request.method == "POST":
        try:
            # Получаем данные из тела запроса
            data = json.loads(request.body)
            number = data.get("number", 0)

            # Умножаем число на 2
            result = number * 2
            # Возвращаем результат
            return JsonResponse({"result": result}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)