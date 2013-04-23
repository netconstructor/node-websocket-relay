# WebSocket Relay Server

This server will relay any data posted to it's http socket to whichever websocket clients are connected, making it useful for a variety of tasks.

## Dependencies
1. node.js
2. ws

		$ npm install ws

## Quick start

1. Install the depenencies


        $ npm install
2. Run the app


        $ node app.js

## Using Nginx + Upstart (optional)
1. Included are sample nginx and upstart configuration files. You will need to update both configuration files to match your specific instalation:


	* nginx.conf:
	
		Update line 14 to the correct IP address of the server allowed to post data to the relay.
	
			13:         …
			14:         allow <add-controlling-address-here>;
			15:         …


	* upstart.conf:
	
		Update line 9 to the correct directory of the location of app.js
	
			 8:         …
			 9:         env RELAY_ROOT=/webapps/relay
			10:         …

2. Symlink in both services repsective configuration files:

		sudo ln -s /path/to/root/nginx.conf /etc/nginx/sites-available/relay.conf
		sudo ln -s /path/to/root/upstart.conf /etc/init/relay.conf

3. Start both services:

		sudo service relay start
		sudo service nginx start
4. You should now be able to post to <server-ip>/send and any websocket clients connected will recieve any posted data.