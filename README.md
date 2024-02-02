Prisma `RelationJoins` bug
----
This repository serves the purpose of reporting a bug pertaining to the utilization of Prisma's **relationJoins** in conjunction with **orderBy**, which subsequently leads to an error.

The aforementioned error has been elaborated upon in greater detail within the provided link.
[here](https://github.com/prisma/prisma/issues/22299#issuecomment-1873115529) by [@michaelchen01](https://github.com/michaelchen01) and [here](https://github.com/prisma/prisma/issues/22299#issuecomment-1873417562) by [@SC0d3r](https://github.com/SC0d3r)

Steps for Replicating the Error
----
1. clone the repo
```sh
git clone https://github.com/SC0d3r/prisma-relationJoins-bug.git
```
2. Install npm pkgs
```sh
npm i
```
3. run docker compose to run the database
```sh
docker compose up -d
```
4. migrate dev 
```sh
npx prisma migrate dev
```
5. now run the server 
```sh
node server.js
```
6. go to http://localhost:3000 and init the data
7. go to http://localhost:3000/bug
8. now in terminal(where you run the node server.js) you should see the error

<br>

----

Note that you can also change the data via pgadmin in http://localhost:8080

pgadmin credentials:

username (email): example@gmail.com

password: 1234

Steps to init pgadmin:
----
1. go to http://localhost:8080 after running `docker compose up`
2. register a server with bellow credentials

3. give a name for example `postgres` and then in `Connection` tab:

**host**: get the host (ip address) via `docker inspect <hash of posgtres running continer>` for example *172.18.0.3*
(for getting the hash of running container run `docker ps`)

**username**: prisma

**pwd**: 1234