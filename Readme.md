# Bitnacle

```Bitnacle``` is a dead simple logger module.

## Installation

```
npm i bitnacle
```

## Quick start

```javascript
const Bitnacle = require('bitnacle');
const logger = new Bitnacle(); // Uses default "simple" format

logger.log({
    level: 'DEBUG',
    message: 'This is a debug message'
});

logger.debug('This is a debug message');
```

They both produce the same output:  
```
[2019-08-25T15:49:47:928+0200] [DEBUG] [This is a debug message]
```

## Formats 

```Bitnacle``` uses 2 formats:

- ```simple```: is the default format and logs **plain text** log messages
- ```json```: outputs _json-stringified_ like log messages.

```Bitnacle``` creates log messages with the following structure:

```
[:time] [:level] [:message]
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

## Loggin extra info

If you want to add more info to your loggs you can do it by passing an ```extraInfo``` object to ```Bitnacle```. 

> **IMPORTANT**: if you create a nested object it won't be logged if using ```simple``` format, but ```json``` format will do it for you.

```javascript
const extra = {
    someKey: 'someValue',
    anotherKey: 'anotherValue',
    yetAnotherKey: 'yetAnotherValue',
    someObjectProp: {
        someKeyInsideObjectProp: 'someValueInsideObjectProp'
    }
};

const extraInfo = { extra };
logger.debug('This is a debug message', extraInfo);
```

Outputs for ```simple``` and ```json``` formats, note the nested object **is not being logged** with ```simple``` format:

```
[2019-08-26T18:07:07:226+0200] [DEBUG] [someValue] [anotherValue] [yetAnotherValue] [This is a debug message]
```

```json
{"time":"2019-08-26T18:07:42:949+0200","level":"DEBUG","someKey":"someValue","anotherKey":"anotherValue","yetAnotherKey":"yetAnotherValue","someObjectProp":{"someKeyInsideObjectProp":"someInsideObjectPropValue"},"message":"This is a debug message"}
```

### **Usage with express**

If you are using ```Bitnacle``` with ```Express```, you can pass the request object to ```Bitnacle``` for even more extra info. This is really usefull for debug purposes, since you can have ```Bitnacle``` and [bitnacle-express](https://www.npmjs.com/package/bitnacle-express) working together identifying your requests easily.

> Note that ```Bitnacle``` is compatible with [request-ip](https://www.npmjs.com/package/request-ip) and [express-request-id](https://www.npmjs.com/package/express-request-id) and it will log the ```clientIp``` and ```id``` props if they are present on the ```request``` object.

This is the log message structure:

```
[:time] [:level] [:method] [:endpoint] [:remoteAddress] [:requestId] [:message]
```

```javascript
app.get('/', function(req, res) {

    const extraInfo = { req };
    logger.debug('This is a debug message', extraInfo);

    ...

});
```

Outputs for ```simple``` and ```json``` formats:

```
[2019-08-25T16:07:52:686+0200] [DEBUG] [GET] [/] [::1] [cd657929-e0da-4f9b-ad92-d6a4551a7636] [This is a debug message]
```

```json
{"time":"2019-08-25T16:36:08:810+0200","level":"DEBUG","method":"GET","endpoint":"/","remoteAddress":"::1","id":"e5c87f07-f635-4f31-b86a-42bab7a35494","message":"This is a debug message"}
```

### **More extra fun**

It's not over yet!  
Of course you can pass both ```extra``` and ```req``` objects in ```extraInfo``` and ```Bitnacle``` will log it, now you have tons of info! :D  
Wikipedia who?  

The log structure if using ```extra``` and ```req``` objects together would be:

```
[:time] [:level] [:method] [:endpoint] [:remoteAddress] [:requestId] [someValue] [anotherValue] [yetAnotherValue] [:message]
```

Outputs for ```simple``` and ```json``` formats:

```
[2019-08-26T18:18:50:817+0200] [DEBUG] [GET] [/] [::1] [9c9d856c-1684-41c0-893d-3d047e80a01c] [someValue] [anotherValue] [yetAnotherValue] [This is a debug message]
```

```json
{"time":"2019-08-26T18:21:50:351+0200","level":"DEBUG","method":"GET","endpoint":"/","remoteAddress":"::1","id":"19f486b4-9510-4b66-84f1-90ebbadf4fcd","someKey":"someValue","anotherKey":"anotherValue","yetAnotherKey":"yetAnotherValue","someObjectProp":{"someKeyInsideObjectProp":"someInsideObjectPropValue"},"message":"This is a debug message"}
```

Just don't get too crazy logging whatever comes to your mind!


## **Log level API**

```Bitnacle``` exposes a predefined set of level functions you can use directly.

- Default levels for ```Bitnacle``` are the following:  
    - ERROR  
    - WARNING  
    - INFO  
    - DEBUG  

```javascript
const logger = new Bitnacle({
    format: 'json' // optional: default is "simple"
});

logger.error('Your error message');
logger.warning('Your warning message');
logger.info('Your info message');
logger.debug('Your debug message');
```

If you want to use your own levels, you can specify the level using ```logger.log```.

Of course you can pass the ```extraInfo``` object to ```logger.log``` for you daily dose of info!

```javascript
app.get('/', function(req, res) {

    logger.log({
        level: 'YOUR-CUSTOM-LEVEL',
        message: 'Your log message',
        extraInfo: {
            req,
            extra
        }
    })

    ...
    
});
```