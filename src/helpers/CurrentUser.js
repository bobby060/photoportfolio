import { fetchAuthSession } from 'aws-amplify/auth';

class currentUser {
    accessToken = null;
    idToken = null;
    constructor() {
        // {this.username, this.userId, this.signinDetails} = null
        this.setTokens();
    }

    async setTokens() {
        const { access, id } = (await fetchAuthSession()).tokens ?? {};

        this.accessToken = access;
        this.idToken = id;
    }

    isAdmin() {
        if (!this.accessToken
            || !this.accessToken.payload['cognito:groups']) {
            return false;
        } else if (this.accessToken.payload['cognito:groups'][0] === "portfolio_admin") {
            return true;
        } else {
            return false;
        }
    }

    userName() {
        if (this.idToken) {
            return this.idToken.payload['cognito:username']
        } else {
            return null;
        }
    }


}

export default currentUser;