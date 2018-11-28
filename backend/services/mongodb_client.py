
from pymongo import MongoClient
import os
import yaml
with open(os.path.join(os.path.dirname(__file__), '..', 'config.yaml'), 'r') as configFile:
    cfg = yaml.load(configFile)


MONGO_DB_HOST = cfg['mongodb']['host']
MONGO_DB_PORT = cfg['mongodb']['port']
MONGO_DB_USER = cfg['mongodb']['user']
MONGO_DB_PASS = cfg['mongodb']['password']
DB_NAME = cfg['mongodb']['db_name']


# client = MongoClient("%s:%d" % (MONGO_DB_HOST, MONGO_DB_PORT), username=MONGO_DB_USER, password=MONGO_DB_PASS)
client = MongoClient(MONGO_DB_HOST, MONGO_DB_PORT)


def get_db(db=DB_NAME):
    db = client[db]
    return db



