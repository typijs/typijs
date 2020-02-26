import { HttpException } from './HttpException';

class NotFoundException extends HttpException {
    constructor(id?: string) {
        if(id) {
            super(404, `Document with id ${id} not found`);
        } else {
            super(404);
        }
    }
}

export { NotFoundException };