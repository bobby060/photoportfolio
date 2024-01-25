import { downloadData, uploadData } from "aws-amplify/storage";

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
        return (config.environments[config.currentEnvironment][key]);
    }

    updateValue(key, newValue) {
        config.environments[config.currentEnvironment][key] = newValue;
        return;
    }

    getCurrentEnvironment() {
        return config.currentEnvironment;
    }

    setCurrentEnvironment(value) {
        console.log(value);
        config.currentEnvironment = value;
        console.log(value);
    }

    async save() {
        const file = JSON.stringify(config);
        try {
            const result = await uploadData({
                key: 'portfolio-config.json',
                data: file
            }).result;
            console.log('Successfully saved config changes: ', result)
        } catch (error) {
            console.warn('Error, config not saved: ', error);
        }
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
