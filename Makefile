ASSETS_DEST="engg4030/"

build: node_modules bower_components copy_files
	node_modules/.bin/metalsmith

node_modules: package.json
	#npm install

bower_components: bower.json
	#bower install

copy_files: Makefile
	mkdir -p $(ASSETS_DEST)/styles
	cp -f bower_components/normalize-css/normalize.css $(ASSETS_DEST)/styles/normalize.css
	cp -rf bower_components/font-awesome/fonts/ $(ASSETS_DEST)/fonts/
	cp -f bower_components/font-awesome/css/font-awesome.min.css $(ASSETS_DEST)/styles

clean:
	rm -rf engg4030/*

.PHONY: build
