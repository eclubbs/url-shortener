import { Router } from 'express';
import UserRoutes from './ShortenedUrlRoutes';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ----------------------- Add UserRouter --------------------------------- //

apiRouter.get("/:key", UserRoutes.get);
apiRouter.post("/urls/add", UserRoutes.add);

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
