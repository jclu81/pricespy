import yaml
with open('../config.yaml', 'r') as configFile:
    cfg = yaml.load(configFile)


if __name__ == "__main__":
    assert cfg['mongodb']['user'] == 'test'
    print(cfg['mongodb']['user'])