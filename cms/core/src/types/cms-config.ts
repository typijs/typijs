export interface CmsConfigOption {
    /**
     * The first segment of route to access the edit and admin view. Default `/typijs`
     *
     * For example:
     *
     * `adminRoute = '/typijs'` -> edit route: `/typijs/edit`, admin route: `/typijs/admin`
     */
    adminRoute?: string;

    /**
     * The configuration file path from which the CMS wil load config on init
     *
     * For example:
     *
     * `configFilePath = '/assets/config.json'`
     *
     * Note: the config path must register as asset in angular.json
     */
    configFilePath?: string;
}
