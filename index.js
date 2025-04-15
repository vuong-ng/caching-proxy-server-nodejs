import yargs from 'yargs';
import CachingProxyServer from './server.js';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
    .command('start', 'Start a server running on a port', {
    port: {
        describe: 'port to run the server to listen on',
        demandOption: true,
        type: 'number'
    },
    origin: {
        describe: 'Origin url to fetch',
        demandOption: true,
        type: 'string',
    }
},
    (argv) => {
        const { port, origin } = argv;
        const server = new CachingProxyServer(port, origin);
        console.log(argv);
        server.start();
    }
)
    .command('clear', 'Clear cache', {}, () => {
        const server = new CachingProxyServer();
        server.clearCache();
        console.log('Cleared cache');
    })
    .help('h', 'help')
    .argv;
