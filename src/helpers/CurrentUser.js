import { fetchAuthSession } from 'aws-amplify/auth';

class currentUser {
    accessToken = null;
    idToken = null;
    loading = false;

    constructor() {
        // {this.username, this.userId, this.signinDetails} = null
        // this.setTokens();
    }

    async setTokens() {
        this.loading = true
        const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
        this.accessToken = accessToken;
        this.idToken = idToken;
        this.loading = false;
        return;
    }

    // callback is a function expecting a boolean input
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

    // callback is a function expecting a string
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