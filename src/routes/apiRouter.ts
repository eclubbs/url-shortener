import { Router } from 'express';
import ShortenedUrlRoutes from './ShortenedUrlRoutes';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ----------------------- Add UserRouter --------------------------------- //

apiRouter.get("/:key", ShortenedUrlRoutes.get);
apiRouter.post("/urls/add", ShortenedUrlRoutes.add);

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
