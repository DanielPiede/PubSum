import boto3
import requests
import random
import io

def lambda_handler(event, context):
    userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/114.0",
        "Mozilla/5.0 (Windows NT 10.0; rv:114.0) Gecko/20100101 Firefox/114.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
        "Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 OPR/99.0.0.0",
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0"
    ]

    pmc_ids = event['pmc_ids']
    s3_client = boto3.client('s3', region_name='ap-northeast-2')
    textract_client = boto3.client('textract', region_name='ap-northeast-2')

    extracted_text = []

    for pmc_id in pmc_ids:
        headers = {"User-Agent": random.choice(userAgents)}

        session = requests.Session()
        session.headers.update(headers)
        try:
            url = f"https://www.ncbi.nlm.nih.gov/pmc/articles/{pmc_id}/pdf"
            response = session.get(url, stream=True)
            response.raise_for_status()  # Raise an exception if the request was not successful
    
            pdf_content = response.content
    
        except Exception as e:
            print(f"Error occurred while processing PDF: {str(e)}")
            extracted_text.append({
                'pmc_id': pmc_id,
                'text': 'N/A'
            })
            continue
        
        # Generate a unique S3 object key
        s3_object_key = f"pmc_{pmc_id}.pdf"
        
        # Check if the PDF already exists in S3
        try:
            s3_client.head_object(Bucket='pubmed-repository-ap-2', Key=s3_object_key)
            print(f"PDF already exists in S3. Skipping download for pmc_id: {pmc_id}")
        except:
            # Upload the PDF content to S3
            s3_client.put_object(
                Body=pdf_content,
                Bucket='pubmed-repository-ap-2',
                Key=s3_object_key
            )
        
        # Start text extraction job with Textract
        response = textract_client.start_document_text_detection(
            DocumentLocation={
                'S3Object': {
                    'Bucket': 'pubmed-pdf-repository',
                    'Name': s3_object_key
                }
            }
        )
        
        # Get the job ID for the started Textract job
        job_id = response['JobId']
    
        # Wait for the Textract job to complete
        textract_client.get_waiter('text_detection_completed').wait(JobId=job_id)
    
        # Retrieve the result of the completed Textract job
        response = textract_client.get_document_text_detection(JobId=job_id)
    
        # Extract the raw text from Textract response
        raw_text = ""
        for item in response['Blocks']:
            if item['BlockType'] == 'LINE':
                raw_text += item['Text'] + "\n"
    
        extracted_text.append({
            'pmc_id': pmc_id,
            'text': raw_text
        })
    
    return {
        'statusCode': 200,
        'body': {
            'extracted_text': extracted_text
        }
    }
