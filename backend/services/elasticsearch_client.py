import os

import yaml
from elasticsearch import Elasticsearch

with open(os.path.join(os.path.dirname(__file__), '..', 'config.yaml'), 'r') as configFile:
    cfg = yaml.load(configFile)

ELASTICSEARCH_HOST = cfg['elasticsearch']['host']
ELASTICSEARCH_PORT = cfg['elasticsearch']['port']

# favorite_index store the user_id - product_id relations
favorite_index = cfg['elasticsearch']['favorite_index']
favorite_doc_type = cfg['elasticsearch']['favorite_doc_type']
# keyword_relation_index store the keyword - product_id relations
keyword_relation_index = cfg['elasticsearch']['keyword_relation_index']
keyword_relation_doc_type = cfg['elasticsearch']['keyword_relation_doc_type']
# product_index store the product docs
product_index = cfg['elasticsearch']['product_index']
product_doc_type = cfg['elasticsearch']['product_doc_type']

es = Elasticsearch([{'host': ELASTICSEARCH_HOST, 'port': ELASTICSEARCH_PORT}])


# favorite_index operations
def add_favorite_relation(user_id, product_id):
    doc = {
        'user_id': user_id,
        'product_id': product_id,
    }
    es.index(index=favorite_index, doc_type=favorite_doc_type, body=doc)


def delete_favorite_relation(user_id, product_id):
    # match_rule = {
    #     'user_id': user_id,
    #     'product_id': product_id,
    # }
    # 特么写个multi match真鸡儿复杂
    query = {
        'query': {
            'bool': {
                'must': [{'match': {'user_id':user_id}}, {'match': {'product_id': product_id}}]
            }
        }
    }
    es.delete_by_query(index=favorite_index, doc_type=favorite_doc_type, body=query)


def get_favorite_list(user_id):
    if not es.indices.exists(index=favorite_index):
        return []
    if not es.indices.exists(index=product_index):
        return []
    product_ids = get_product_ids_by_user(user_id)
    products = get_products_by_ids(product_ids)
    return products


def get_product_ids_by_user(user_id):
    product_ids = []
    match_rule = {
        'user_id': user_id,
    }
    query = {
        'size': 10000,
        'query': {
            'match': match_rule
        }
    }
    res = es.search(index=favorite_index, doc_type=favorite_doc_type, body=query)
    for hit in res['hits']['hits']:
        product_ids.append(hit['_source']['product_id'])
    return product_ids


# keyword_relation_index operations
def add_keyword_relation(keyword, product_id):
    doc = {
        'keyword': keyword,
        'product_id': product_id,
    }
    es.index(index=keyword_relation_index, doc_type=keyword_relation_doc_type, body=doc)


def add_keyword_relations(keyword, product_docs):
    for product_doc in product_docs:
        add_keyword_relation(keyword, product_doc['product_id'])


def get_products_by_keyword(keyword):
    if not es.indices.exists(index=keyword_relation_index):
        return []
    if not es.indices.exists(index=product_index):
        return []
    product_ids = get_product_ids_by_keyword(keyword)
    products = get_products_by_ids(product_ids)
    return products


def get_product_ids_by_keyword(keyword):
    product_ids = []
    match_rule = {
        'keyword': keyword,
    }
    query = {
        'size': 10000,
        'query': {
            'match': match_rule
        }
    }
    res = es.search(index=keyword_relation_index, doc_type=keyword_relation_doc_type, body=query)
    for hit in res['hits']['hits']:
        product_ids.append(hit['_source']['product_id'])
        print("being querying")
    return product_ids


def is_keyword(keyword):
    if not es.indices.exists(index=keyword_relation_index):
        return False
    product_ids = get_product_ids_by_keyword(keyword)
    return len(product_ids) != 0


# product_index operations
def get_product_by_id(product_id):
    match_rule = {
        'product_id': product_id,
    }

    query = {
        'size': 10000,
        'query': {
            'match': match_rule
        }
    }

    res = es.search(index=product_index, doc_type=product_doc_type, body=query)
    # the product id is unique, so the res would only contain one product
    for hit in res['hits']['hits']:
        return hit['_source']


def get_products_by_ids(product_ids):
    products = []
    for product_id in product_ids:
        print("being searching")
        products.append(get_product_by_id(product_id))
    return products


def add_product(product_doc):
    es.index(index=product_index, doc_type=product_doc_type, body=product_doc)


def add_products(product_docs):
    for product_doc in product_docs:
        add_product(product_doc)
        print("being adding")

