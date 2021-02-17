import * as httpStatus from 'http-status';
import { Exception } from '../../error';

export class DuplicateStartPageException extends Exception {
    constructor(startPageId: string, message?: string) {
        super(httpStatus.BAD_REQUEST, message ? message : `Each site must have a unique start page and they cannot be nested`);
    }
}

export class DuplicateSiteNameException extends Exception {
    constructor(siteName: string, message?: string) {
        super(httpStatus.BAD_REQUEST, message ? message : `There is already a site with name ${siteName}`);
    }
}

/**
 * Duplicate host name exception per site
 */
export class DuplicateHostNameException extends Exception {
    constructor(hostName: string, message?: string) {
        super(httpStatus.BAD_REQUEST, message ? message : `There is already a host with name ${hostName}`);
    }
}

/**
 * Multiple primary host exception per language
 */
export class MultiplePrimaryHostException extends Exception {
    constructor(languageCode: string, message?: string) {
        super(httpStatus.BAD_REQUEST, message ? message : `There are multiple primary hosts for language(s) ${languageCode}`);
    }
}

/**
 * Host name is already used in other site
 */
export class HostNameAlreadyUsedException extends Exception {
    constructor(hostName: string, siteName: string, message?: string) {
        super(httpStatus.BAD_REQUEST, message ? message : `${hostName} is already used in site ${siteName}`);
    }
}