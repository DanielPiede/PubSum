import json
import boto3
import requests
from bs4 import BeautifulSoup

client = boto3.client('lambda')

def lambda_handler(event, context):
    search_term = event['search']

    url = f"https://www.ncbi.nlm.nih.gov/pmc/?term={search_term}"

    # Send a GET request to the URL
    response = requests.get(url)

    # Create a BeautifulSoup object to parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all the "dd" elements
    dd_elements = soup.find_all("dd")

    pmc_ids = []

    # Iterate over each "dd" element
    for dd in dd_elements:
        # Check if the text starts with "PMC"
        if dd.text.startswith("PMC"):
            # Remove the "<dd>" and "</dd>" tags and append the PMC ID
            pmc_id = dd.text.replace("<dd>", "").replace("</dd>", "").strip()
            pmc_ids.append(pmc_id)

    response = client.invoke(
        FunctionName="arn:aws:lambda:ap-northeast-1:392491164501:function:retrieveMetaFullText",
        InvocationType="RequestResponse",
        Payload=json.dumps(pmc_ids),
    )

    response_payload = response["Payload"].read().decode('utf-8')

    return {
        "statusCode": 200,
        "body": response_payload
    }
