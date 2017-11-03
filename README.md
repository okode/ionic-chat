Ionic Chat
==========

Ionic 2 Chat Demo based on:

* Spring WebSockets backend
* Ionic Frontend

Requirements
------------

* Homebrew

```
$ brew update ; brew upgrade
```

* Java 8

```
$ brew cask install java
```

Building and Running
--------------------

* Backend build & run

```
$ cd backend
$ ./gradlew bootRun
```

* Testing

```
$ ionic serve -c -s
```

Testing with curl
-----------------

* Append chat message

```
$ curl -X POST -H "Content-Type:application/json" -d '{"text": "My new message"}' http://localhost:8080/messages
```

* Retrieve chat messages

```
$ curl http://localhost:8080/messages
```

