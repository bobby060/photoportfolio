/** Config.js
 * 
 * Interface for the config file stored in AWS.
 * 
 * Creates a config class, then creates a static public instance of that class so other
 * elements of the project can access it. This allows the site to only request the 
 * config file once per session.
 * 
 * The config file is a JSON file that stores a list of environments, each with their own set of environmental variables
 * and also the current environment for the web app. This allows different elements of the site to pull persistent data for the site.
 * 
 * Keeping persistent data in a config file allows the admin to update this data dynamically (when permitted by the webapp)
 * or by editing the config file, rather than having to hard code information like api endpoints into the code base
 * 
 * 
 * 
 * @author Robert Norwood
 * @date 10/10/2023
 * 
 */
import { downloadData, uploadData } from "aws-amplify/storage";

let instance;
// Json format holding config
let config = {
    "currentEnvironment": "notFound",
    "environments": {
        "notFound": {
            "featuredTagId": "xxx",
            "imageDeliveryHost": "xxx"
        }
    }
}


/**
 * @brief Object that handles interacting with remote config file
 * 
 */
class Config {

    // Only allow at most one instance to be created
    constructor() {
        if (instance) {
            throw new Error("New instance cannot be created")
        }
        instance = this;
    }

    /**
     * @brief Gets the config value for the current environment
     * 
     * @param {string} key 
     * @returns value for that key in current environment
     */
    getValue(key) {
        return (config.environments[config.currentEnvironment][key]);
    }

    /** 
     * @brief Stores a config value
     * 
     * Save must be called to update value in cloud
     * 
     * @param {string} key Key to set
     * @param {string} newValue Value to store to key
     * 
     */
    updateValue(key, newValue) {
        config.environments[config.currentEnvironment][key] = newValue;
        return;
    }

    /**
     * @brief Get the current environment
     * 
     * Usually dev or staging
     * 
     * @returns {string} Current environment
     */
    getCurrentEnvironment() {
        return config.currentEnvironment;
    }

    /**
     * @brief Get the current environment
     * 
     * Usually dev or staging
     * 
     * Save must be called to persist changes across other sessions
     * 
     * @returns {string} Current environment
     */
    setCurrentEnvironment(value) {
        console.log(value);
        config.currentEnvironment = value;
        console.log(value);
    }

    /**
     * @brief save local edits to the lcoud
     * 
     * Jsonify config and save it to cloud provider
     */
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

    /**
     * @brief Pull config from cloud provider
     *
     * Updates the config
     */
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
            console.warn('config not loaded: ', error);
        }

        config = JSON.parse(config);
    }

}

let projectConfig = Object.freeze(new Config());

export default projectConfig;
