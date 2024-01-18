import { downloadData } from "aws-amplify/storage";

let instance;

let config = {
    "currentEnvironment": "notFound",
    "environments": {
        "notFound": {
            "featuredTagId": "xxx",
            "imageDeliveryHost": "xxx"
        }
    }
}

class Config {
    constructor() {
        if (instance) {
            throw new Error("New instance cannot be created")
        }
        instance = this;
    }

    getValue(key) {
        const cEnv = config.currentEnvironment;
        return (config.environments[cEnv][key]);
    }

    async updateConfig() {
        try {
            const configResult = await downloadData({
                key: 'portfolio-config.json',
                options: {
                    accessLevel: 'guest'
                }
            }).result;
            config = await configResult.body.text();
        } catch (error) {
            console.warn('config not loaded', error);
        }

        config = JSON.parse(config);
    }

}

let projectConfig = Object.freeze(new Config());

export default projectConfig;
