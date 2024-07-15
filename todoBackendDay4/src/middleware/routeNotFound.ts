import { Request, Response, NextFunction } from "express";
import NotFoundError from "../error/notFoundError"; // Adjust import as needed

// Middleware to catch non-existent routes
function handleNotFoundRoutes(req: Request, res: Response, next: NextFunction) {
  next(new NotFoundError("Route not found"));
}

export default handleNotFoundRoutes;
