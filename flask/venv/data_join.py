import pandas as pd

def idClassification(id):
    if id == "숙박업(일반)" or id == '숙박업(생활)':
        return 2
    elif id == "외국인관광도시민박업":
        return 3
    else:
        return 1
df["인증업종"] = df["인증업종"].apply(idClassification)

df = pd.read_csv("./data/received_data.csv")

df = df.drop(["No.","인증","갱신","주소1", "주소2","주소(지번)","세부주소","인증유효기간","객실수","구분"], axis=1)
df = df.rename(columns={'주소(도로명)':'address'})
df["인증.1"] = df["인증.1"].apply(lambda x: 1 if x=="프리미어" else 0)
df["인증업종"] = df["인증업종"].apply(idClassification)

df = df.rename(columns={'인증.1':'premium','인증업종':'id'})

print(df.info())
print(df.head())
print(df["premium"].value_counts())

df.to_csv('./data.csv')
