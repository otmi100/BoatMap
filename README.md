#Installation

./geoserver/docker-env change pw
docker-compose (-d) up
login




docker network ls
docker network inspect geoserver_default

ogr2ogr -f "PostgreSQL" PG:"host=localhost port=25434 dbname=gis user=docker password=docker" "Segelgebiete.geojson"