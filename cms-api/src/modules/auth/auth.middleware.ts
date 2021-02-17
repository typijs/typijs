import { NextFunction, Request, Response } from "express";
import { Injectable } from "injection-js";
import { ForbiddenException, UnauthorizedException } from "../../error";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard {

    constructor(private authService: AuthService) { }

    /**
     * The middleware to check authenticated of auth guard
     */
    public checkAuthenticated = () => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isAuthenticated = this.authService.isAuthenticated(req);
            if (!isAuthenticated) throw new UnauthorizedException('Unauthorized!')
        } catch (err) {
            next(err);
        }
        next()
    }

    /**
     * The middleware to check if logged in user has roles
     * 
     * Check has roles: `admin` OR `editor`
     * ```
     * authGuard.checkRoles(['admin', 'editor'])
     * ```
     * Check has roles: `admin` AND `editor`
     * ```
     * authGuard.checkRoles([['admin'], ['editor']])
     * ```
     * Check has roles: `admin` AND (`editor` OR `visitor`)
     * ```
     * authGuard.checkRoles([['admin'], ['editor', 'visitor']])
     * ```
     * 
     * @param requiredRoles Array of roles
     */
    public checkRoles = (requiredRoles?: string[][] | string[]) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isAuthenticated = this.authService.isAuthenticated(req);
            if (!isAuthenticated) throw new UnauthorizedException('Unauthorized!')

            const { roles } = req['user'];
            const checkResult = this.authService.isInRoles(roles, requiredRoles);
            if (!checkResult) throw new ForbiddenException('Forbidden');
        } catch (err) {
            next(err);
        }
        next()
    }

    /**
     * Check permissions of auth guard (Not used anywhere)
     */
    public checkPermissions = (requiredPermissions?: string[][] | string[]) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isAuthenticated = this.authService.isAuthenticated(req);
            if (!isAuthenticated) throw new UnauthorizedException('Unauthorized!')

            //TODO: check has permission here
        } catch (err) {
            next(err);
        }
        next()
    }
}