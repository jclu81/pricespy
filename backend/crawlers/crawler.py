import requests
import os

import random
from lxml import html

from traceback import format_exc

import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'services'))

import yaml

with open(os.path.join(os.path.dirname(__file__), '..', 'config.yaml'), 'r') as configFile:
    cfg = yaml.load(configFile)

import mongodb_client

OFFERS_TABLE_NAME = cfg['mongodb']['offers_table_name']

# load user_agent.txt
USER_AGENT_FILE = os.path.join(os.path.dirname(__file__), 'user_agents.txt')
USER_AGENTS = []
WEBSITES_LIST = ['eBay', 'Amazon']

with open(USER_AGENT_FILE, 'r') as uaf:
    for ua in uaf.readlines():
        if ua:
            USER_AGENTS.append(ua.strip()[1:-1])
random.shuffle(USER_AGENTS)


# get a random user-agent header from USER_AGENTS
def getHeaders():
    ua = random.choice(USER_AGENTS)
    headers = {
        "Connection": "close",
        "User-Agent": ua
    }
    return headers


def fetchByKeywords(keywords, source, extracted_data):
    while True:
        try:
            url = cfg[source]['search_url'].format(keywords)
            session_requests = requests.session()
            response = session_requests.get(url, headers=getHeaders())
            doc = html.fromstring(response.content)

            product_list = doc.xpath(cfg[source]['list'])

            for product in product_list:
                raw_detail_url = product.xpath(cfg[source]['detail_url'])
                raw_title = product.xpath(cfg[source]['title'])
                raw_price = product.xpath(cfg[source]['price'])
                raw_image = product.xpath(cfg[source]['image'])

                if len(raw_detail_url) == 0 or len(raw_title) == 0 or len(raw_price) == 0 or len(raw_image) == 0:
                    continue
                url = ' '.join(' '.join(raw_detail_url).split())
                # may exist duplicate price in eBay
                price = ' '.join(' '.join(raw_price[0:1]).split())
                title = ' '.join(' '.join(raw_title).split())
                image = ' '.join(' '.join(raw_image).split())
                data = {
                    'url': url,
                    'title': title,
                    'price': price,
                    'image': image,
                    'source': source,
                }
                extracted_data.append(data)
            return
        except Exception as e:
            print(format_exc(e))


def crawlByKeywords(product_name):
    data = []
    for website in WEBSITES_LIST:
        fetchByKeywords(product_name, website, data)

    db = mongodb_client.get_db()
    db[OFFERS_TABLE_NAME].insert_many(data)

    return data


def crawlByUrl(detail_url, source):
    session_requests = requests.session()
    response = session_requests.get(detail_url, headers=getHeaders())
    doc = html.fromstring(response.content)
    raw_price = doc.xpath(cfg[source]['detail_price'])
    data = {
        'url': detail_url,
        'price': raw_price,
        'source': source,
    }

    return data
