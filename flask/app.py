from flask_cors import CORS
from flask import Flask,jsonify,request,render_template
import pymongo
import json

app = Flask(__name__)

CORS(app)

CONNECTION_STRING = "mongodb+srv://jihun:dja1wkd2@qualified.mmv3l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
client = pymongo.MongoClient(CONNECTION_STRING)

# 인증 숙소
db = client.get_database('Certified')
certified = db.certified

# 비대면 관광지 100선 가을 
travelDestinationdb = client.get_database('travelDestination')

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
    #추천 관광지 432개
    search = request.args.get('address')
    results = list(travelDestinationdb.autumn.find({ "address": { "$regex": search}}).limit(2))
    if(len(results) < 2):
        count = 2-len(results)
        recommend_results = list(travelDestinationdb.recommend.find({ "address": { "$regex": search}}).limit(count))
        results.append(recommend_results)
        return json.dumps(results, default=str,ensure_ascii=False)
    else:
        return json.dumps(results, default=str,ensure_ascii=False)


if __name__ == '__main__': 
    app.run(host='0.0.0.0', port=5000)