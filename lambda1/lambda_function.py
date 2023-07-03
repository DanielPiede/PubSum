import re
import requests
from Bio import Entrez
from bs4 import BeautifulSoup
import boto3
from datetime import datetime

# client = boto3.client('lambda')

def lambda_handler(event, context):
    url = f"https://www.ncbi.nlm.nih.gov/pmc/?term={event['search']}"

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
            pmc_set = set(pmc_ids)

    # Provide your email address to the Entrez API
    Entrez.email = 'your_email@example.com'

    fetch_handle = Entrez.efetch(db='pmc', id=pmc_set, rettype='json', retmode='text')

    output = fetch_handle.read()

    # Splitting the output into individual paper entries
    articles = output.split('\n\n')

    # Regular expression patterns for extracting information
    title_pattern = r'\d+: (.*?)[\n,.]'
    authors_pattern = r'\n(.*?)\n'
    date_pattern = r'Published online (\d{4} [A-Za-z]+ \d{1,2})\.'
    doi_pattern = r"doi:\xa0(\S+)"
    pmcid_pattern = r"PMCID: (\S+)"
    
    paper_list = []

    # Extracting the information from each paper
    for article in articles[:-1]:  # Exclude the last empty element
        
        #dictionary for this paper:
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
            paper['date'] = '0000/00/00'  # Assign a default value for sorting
        
        doi_match = re.findall(doi_pattern, article)
        paper['doi'] = doi_match[0] if doi_match else None
        
        pmcid_match = re.findall(pmcid_pattern, article)
        paper['pmcid'] = pmcid_match[0] if pmcid_match else None
        paper['pdflink'] = f"https://www.ncbi.nlm.nih.gov/pmc/articles/{paper['pmcid']}/pdf"

        paper_list.append(paper)
        
    json_response = {
        'statusCode': 200,
        'body': {
            'papers': sorted(paper_list, key=lambda x: x['date'], reverse=True)
        }
    }
    return json_response
