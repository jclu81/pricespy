import requests
import os
import threading
import random
import uuid
from lxml import html

from traceback import format_exc

import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'services'))

import yaml

with open(os.path.join(os.path.dirname(__file__), '..', 'config.yaml'), 'r') as configFile:
    cfg = yaml.load(configFile)

import elasticsearch_client as es

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
def get_headers():
    ua = random.choice(USER_AGENTS)
    headers = {
        "Connection": "close",
        "User-Agent": ua
    }
    return headers


def fetch_by_keywords(keywords, source, extracted_data):
    while True:
        try:
            url = cfg[source]['search_url'].format(keywords)
            session_requests = requests.session()
            response = session_requests.get(url, headers=get_headers())
            doc = html.fromstring(response.content)

            product_list = doc.xpath(cfg[source]['list'])

            count = 0
            for product in product_list:
                raw_detail_url = product.xpath(cfg[source]['detail_url'])
                raw_title = product.xpath(cfg[source]['title'])
                raw_price = product.xpath(cfg[source]['price'])
                raw_shipping = product.xpath(cfg[source]['shipping'])
                raw_image = product.xpath(cfg[source]['image'])

                if len(raw_detail_url) == 0 or len(raw_title) == 0 or len(raw_price) == 0 or len(raw_image) == 0:
                    continue
                url = ' '.join(' '.join(raw_detail_url).split())
                # may exist duplicate price in eBay
                price = ' '.join(' '.join(raw_price[0:1]).split())
                # ['Sponsored', real price]
                if source == 'Amazon' and len(raw_price) >= 2:
                    price = ' '.join(' '.join(raw_price[1:2]).split())
                title = ' '.join(' '.join(raw_title).split())
                shipping = ' '.join(' '.join(raw_shipping).split())
                if source == 'Amazon' and len(raw_shipping) >= 3:
                    shipping = ' '.join(' '.join(raw_shipping[2:3]).split())
                image = ' '.join(' '.join(raw_image[0:1]).split())
                # [.gif, .jpg]
                if source == 'eBay' and len(raw_image) >= 2:
                    image = ' '.join(' '.join(raw_image[1:2]).split())

                data = {
                    'url': url,
                    'title': title,
                    'price': price,
                    'shipping': shipping,
                    'image': image,
                    'source': source,
                    'product_id': str(uuid.uuid4()),
                }
                extracted_data.append(data)

                # restrict the maximum number of product from each website as 10
                count += 1
                if count >= 10:
                    break

            return
        except Exception as e:
            print(format_exc(e))


def crawl_by_keywords(product_name):
    data = []
    threads = []

    # if product was stored in es before, query es directly
    if es.is_keyword(product_name):
        data = es.get_products_by_keyword(product_name)
        return data

    print("%s not be cached" %(product_name))
    for website in WEBSITES_LIST:
        thread = threading.Thread(target=fetch_by_keywords, args=(product_name, website, data))
        threads.append(thread)
        thread.start()
    for thread in threads:
        thread.join()

    # add product docs to product_index
    es.add_products(data)
    # add keyword-product relations to keyword_relations_index
    es.add_keyword_relations(product_name, data)

    return data


def crawl_by_url(detail_url, source):
    session_requests = requests.session()
    response = session_requests.get(detail_url, headers=get_headers())
    doc = html.fromstring(response.content)
    # price returned from eBay begin with "US "
    raw_price = doc.xpath(cfg[source]['detail_price'])
    data = {
        'url': detail_url,
        'price': raw_price,
        'source': source,
    }

    return data
