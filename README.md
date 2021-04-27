# mockttp-proxy-demo
A tiny demo, showing how to build your own scriptable HTTPS-intercepting proxy with Mockttp

## How to use this

* Clone the repo.
* Run `npm install` inside the repo.
* Run `npm start chrome` to start the proxy and an intercepted Chrome window.

This should show you a replacement version of the entire internet, where every page is "Hello world".

You can also run `npm start` to start the server directly, printing it's configuration details, so you can manually configure clients.

Once that's working, you can stop the server & Chrome, start adding more interesting rules [here](https://github.com/httptoolkit/mockttp-proxy-demo/blob/main/index.js#L9), to configure the proxy server.

## Some suggested rules

Try replacing [the existing rule](https://github.com/httptoolkit/mockttp-proxy-demo/blob/main/index.js#L9) with:

```javascript
// Proxy all example.com traffic through as normal, untouched:
server.anyRequest()
    .forHost("example.com")
    .thenPassThrough();

// Make all GET requests to google.com time out:
server.get("google.com").thenTimeout();

// Redirect any github requests to wikipedia.org:
server.anyRequest()
    .forHost("github.com")
    .thenForwardTo("https://www.wikipedia.org");

// Intercept /api?userId=123 on any host, serve the response from a file:
server.get("/api")
    .withQuery({ userId: 123 })
    .thenFromFile(200, "/path/to/a/file");

// Forcibly close any connection if a POST request is sent:
server.post().thenCloseConnection();
```

This defines a few different rules for specific requests. Try viewing Google.com for example (it'll timeout) or visiting GitHub (it'll give you Wikipedia instead).

This only works for the specific traffic that's matched. If you'd like to proxy most traffic as normal, so the internet basically works but only one or two things are changed, then:

* Define your specific rules, as above
* Include a `.always()` specifier on each one (e.g. `server.get("google.com").always().thenReply(200, "hi")`)
* Add one last rule at the end which says:
    ```javascript
    server.anyRequest().thenPassThrough();
    ```

This ensures that your specific rules always take precedence if they match, and any requests which don't match them get proxied untouched, and work as normal.