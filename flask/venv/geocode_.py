import json
import pandas as pd
import requests
import json
df = pd.read_csv('./result.csv')

url = 'http://api.vworld.kr/req/address?'
params = 'service=address&request=getcoord&version=2.0&crs=epsg:4326&refine=true&simple=false&format=json&type='
road_type = 'PARCEL'
address = '&address='
keys = '&key='
primary_key = '36C90C9B-E384-312A-93F9-C4DF7C837B7A'
def request_geo(road):
    page = requests.get(url+params+road_type+address+road+keys+primary_key)
    json_data = page.json()
    return json_data

def extraction_geo(df):
    geocode = pd.DataFrame(columns = ['address', 'x', 'y'])
    none = None
    for idx, road, x,y in (zip(df.index ,df['address'],df['x'],df['y'])):
        print(x)
        if(str(x) == 'nan'):
            if len(str(road)) <= 5:
                geocode = geocode.append(
                        pd.DataFrame({
                        'address':road,
                        'x':none,
                        'y':none,
                        },
                        index=[idx]))
                continue

            json_data = request_geo(road)

            if json_data['response']['status'] == 'NOT_FOUND' or json_data['response']['status'] == 'ERROR':
                geocode = geocode.append(
                        pd.DataFrame({
                        'address':road,
                        'x':none,
                        'y':none,
                        },
                        index=[idx]))
                continue

            x = json_data['response']['result']['point']['x']
            y = json_data['response']['result']['point']['y']
            print(x)
            geocode = geocode.append(
                pd.DataFrame({
                        
                        'address':road,
                        'x':float(x),
                        'y':float(y),
                        },
                        index=[idx]))
        else:
            geocode = geocode.append(
            pd.DataFrame({
            'address':road,
            'x':x,
            'y':y,
            },
            index=[idx]))
        geocode.to_csv('./result2.csv',encoding='utf-8-sig')
extraction_geo(df)
