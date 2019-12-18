
import { forEach, has, get, isString, isArray, split, filter, isEmpty, map } from 'lodash';

const paramRegex = new RegExp("{(.*?)\}", "g");

const setUpRoutes = (middlewareObj, router, swaggerDoc, useBasePath) => {

  const basePath = useBasePath ? swaggerDoc.basePath : '';

  forEach(get(swaggerDoc, 'paths'), (path, key) => {
    forEach(path, (route, verb) => {

      if(/\\/.test(key)) {
        throw Error(`Invalid controller path: ${key}`)
      }

      const fullPath = basePath + key.replace(paramRegex, (m, p) => ':' + p);
      const controllerPath = get(route, 'x-controller');
      const middlewarePath = get(route, 'x-middleware');

      if(controllerPath) {

        if(has(middlewareObj, controllerPath)) {

          const controllerFunction = get(middlewareObj, controllerPath)

          if(middlewarePath) {

            if(isString(middlewarePath) || isArray(middlewarePath)) {
              const middlewarePaths = isString(middlewarePath) ? split(middlewarePath, ', ')
                : middlewarePath;

              const missingPaths = filter(middlewarePaths, p => !has(middlewareObj, p));

              if(!isEmpty(missingPaths)) {
                throw Error(`ERROR setting up ${fullPath} ${verb}: middlewares ${missingPaths.join(',')} not found`);
              }

              const middlewareFunctions = map(middlewarePaths, p => get(middlewareObj, p));

              router[verb](fullPath, middlewareFunctions, controllerFunction);
            }
            else {
              throw Error(`Invalid middleware path(s): ${middlewarePath}`);
            }
          }
          else {
            router[verb](fullPath, controllerFunction);
          }
        }
        else {
          throw Error(`ERROR setting up ${fullPath} ${verb}: ${controllerPath} not found`);
        }
      }
    })
  });
};

export { setUpRoutes };
