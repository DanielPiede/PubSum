import re
import boto3
import requests
from Bio import Entrez
import concurrent.futures
from datetime import datetime
import json
import xml.etree.ElementTree as ET

client = boto3.client('lambda')

def fetch_fulltext(pmcid):
    try:
        # URL of the API for fulltext
        api_url = f"https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_xml/{pmcid}/unicode"

        # Send a GET request to the API URL
        response = requests.get(api_url)

        # Check if the request was successful
        if response.status_code == 200:
            # Get the XML data from the response
            xml_data = response.content.decode("utf-8")
        else:
            # Print an error message if the request was not successful
            print(f"Failed to retrieve XML data for PMC ID {pmcid}. Error:", response.status_code)
            raise Exception("XML data retrieval failed")

        return pmcid, xml_data

    except Exception as e:
        print(f"Failed to retrieve XML data for PMC ID {pmcid}. Error:", e)
        return pmcid, None

def invoke_second_lambda(paper):
    response = client.invoke(
        FunctionName='arn:aws:lambda:ap-northeast-1:392491164501:function:retrieveSumTransl',
        InvocationType='RequestResponse',
        Payload=json.dumps({'fulltext': paper['fulltext']})
    )

    payload = json.loads(response['Payload'].read())
    if 'jpSum' in payload and 'enSum' in payload:
        paper['jpSum'] = payload['jpSum']
        paper['enSum'] = payload['enSum']

    return paper

def lambda_handler(event, context):
    full_set = event
    pmc_set = full_set[0:6] #reducing the number of elements for now to save API calls
    # Provide your email address to the Entrez API
    Entrez.email = 'your_email@example.com'

    fetch_handle = Entrez.efetch(db='pmc', id=pmc_set, rettype='json', retmode='text')

    output = fetch_handle.read()

    # Splitting the output into individual paper entries
    articles = output.split('\n\n')

    # Regular expression patterns for extracting information
    title_pattern = r'\d:\s+(.*?)\n'
    authors_pattern = r'\n(.*?)\n'
    date_pattern = r'Published online (\d{4} [A-Za-z]+ \d{1,2})\.'
    doi_pattern = r"doi:\xa0(\S+)"
    pmcid_pattern = r"PMCID: (\S+)"

    paper_list = []

    # Extracting the information from each paper
    for article in articles[:-1]:
        # dictionary for this paper
        paper = {}

        title_match = re.findall(title_pattern, article)
        paper['title'] = title_match[0] if title_match else None

        authors_match = re.findall(authors_pattern, article)
        paper['authors'] = authors_match[0] if authors_match else None

        date_match = re.findall(date_pattern, article)
        paper['date'] = date_match[0] if date_match else None

        if paper['date']:
            date_obj = datetime.strptime(paper['date'], '%Y %b %d')
            paper['date'] = date_obj.strftime('%Y/%m/%d')
        else:
            paper['date'] = '0000/00/00'

        doi_match = re.findall(doi_pattern, article)
        paper['doi'] = doi_match[0] if doi_match else None

        pmcid_match = re.findall(pmcid_pattern, article)
        paper['pmcid'] = pmcid_match[0] if pmcid_match else None
        paper['pdflink'] = f"https://www.ncbi.nlm.nih.gov/pmc/articles/{paper['pmcid']}/pdf"

        paper_list.append(paper)

    # Fetch full-text XML data in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        # Create a list of partial functions with pre-filled arguments for fetch_fulltext
        partial_fetch_fulltext = [
            (pmcid,)
            for pmcid in pmc_set
        ]

        # Submit the partial functions to the executor for execution
        results = executor.map(lambda args: fetch_fulltext(*args), partial_fetch_fulltext)

    # Merge the results from parallel execution
    for pmcid, xml_data in results:
        paper = next((paper for paper in paper_list if paper['pmcid'] == pmcid), None)
        if paper is not None:
            if xml_data is not None:
                root = ET.fromstring(xml_data, parser=ET.XMLParser(encoding="utf-8"))

                paragraphs = root.iter('passage')

                filtered_paragraphs = [
                    passage.find('text').text
                    for passage in paragraphs
                    if passage.find('infon[@key="type"]') is not None and passage.find('infon[@key="type"]').text == "paragraph"
                ]

                paper['fulltext'] = "\n".join(filtered_paragraphs)
            else:
                paper['fulltext'] = "N/A"

    # Invoke second Lambda for papers with fulltext
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        futures = []
        for paper in paper_list:
            futures.append(executor.submit(invoke_second_lambda, paper))

        concurrent.futures.wait(futures)

    # Sort the papers based on date (with None handled)
        json_response = {
        'papers': sorted([paper for paper in paper_list if paper.get('fulltext') != 'N/A'], key=lambda x: x['date'], reverse=True)
        
    }

    return json_response
