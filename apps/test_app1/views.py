from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from docx import Document
import json
import io
from django.conf import settings
import os


@csrf_exempt
def generate_docx(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            items = data.get("items", [])
            title = data.get("title", "")
            print(items, title)
            # Формируем строку для замены
            items_text = ""
            for item in items:
                items_text += f"{item['name']}:\n"
                for component in item["components"]:
                    items_text += f"  - {component}\n"
                items_text += "\n"

            # Создаем документ из шаблона
            template_path = os.path.join(
                settings.BASE_DIR,
                "apps",
                "test_app1",
                "templates",
                "test_app1",
                "doc_temp.docx",
            )
            doc = Document(template_path)

            # Заменяем %items% на items_text
            for paragraph in doc.paragraphs:
                if "%items%" in paragraph.text:
                    paragraph.text = paragraph.text.replace(
                        "%items%", items_text.strip()
                    )

            # Сохраняем в память и возвращаем файл
            buffer = io.BytesIO()
            doc.save(buffer)
            buffer.seek(0)
            response = HttpResponse(
                buffer.read(),
                content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
            response["Content-Disposition"] = "attachment; filename=output.docx"
            return response

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)
