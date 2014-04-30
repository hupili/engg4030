
build: node_modules
	node_modules/.bin/metalsmith

node_modules: package.json
	npm install

clean:
	rm -rf engg4030/*

.PHONY: build
