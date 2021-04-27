module.exports = async function launchChrome(url, server, caFingerprint) {
    const tmp = require('tmp-promise');
    const open = require('open');

    const profileDir = await tmp.dir({ unsafeCleanup: true });

    // Launch the browser, using this proxy & trusting our CA certificate:
    await open(url, {
        app: {
            name: { // Pick the right name for Chrome on this platform:
                darwin: 'google chrome',
                win32: 'chrome',
                linux: 'google-chrome'
            }[process.platform],
            arguments: [
                `--proxy-server=localhost:${server.port}`,
                `--ignore-certificate-errors-spki-list=${caFingerprint}`,
                `--user-data-dir=${profileDir.path}`,
                '--no-first-run'
            ]
        }
    });
};