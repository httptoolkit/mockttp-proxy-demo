(async () => {
    const mockttp = require('mockttp');

    // Create a proxy server with a self-signed HTTPS CA certificate:
    const https = await mockttp.generateCACertificate();
    const server = mockttp.getLocal({ https });

    // Inject 'Hello world' responses for all requests
    await server.get("/admin/api").withQuery({ cashId: 9375 }).thenReply(200, "<code>YAY!</code>");;
    await server.start();

    const caFingerprint = mockttp.generateSPKIFingerprint(https.cert);

    if (process.argv[2] === 'chrome') {
        // Launch an intercepted Chrome using this proxy:
        const launchChrome = require('./launch-chrome');
        launchChrome("https://example.com", server, caFingerprint);
    } else {
        // Print out the server details for manual configuration:
        console.log(`Server running on port ${server.port}`);
        console.log(`CA cert fingerprint ${caFingerprint}`);
    }
})(); // (All run in an async wrapper, so we can easily use top-level await)
