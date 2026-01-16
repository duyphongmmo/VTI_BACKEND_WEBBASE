import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class HiddenFilesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const hiddenPaths = ['/_darcs', '/.bzr', '/.hg', '/BitKeeper'];
    next();
  }
}