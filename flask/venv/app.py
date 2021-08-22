from flask import Flask
from flaskext.mysql import MySQL
from pandas.io import sql
from flask_cors import CORS
from flask import jsonify
from pandas import json_normalize

import pandas as pd
import json

app = Flask(__name__)
CORS(app)
mysql = MySQL()
 
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'dja1wkd2'
app.config['MYSQL_DATABASE_DB'] = 'kq'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

# def db_connector():
#     db = mysql.connect()
#     cursor = db.cursor()
#     sql = '''SELECT * FROM postage_table;'''
#     cursor.execute(sql)
#     result = cursor.fetchall()
#     db.close()
#     return jsonify(result)




@app.route('/test')
def test1():
    db = mysql.connect()
    cursor = db.cursor()
    sql = '''SELECT * FROM test;'''
    cursor.execute(sql)
    result = cursor.fetchall()
    db.close()
    return jsonify(result)

if __name__ == '__main__': 
    app.run(debug=True)

