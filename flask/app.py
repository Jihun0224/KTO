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

# @app.route('/get_params', methods=['POST'])
# def GetParams():
#         value = request
#     return value

@app.route('/Certified')
def Certified():
    col_results = list(certified.find({}))

    return json.dumps(col_results, default=str,ensure_ascii=False)

@app.route('/autumn')
def autumn():
    col_results = list(autumn.find({}))

    return json.dumps(col_results, default=str,ensure_ascii=False)

if __name__ == '__main__': 
    app.run(debug=True)

