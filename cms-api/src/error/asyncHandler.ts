import { NextFunction, Request, Response, Router, RequestHandler } from 'express';

/**
 * Supported methods
 */
const methods: string[] = [
    'get',
    'post',
    'put',
    'patch',
    'delete'
]

/**
 * Wrapper around `async` request to catch error without `try` `catch` block
 * 
 * Usage:
 * 
 * ```typescript
 * app.get('/async', asyncHandler(async(req, res) => {
 *  const result = await request('http://example.com');
 *  res.end(result);
 * }));
 *```
 * 
 * @param func 
 */
export const asyncHandler = (func: RequestHandler) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(func(req, res, next)).catch(next)

/**
 * Wrapper in every route to catch error in async request
 * 
 * ```
 * const router = asyncRouterHandler(express().Router())
 * router.get('/async1', asyncController.action1)
 * router.get('/async2', asyncController.action2)
 * 
 * class asyncController {
 *      
 * }
 * ```
 * 
 * @param router 
 */
export const asyncRouterHandler = (router: Router): Router => {
    for (let key in router) {
        if (methods.includes(key)) {
            const method = router[key]
            router[key] = (path, ...callbacks) => method.call(router, path, ...callbacks.map(cb => asyncHandler(cb)))
        }
    }
    return router
}