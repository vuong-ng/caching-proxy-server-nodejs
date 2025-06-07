import axios from "axios";
import express from 'express';
import NodeCache from "node-cache";

// const sharedCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
class CachingProxyServer {
    constructor(port, origin) {
        this.port = port;
        this.origin = origin;
        this.cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
        this.app = express();
    }

    async handleRequest(req, res) {
        const url = `${this.origin.replace(/\/+$/, '')}/${req.originalUrl.replace(/^\/+/, '')}`; //concat the start of this server origin with the url
        console.log(`Forwarding request to: ${url}`);
        const cachedResponse = this.cache.get(url);

        if (cachedResponse) {
            res.setHeader('X-cache', 'HIT');
            return res.status(200).send(cachedResponse.data);
        }

        try {
            const response = await axios.get(url);
            const responseData = response.data;
            this.cache.set(url, responseData);
            res.setHeader('X-cache', 'MISS');
            res.status(response.status).send(responseData);
        } 
        catch(error) {
            console.error(`Request failed: ${error.response ? error.response.status : 500}`);
            res.status(error.response ? error.reponse.status : 500).send(error.message);
        }
    }

    start() {
        this.app.get("*", (req,res) => this.handleRequest(req, res));
        this.app.listen(this.port, () => {
            console.log(`Caching proxy server is listening on port ${this.port}`);
        })
    }

    clearCache() {
        this.cache.flushAll();
    }
}

export default CachingProxyServer;

