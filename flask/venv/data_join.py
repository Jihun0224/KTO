
import pymongo
mongo = pymongo.MongoClient('mongodb+srv://jihun:dja1wkd2@qualified.mmv3l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

db = pymongo.database.Database(mongo, 'Certified')
col = pymongo.collection.Collection(db, 'certified')

col_results = list(col.find().limit(5))

print(col_results)