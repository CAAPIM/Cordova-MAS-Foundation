var MASPluginApplication = {
	
	MASAuthenticationStatus: {
        
        /**
     	 *  MASAuthenticationStatusNotLoggedIn represents that the app has not been authenticated.
     	 */    
        MASAuthenticationStatusNotLoggedIn: -1,
        
        /**
     	 *  MASAuthenticationStatusLoginWithUser represents that the app has been authenticated with user.
     	 */
        MASAuthenticationStatusLoginWithUser: 0,

        /**
     	 *  MASAuthenticationStatusLoginAnonymously represents that the app has been authenticated with client credentials.
     	 */ 
        MASAuthenticationStatusLoginAnonymously: 1
    },
};

module.exports = MASPluginApplication;