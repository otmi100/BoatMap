
# BoatMap 

## Installation

### Voraussetzungen
* Installiertes docker + docker-compose
* gdal-bin unter Linux (für das Tool ogr2ogr), um die geoJSON in die Postgres zu laden. Oder Alternativ über QGIS, SQL Skripte, o.ä.
* npm
* git


### Step by Step

#### Environment Variablen  anpassen

  * Mindestens Standardpasswort GEOSERVER_ADMIN_PASSWORD in geoserver.env
  * Wenn postgres von extern erreichbar sein sollte, auf jeden Fall auch POSTGRES_USER und POSTGRES_PASS in db.env

    ```
    ./geoserver/docker-env/*.env
    ```

#### Docker Container mit geoserver und postgres laden & starten

```sh
cd geoserver
docker-compose -d up
```

#### GeoServer configurieren

* Login: http//[serverip]:8600/geoserver 
* Arbeitsbereich (z.B. "BoatInfo") anlegen
* Datenquelle hinzufügen -> PostGIS

Ip kann folgendermaßen herausgefunden werden:

```sh
IP:
docker network ls
docker network inspect geoserver_default
```

Ip ist unter geoserver_db_1 gelistet.

#### Daten in Datenbank laden
* geoserver/Segelgebiete.geojson über clone git BoatInfo repo oder aus release Zip auf den Server über FTP/SSH/.. kopieren
```sh
cd boatinfo/geoserver/
ogr2ogr -f "PostgreSQL" PG:"host=localhost port=25434 dbname=gis user=docker password=docker" "Segelgebiete.geojson"
```
*Hinweis*: ogr2ogr Version < 3.0.2 funktioniert nicht mit postres >=12  
ggf aktuelle version aus dem Untubu Repository (sudo add-apt-repository ppa:ubuntugis/ubuntugis-unstable) oder auf http://download.osgeo.org/gdal/

#### Segelgebiete Layer veröffentlichen
* Layer hinzufügen -> segelgebiete -> Layer publizieren
* Begrenzendes Rechteck-> aus den daten berechnen
* Speichern

#### Client starten
* URL vom WMS Service des Segelgebiete Layers in ./src/components/layers/SailingAreaLayer.ts anpassen 

```sh
npm install
npm run start
```
alternativ
```
npm run build
```
und die Dateien aus .dist/* auf einen Webserver kopieren