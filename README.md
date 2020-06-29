#Installation

#voraussetzungen
docker + docker-compose
gdal-bin (for ogr2ogr)


./geoserver/docker-env change default pws
cd geoserver
docker-compose (-d) up


Login:
http//[serverip]:8600/geoserver 

Create Workspace

Add Datasource -> PostGIS

IP:
docker network ls
docker network inspect geoserver_default
-> geoserver_db_1

db/user/pw: docker-env/db.env

clone git repo or load Segelgebiete.geojson manually
cd boatinfo/geoserver/
ogr2ogr -f "PostgreSQL" PG:"host=localhost port=25434 dbname=gis user=docker password=docker" "Segelgebiete.geojson"
-> Hinweis: < 3.0.2 funktioniert nicht mit postres >=12
ggf aktuelle version aus dem untubu repository (sudo add-apt-repository ppa:ubuntugis/ubuntugis-unstable) oder auf http://download.osgeo.org/gdal/

Layer hinzufügen -> segelgebiete -> publizieren

Begrenzendes Rechteck-> aus den daten berechnen
Speichern