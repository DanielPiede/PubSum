import textract
import requests

def lambda_handler(event, context):
    full_text_url = event['fullTextUrl']
    
    try:
        response = requests.get(full_text_url)
        response.raise_for_status()  # Check for any request errors

        # Extract text from the PDF
        text = textract.process(response.content, method='pdfminer').decode('utf-8')

        # Prepare the JSON response
        json_response = {
            'statusCode': 200,
            'body': {
                'fullText': text.strip()
            }
        }
    except requests.exceptions.RequestException as e:
        print(f"Error retrieving full text for URL: {full_text_url}")
        print(str(e))
        # Prepare an error response
        json_response = {
            'statusCode': 500,
            'body': {
                'error': f"Error retrieving full text for URL: {full_text_url}"
            }
        }
    except textract.exceptions.MissingFileError:
        print(f"PDF file not found for URL: {full_text_url}")
        # Prepare an error response
        json_response = {
            'statusCode': 404,
            'body': {
                'error': f"PDF file not found for URL: {full_text_url}"
            }
        }
    
    return json_response
