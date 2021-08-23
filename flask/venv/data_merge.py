import json
import pandas as pd
import requests

df = pd.read_csv('./비대면관광지100선가을+사이트url_xy.csv')

df.drop(['Unnamed: 0'],axis=1,inplace=True)
df.rename(columns = {'여행지명' : 'travelDestination','주소':'address','이미지url':'imageUrl','해시태그':'tags','사이트url':'infoUrl','상세정보':'info'}, inplace = True)

df.to_csv('./비대면관광지100선가을 위도,경도 포함.csv',encoding='utf-8-sig')
print(df.info())
