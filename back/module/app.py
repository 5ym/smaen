from flask import Flask, jsonify, request
import datetime
import fetchNavigationData

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

@app.route('/api', methods=['GET'])
def index():
    first = request.args.get('first', '')
    second = request.args.get('second', '')
    json1 = fetchNavigationData.fetch_station_list(first, second)
    json2 = fetchNavigationData.fetch_station_list(second, first)
    json2.reverse()
    d = {}
    for index in range(len(json1)):
        if index < len(json1) and index < len(json2):
            time1 = datetime.datetime.strptime(json2[index]["time"], '%H:%M')
            time2 =  datetime.datetime.strptime(json1[index]["time"], '%H:%M')
            diff = time2 - time1
            diff = int(diff.total_seconds())
            if diff < 0:
                diff = -1 * diff
            d[index] = diff

    for k, v in sorted(d.items(), key=lambda x:x[1]):
        result = json1[k]["name"]
        if(len(json2) < len(json1)):
            result = json2[k]["name"]
        json2.reverse()
        return jsonify({
            'result': result,
            'way': [json1, json2]
        })


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
