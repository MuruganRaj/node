# Node.js Express REST API

## Create Database

Make sure MySQL is installed and running on the system. Create a `api` table and run the query:

```sql
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT '',
  `username` varchar(50) DEFAULT '',
  `email` varchar(50) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## Installation

Clone, install, and start up the app.

```bash
git clone https://github.com/taniarascia/node-api.git
cd node-api
npm install
node app.js
```

Navigate to `http://localhost:3002`.

## HTTP Requests

Use `node post.js` to send a `POST` request through, or use `curl` to do all HTTP CRUD requests.

### GET

- `curl http://localhost:3002/users`
- `curl http://localhost:3002/users/1`

### POST 

- `curl --data "name=Tania&email=tania@example.com&username=floppydiskette" http://localhost:3002/users`

### PUT

- `curl -X PUT -d "name=Tania" -d "email=tania@example.com" -d "username=taniarascia" http://localhost:3002/users/1`

### DELETE

- `curl -X "DELETE" http://localhost:3002/users/1`
