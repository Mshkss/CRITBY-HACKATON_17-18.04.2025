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
            responses = data.get("responses", {})
            # title = data.get("title", "")
            print("\n")
            # print("data app1 = ",data)
            # Формируем строку для замены
            items_text = ""
            for key, value in responses.items():
                # Если значение список, делаем join, иначе просто строка
                if isinstance(value, list):
                    # Если элементы списка - строки с запятыми, разбиваем их
                    values = []
                    for v in value:
                        if isinstance(v, str) and "," in v:
                            values.extend(v.split(","))
                        else:
                            values.append(v)
                    value_str = ", ".join(values)
                else:
                    value_str = str(value)
                items_text += f"{key}: {value_str}\n"

            print("itemss_text = ", items_text)
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

            # Заменяем %items% на весь входящий JSON в формате строки
            replaced = False
            # Преобразуем JSON в строку с отступами и убираем скобки
            json_text = "\n".join(
                f"{', '.join(value) if isinstance(value, list) else value}"
                for key, value in data.items()
            )
            for paragraph in doc.paragraphs:
                if "%items%" in paragraph.text and not replaced:
                    paragraph.text = paragraph.text.replace(
                        "%items%", json_text.strip()
                    )
                    replaced = True
                    break

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
