from lxml import html
import requests
from traceback import format_exc

def run(brand, source, extracted_data):
	while True:
		try:
			if source == 'Amazon':
				url = 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords={0}'.format(brand)
				XPATH_LIST = '//li[contains(@id,"result_")]'
				XPATH_URL = './/a[contains(@class,"s-access-detail-page")]/@href'
				XPATH_TITLE = './/a[contains(@class,"s-access-detail-page")]/h2/text()'
				XPATH_PRICE = './/span[@class="a-offscreen"]/text()'
				XPATH_IMAGE = './/div[contains(@class,"s-card")]/img/@src'
			else:
				url = 'https://www.ebay.com/sch/i.html?_nkw={0}&_sacat=0'.format(brand)
				XPATH_LIST = '//li[contains(@class,"s-item")]'
				XPATH_URL = './/a[@class="s-item__link"]/@href'
				XPATH_TITLE = './/h3[contains(@class,"s-item__title")]/text()'
				XPATH_PRICE = './/span[@class="s-item__price"]/text()'
				XPATH_IMAGE = './/img[@class="s-item__image-img"]/@src'

			headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'}
			response = requests.get(url, headers=headers)
			doc = html.fromstring(response.text)

			product_list = doc.xpath(XPATH_LIST)

			for product in product_list:
				RAW_URL = product.xpath(XPATH_URL)
				RAW_TITLE = product.xpath(XPATH_TITLE)
				RAW_PRICE = product.xpath(XPATH_PRICE)
				RAW_IMAGE = product.xpath(XPATH_IMAGE)
				if len(RAW_URL) == 0 or len(RAW_TITLE) == 0 or len(RAW_PRICE) == 0 or len(RAW_IMAGE) == 0:
					continue
				URL = ' '.join(' '.join(RAW_URL).split())
				#may exist duplicate price in eBay
				PRICE  = ' '.join(' '.join(RAW_PRICE[0:1]).split())
				TITLE = ' '.join(' '.join(RAW_TITLE).split())
				IMAGE = ' '.join(' '.join(RAW_IMAGE).split())
				data = {
						'URL':URL,
						'TITLE':TITLE,
						'PRICE':PRICE,
						'IMAGE':IMAGE,
						'SOURCE': source,
				}
				extracted_data.append(data)
			return
		except Exception as e:
			print (format_exc(e))

def crawl(product_name):
	extracted_data = []
	run(product_name, 'Amazon', extracted_data)
	run(product_name, 'eBay', extracted_data)
	return extracted_data
