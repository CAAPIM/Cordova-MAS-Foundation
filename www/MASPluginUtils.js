

var MASPluginUtils = {
	
	this.isEmpty = function isEmpty(val) {
        
        if (typeof val !== 'undefined' && val) {
            
            return false;
        }
        
        return true;
    }
};

module.exports = MASPluginUtils;