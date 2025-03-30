import axios from "axios";
import express from 'express';
import NodeCache from "node-cache";

class CachingProxyServer {
    constructor(port, origin) {
        this.port = port;
        this.origin = origin;
        this.cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
        this.app = express();
    }

    async handleRequest(req, res) {
        console.log(`Forwarding request to: ${this.origin}`);
        const cachedResponse = this.cache.get(this.origin);
        if (cachedResponse) {
            res.setHeader('X-cache', 'HIT');
            return res.status('200').send(cachedResponse.data);
        }

        try {
            const response = await axios.get(this.origin);
            const responseData = response.data;
            this.cache.set(this.origin, responseData);
            res.setHeader('X-cache', 'MISS');
            return res.status('200').send(responseData);
        } 
        catch(error) {
            console.error(`Request failed: ${error.response ? error.response.status : 500}`);
            res.status(error.response ? error.reponse.status : 500).send(error.message);
        }
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Caching proxy server is listening on port ${this.port}`);
        })
    }
}

