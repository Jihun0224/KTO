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
db = client.get_database('Certified')
certified = db.certified

# 추천여행지
RecommendPlace = client.get_database('RecommendPlace')

# 숙소 별점
CertifiedScore = client.get_database('CertifiedScore')


@app.route('/')
def index():
    return render_template('index.html')

@app.route("/result", methods=["GET", "POST"])
def result():

    jsonData = request.get_json()

    col_results = list(certified.find({}, {'_id': False}).limit(1));
    data = {
        "x":col_results[0]['x'],
        "y":col_results[0]['y'],
        "help":col_results[0]['help'],
        "name":col_results[0]['name'].split('[')[0],
        "address":col_results[0]['address'],
    }
    return render_template('infopage.html',results = col_results, data = data)

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