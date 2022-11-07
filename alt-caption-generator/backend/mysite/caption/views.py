from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from transformers import VisionEncoderDecoderModel, ViTFeatureExtractor, AutoTokenizer
import requests
from PIL import Image
import torch
from io import BytesIO

@csrf_exempt
def index(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    url = body['url']
    
    model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
    feature_extractor = ViTFeatureExtractor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
    tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    max_length = 16
    num_beams = 4
    gen_kwargs = {"max_length": max_length, "num_beams": num_beams}

    response = requests.get(url)
    i_image = Image.open(BytesIO(response.content))

    if i_image.mode != "RGB":
      i_image = i_image.convert(mode="RGB")
    images = [i_image]

    pixel_values = feature_extractor(images=images, return_tensors="pt").pixel_values
    pixel_values = pixel_values.to(device)

    output_ids = model.generate(pixel_values, **gen_kwargs)

    preds = tokenizer.batch_decode(output_ids, skip_special_tokens=True)
    preds = [pred.strip() for pred in preds]
    
    return HttpResponse(preds)