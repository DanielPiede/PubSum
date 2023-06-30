import json
import requests
import xml.etree.ElementTree as ET
from crossref.restful import Works

def lambda_handler(event, context):
    
    base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
    api_url = base_url + "esearch.fcgi"
    params = {
        "db": "pubmed",
        "retmode": "xml",
        "retmax": 5,  # Number of papers to retrieve (adjust as needed)
        "term": event['search'],  # Modify the search query to match your needs
        "sort": "pub+date"
    }
    
    response = requests.get(api_url, params=params)
    if response.status_code == 200:
        xml_content = response.content
        root = ET.fromstring(xml_content)
        pubmed_ids = [id_node.text for id_node in root.findall(".//Id")]
        
        url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={','.join(pubmed_ids)}&rettype=xml"
        doi_response = requests.get(url)
        records = doi_response.content
    
        # Parse the XML records
        root = ET.fromstring(records)
    
        # List to store dictionaries
        pubmed_list = []
    
        # Find the relevant elements and extract their text
        for pubmed_article in root.findall(".//PubmedArticle"):
            # Dictionary to store the information
            pubmed_dict = {}
    
            # Extract title
            title_element = pubmed_article.find(".//ArticleTitle")
            pubmed_dict["Title"] = title_element.text if title_element is not None else "N/A"
    
            # Extract detailed date or fallback to year
            pub_date_element = pubmed_article.find(".//ArticleDate")
            if pub_date_element is not None:
                year_element = pub_date_element.find("Year")
                year = year_element.text if year_element is not None else "N/A"
    
                month_element = pub_date_element.find("Month")
                month = month_element.text if month_element is not None else "N/A"
    
                day_element = pub_date_element.find("Day")
                day = day_element.text if day_element is not None else "N/A"
    
                # Combine the detailed date components
                pubmed_dict["Date"] = f"{day}/{month}/{year}"
            else:
                # Fallback to year if detailed date is not available
                year_element = pubmed_article.find(".//PubDate/Year")
                pubmed_dict["Date"] = year_element.text if year_element is not None else "N/A"
    
            # Extract DOI
            doi_element = pubmed_article.find(".//ArticleId[@IdType='doi']")
            if doi_element is not None:
                pubmed_dict["DOI"] = doi_element.text
                # create object and call API for fullText link using DOI
                works = Works()
                textLink = works.doi(doi_element.text)
                
                # If there is not link to the fulltext, N/A
                if textLink['link'][0]['URL'] is not None:
                    pubmed_dict["fullText"] = textLink['link'][0]['URL']
                else:
                    pubmed_dict["fullText"] = "N/A"
                    
            else:
                pubmed_dict["DOI"] = "N/A"
            # Append the dictionary to the list
            pubmed_list.append(pubmed_dict)

        # send JSON back
        json_response = {
            'statusCode': 200,
            'body': {
                'papers': pubmed_list
            }
        }

        return json_response

    else:
        return {
            'statusCode': 500
        }