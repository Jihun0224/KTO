from flask_cors import CORS
from flask import Flask,jsonify,request,render_template
import pymongo
import json
import random

app = Flask(__name__)

CORS(app)

CONNECTION_STRING = "mongodb+srv://jihun:dja1wkd2@qualified.mmv3l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
client = pymongo.MongoClient(CONNECTION_STRING)

# 인증 숙소
db = client.get_database('Certified2')
certified = db.certified2

# 추천여행지
RecommendPlace = client.get_database('RecommendPlace')

# 숙소 별점
CertifiedScore = client.get_database('CertifiedScore')

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/result", methods=["POST","GET"])
def result():

    dosi = request.args.get('dosi')
    accommodation = int(request.args.get('accommodation'))
    type_ = request.args.get('type') #동반 유형
    value = request.args.get('value')
    destination = []

    # 도로 1차 필터
    dosi_results = list(certified.find({"address": { "$regex": dosi}}, {'_id': False}));
    # 도로, 숙소 타입 2차 필터
    dosi_type_results=[]
    for data_ in dosi_results:
        if(data_["id"] == accommodation):
            dosi_type_results.append(data_)
    if(len(dosi_type_results)==0):
        # 선택한 시에 원하는 숙박유형이 없을 때
        random_val = random.randrange(len(dosi_results))
        destination = dosi_results.pop(random_val-1)
    else:
        with_results=[]
        for data_ in dosi_type_results:
            if type_ in data_["with"]:
                with_results.append(data_)
        if(len(with_results)==0):
            # 동반 유형이 수용가능한 업소가 없을 때
            random_val = random.randrange(len(dosi_type_results))
            destination = dosi_type_results.pop(random_val-1)
        else:
            value_results=[]
            for data_ in with_results:
                if value in data_["label"]:
                    value_results.append(data_)
            if(len(value_results)==0):
                    # 첫번째 가치에 해당하는 업소가 없을 때
                random_val = random.randrange(len(with_results))
                destination = with_results.pop(random_val-1)
            else:
                random_val = random.randrange(len(value_results))
                destination = value_results.pop(random_val-1)


        data = {
        "x":destination.get('x'),
        "y":destination.get('y'),
        "help":destination.get('help'),
        "name":destination.get('name').split('[')[0],
        "address":destination.get('address'),
    };
    return render_template('infopage.html',results = destination, data = data)

@app.route('/Certified')
def Certified():
    col_results = list(certified.find({}))

    return json.dumps(col_results, default=str,ensure_ascii=False)

@app.route('/recommend')
def recommend():
    #추천 관광지 
    search = request.args.get('address')
    results_raw=[]
    result=[]
    results_raw = list(RecommendPlace.place.find({ "address": { "$regex": search}}))
    if(len(results_raw) >= 2):
        results = random.sample(results_raw,2)
        return json.dumps(results, default=str,ensure_ascii=False)
    else:
        if(search.startswith('(')==True):
            search = search.split(' ')[1]
        else:
            search = search.split(' ')[0]
        count = 2-len(results_raw)
        recommend_results = list(RecommendPlace.place.find({ "address": { "$regex": search}}))
        recommend_results = random.sample(recommend_results,count)

        for i in range(count):
            results_raw.append(recommend_results.pop(i-1))

        return json.dumps(results_raw, default=str,ensure_ascii=False)   
@app.route("/score")
def score():
    
    search = request.args.get('name')
    result={
        "raw":None,
        "crawling":None
    }
    # 숙도 만족도 조사 By KTO 
    raw_results = list(CertifiedScore.raw_score.find({ "name": { "$regex": search}}, {'_id': False}))
    if not raw_results:
        temp = {
            "clean_score":0,
            "revisit_score":0,
            "service_score":0,
            "facility_score":0,
            "rate":0
        }
        result["raw"] = temp
    else:
        result["raw"] = raw_results.pop(0)    
   
    # 숙도 크롤링 별점
    crawling_results = list(CertifiedScore.Score.find({ "name": { "$regex": search}}, {'_id': False}))
    if not crawling_results:
        temp = {
            "clean_score":0,
            "safety_score":0,
            "revisit_score":0,
            "price_score":0,
            "service_score":0,
            "facility_score":0,
            "rate":0
        }
        result["crawling"] = temp
    else:
        result["crawling"] = crawling_results.pop(0)     

    return json.dumps(result, default=str,ensure_ascii=False)

if __name__ == '__main__': 
    app.run(host='0.0.0.0', port=5000)