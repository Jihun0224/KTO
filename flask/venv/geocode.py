import json
import pandas as pd
import requests

data = pd.read_csv('./data.csv')

url = 'http://api.vworld.kr/req/address?'
params = 'service=address&request=getcoord&version=2.0&crs=epsg:4326&refine=true&simple=false&format=json&type='
road_type = 'ROAD'
address = '&address='
keys = '&key='
primary_key = '36C90C9B-E384-312A-93F9-C4DF7C837B7A'

def request_geo(road):
    page = requests.get(url+params+road_type+address+road+keys+primary_key)
    json_data = page.json()
    return json_data

def extraction_geo(df):
    geocode = pd.DataFrame(columns = ['name','address', 'x', 'y','id'])
    none = None
    for idx, road, idd in (zip(df.index ,df['address'],df['id'])):
        name = str(df['name'][idx])
        if len(str(road)) <= 5:
            geocode = geocode.append(
                    pd.DataFrame({'name':name,
                    'address':road,
                    'x':none,
                    'y':none,
                    'id':idd
                    },
                    index=[idx]))
            continue

        json_data = request_geo(road)

        if json_data['response']['status'] == 'NOT_FOUND' or json_data['response']['status'] == 'ERROR':
            geocode = geocode.append(
                    pd.DataFrame({'name':name,
                    'address':road,
                    'x':none,
                    'y':none,
                    'id':idd},
                    index=[idx]))
            continue

        x = json_data['response']['result']['point']['x']
        y = json_data['response']['result']['point']['y']

        geocode = geocode.append(
            pd.DataFrame({
                    'name':name,
                    'address':road,
                    'x':float(x),
                    'y':float(y),
                    'id':idd},
                    index=[idx]))
    return geocode


import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb
from sqlalchemy import create_engine

def toSql(df):
    engine = create_engine("mysql+mysqldb://root:"+"dja1wkd2"+"@localhost/kq", encoding='utf-8')
    conn = engine.connect()
    df.to_sql(name='test', con=engine, if_exists='replace',index=False)


import pandas as pd

df = pd.read_csv('./data/품질인증업소.csv')
df_1 = pd.read_csv('./data/한옥.csv')
df_result = pd.merge(df, df_1, how='left')
df_result = df_result.drop(["업소사진", "Unnamed: 2","Unnamed: 3"],axis=1)

df_result = df_result.rename(columns={'업소이름':'name', '업소주소':'address','업소구분':'id'})

toSql(extraction_geo(df_result))