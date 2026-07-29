FROM python:3.14.6

WORKDIR /app

COPY module .

RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 80

ENV NAME World

CMD [ "python", "app.py" ]
