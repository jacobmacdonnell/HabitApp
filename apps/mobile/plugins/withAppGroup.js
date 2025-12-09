const { withEntitlementsPlist, withInfo } = require('@expo/config-plugins');

const withAppGroup = (config, { groupIdentifier }) => {
    if (!groupIdentifier) {
        throw new Error('withAppGroup: Missing groupIdentifier prop');
    }

    // 1. Add Entitlement
    config = withEntitlementsPlist(config, (config) => {
        config.modResults['com.apple.security.application-groups'] = [
            groupIdentifier,
        ];
        return config;
    });

    return config;
};

module.exports = withAppGroup;
