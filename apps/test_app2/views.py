from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import csv
from io import StringIO


@csrf_exempt  # Отключаем CSRF для упрощения (в продакшене лучше настроить токены)
def double_number(request):
    if request.method == "POST":
        try:
            # Получаем данные из тела запроса
            data = json.loads(request.body)
            fullName = data.get("fullName", 0)
            email = data.get("email", 0)
            phone = data.get("phone", 0)
            additionalInfo = data.get("additionalInfo", 0)
    
            ####print(f"Received data: {data}")

            # Создаем CSV в памяти
            csv_file = StringIO()
            csv_writer = csv.writer(csv_file)

            # Записываем заголовки и данные
            csv_writer.writerow(["Full Name", "Email", "Phone", "Additional Info"])
            csv_writer.writerow([fullName, email, phone, additionalInfo])

            # Сохраняем CSV в файл
            with open("output.csv", "w", encoding="utf-8") as f:
                f.write(csv_file.getvalue())

            result = "CSV file created successfully"

            # Возвращаем результат
            return JsonResponse({"result": result}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)
