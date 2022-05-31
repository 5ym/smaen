import requests
import json
from bs4 import BeautifulSoup
def fetch_station_list(point1,point2):
    url = 'https://transit.yahoo.co.jp/search/result?flatlon=&fromgid=&from='+ point1 +'&tlatlon=&togid=&to=' + point2
    bs4Obj = BeautifulSoup(requests.get(url).text, 'lxml')
    data = []
    for element in bs4Obj.select('.routeDetail')[0]:
        if hasattr(element, 'get'):
            if element.get('class')[0] == 'station':
                name = element.select("dt a")[0].get_text()
                time = element.select(".time li")[0].get_text().replace('着', '')
                data.append({"name": name, "time": time})
            else:
                for li in element.select(".stop li"):
                    name = li.select("dd")[0]
                    name.find('span').extract()
                    name = name.get_text()
                    time = li.select("dt")[0].get_text()
                    data.append({"name": name, "time": time})
    return data
