import { fetchAuthSession } from 'aws-amplify/auth';

class currentUser {
    accessToken = null;
    idToken = null;
    loading = false;
    constructor() {
        // {this.username, this.userId, this.signinDetails} = null
        this.setTokens();
    }

    async checkLoading() {
        if (this.loading) {
            await this.setTokens();
        }
    }

    async setTokens() {
        const { access, id } = (await fetchAuthSession()).tokens ?? {};

        this.accessToken = access;
        this.idToken = id;
    }

    async isAdmin() {
        await this.checkLoading();
        if (!this.accessToken
            || !this.accessToken.payload['cognito:groups']) {
            return false;
        } else if (this.accessToken.payload['cognito:groups'][0] === "portfolio_admin") {
            return true;
        } else {
            return false;
        }
    }

    async userName() {
        if (this.idToken) {
            return this.idToken.payload['cognito:username']
        } else {
            return null;
        }
    }


}

export default currentUser;