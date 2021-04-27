(async () => {
    const mockttp = require('mockttp');

    // Create a proxy server with a self-signed HTTPS CA certificate:
    const https = await mockttp.generateCACertificate();
    const server = mockttp.getLocal({ https });

    // Inject 'Hello world' responses for all requests
    await server.anyRequest().thenReply(200, "Hello world");
    await server.start();

    // Print out the server details:
    console.log(`Server running on port ${server.port}`);
    console.log(`CA cert fingerprint ${mockttp.generateSPKIFingerprint(https.cert)}`);
})(); // (All run in an async wrapper, so we can easily use top-level await)