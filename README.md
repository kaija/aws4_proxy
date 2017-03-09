# aws4_proxy


Step1.
edit config file


replace the valid access key and access secret
target is your api gateway url

```json

{
    "access_key": "",
    "protocol": "https",
    "secret_key": "",
    "target": "yamato.elasticservice.co"
}

```


Step2.


Install required npm package


```bash

npm install

```



Step3.

Launch proxy

```bash

npm start

```



Step4.

Inject request


curl http://localhost:3000/zzzzzzzzzz?xxxxx=yyyyy
