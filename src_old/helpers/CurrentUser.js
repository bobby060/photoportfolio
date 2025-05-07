import { fetchAuthSession } from 'aws-amplify/auth';


/**
 * @brief interface for acessing current user
 * 
 * @author Robert Norwood
 * 
 * A new currentUser should be initialized by each component that needs to access the current user.
 * 
 * This prevents repeating multiple calls that are used repeatedly
 * 
 */
class currentUser {
    accessToken = null;
    idToken = null;
    loading = false;



    /**
     * @brief Get current auth session and set tokens
     * 
     * Loads relevant data into the object instance from the amplify auth api
     * 
     * @todo make private
     * 
     * @returns 
     */
    async setTokens() {
        this.loading = true
        const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
        this.accessToken = accessToken;
        this.idToken = idToken;
        this.loading = false;
        return;
    }

    /**
     * @brief Checks if admin
     * 
     * Due to how React states work, does not return a boolean. Instead, calls the input callback
     * with the value of if current user is admin.
     * 
     * Intended use case: input function is the setState function for a local state defining
     * whether current user is admin
     * 
     * @param {*} callback function expecting a boolean input
     */
    async isAdmin(callback) {
        await this.setTokens();
        // this.checkLoading().then((result) => {
        if (!this.accessToken
            || !this.accessToken.payload['cognito:groups']) {
            callback(false);
        } else if (this.accessToken.payload['cognito:groups'][0] === "portfolio_admin") {
            callback(true);
        } else {
            callback(false);
        }
    }

    /**
     * @brief Extracts username and passes to callback
     * 
     * @see isAdmin for information on callbacks and currentUser class
     * 
     * 
     * 
     * @param {*} callback  function expecting a username as input
     */
    async userName(callback) {
        await this.setTokens();
        // this.checkLoading().then((result) => {
        if (this.idToken) {
            callback(this.idToken.payload['cognito:username']);
        } else {
            callback(null);
        }
        // })
    }


}

export default currentUser;