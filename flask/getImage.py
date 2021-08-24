from urllib2 import Request, urlopen
from urllib import urlencode, quote_plus

url = 'http://api.visitkorea.or.kr/openapi/service/rest/PhotoGalleryService/galleryList'
queryParams = '?' + urlencode({ quote_plus('ServiceKey') : 'EFoCqYt%2BLkiQlVlyq5YnUJ85Rlw80roqfZCNNS4sMikQ4aL4vFP3kDp7wxo9WD1O17l1SHxG3Wq45XyxMZLLFA%3D%3D', 
            quote_plus('pageNo') : '1', quote_plus('numOfRows') : '10', quote_plus('MobileOS') : 'ETC', quote_plus('MobileApp') : 'AppTest'})

request = Request(url + queryParams)
request.get_method = lambda: 'GET'
response_body = urlopen(request).read()
print response_body