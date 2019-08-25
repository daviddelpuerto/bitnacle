# Bitnacle

```Bitnacle``` is a dead simple logger module.

## Installation

```
npm i bitnacle
```

## Usage

```javascript
const Bitnacle = require('bitnacle');
const logger = new Bitnacle(); // Uses default "simple" format

logger.log({
    level: 'DEBUG',
    message: 'This is a debug message'
});

logger.debug('This is a debug message');
```

```Bitnacle``` uses 2 formats. ```simple``` is the default format and logs **plain text** log messages, if you want ```Bitnacle``` to output _json-stringified_ like log messages _you can specify the **json format**_.

```Bitnacle``` creates log messages with the following structure:

```
[:time] [:level] [:message]
```

They both produce the same output:  
```
[2019-08-25T15:49:47:928+0200] [DEBUG] [This is a debug message]
```

To use the ```json``` format:

```javascript
const jsonLogger = new Bitnacle({ format: 'json' });

jsonLogger.log({
    level: 'DEBUG',
    message: 'This is a debug message'
});

jsonLogger.debug('This is a debug message');
```

```json
{"time":"2019-08-25T16:38:01:202+0200","level":"DEBUG","message":"This is a debug message"}
```

### **Usage with express**

If you are using ```Bitnacle``` with ```Express```, you can pass the request object to ```Bitnacle``` for extra info. 

> Note that ```Bitnacle``` is compatible with [request-ip](https://www.npmjs.com/package/request-ip) and [express-request-id](https://www.npmjs.com/package/express-request-id) and it will log the ```clientIp``` and ```id``` if they are present on the ```request``` object.

This is the log message structure:

```
[:time] [:level] [:method] [:endpoint] [:remoteAddress] [:requestId] [:message]
```

```javascript
app.get('/', function(req, res) {

    logger.debug('This is a debug message', req);

    ...

});
```

```simple``` format  

```
[2019-08-25T16:07:52:686+0200] [DEBUG] [GET] [/] [::1] [cd657929-e0da-4f9b-ad92-d6a4551a7636] [This is a debug message]
```

```json``` format:

```json
{"time":"2019-08-25T16:36:08:810+0200","level":"DEBUG","method":"GET","endpoint":"/","remoteAddress":"::1","id":"e5c87f07-f635-4f31-b86a-42bab7a35494","message":"This is a debug message"}
```

## **Log level API**

```Bitnacle``` exposes a predefined set of level functions you can use directly.

- Default levels for Bitnacle are the following:  
    - ERROR  
    - WARNING  
    - INFO  
    - DEBUG  

```javascript
const logger = new Bitnacle({
    format: 'json' // optional: default is simple
});

logger.error('Your error message');
logger.error('Your error message', req);
logger.warning('Your warning message');
logger.warning('Your warning message', req);
logger.info('Your info message');
logger.info('Your info message', req);
logger.debug('Your debug message');
logger.debug('Your debug message', req);
```

If you want to use your own levels, you can specify the level using ```logger.log```:

You can pass the request object to ```logger.log``` aswell:

```javascript
app.get('/', function(req, res) {

    logger.log({
        level: 'YOUR-CUSTOM-LEVEL',
        message: 'Your log message',
        req: req
    })

    ...
    
});
```