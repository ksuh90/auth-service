# auth-service
## How to run
Clone the repository.
```
$ git clone https://github.com/ksuh90/auth-service.git
```

- From the root of the repository, run: ```$ docker-compose up```

App accessible via ```localhost:6010```


## Specs
- Nodejs, restify
- redis
- mocha, chai

## Notes
- User credentials are stored in redis. For simplicity, they are stored in the form of {username}: {password_hash}
- Signing and validation of JWT is handled using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).
