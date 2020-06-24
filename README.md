docker run --name "postgis" -d -t kartoza/postgis:9.4-2.1
docker run --name "geoserver"  --link postgis:postgis -p 8080:8080 -d -t kartoza/geoserver