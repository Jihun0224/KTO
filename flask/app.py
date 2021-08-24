from flask_cors import CORS
from flask import Flask,jsonify,request
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
autumn = travelDestinationdb.autumn

<<<<<<< HEAD
def parse_json(data):
    return json.loads(json_util.dumps(data))

@app.route('/mongo')
=======
@app.route('/Certified')
>>>>>>> 7a5560c170606241b23cd1e8df3e32ff1b14f0ca
def test1():
    col_results = list(certified.find({}))

    return json.dumps(col_results, default=str,ensure_ascii=False)

@app.route('/autumn')
def test2():
<<<<<<< HEAD
    col_results = list(autumn.find())
=======
    col_results = list(autumn.find().limit(5))
>>>>>>> 7a5560c170606241b23cd1e8df3e32ff1b14f0ca

    return json.dumps(col_results, default=str,ensure_ascii=False)

if __name__ == '__main__': 
    app.run(debug=True)

