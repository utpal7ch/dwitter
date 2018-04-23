import "reflect-metadata";
import { Handler, Router } from 'express';
import { Route } from './route';

export const routesKey = Symbol("routesKey");

function getMetaData(target: Object): Route[] {
    let routes: Route[] = Reflect.getMetadata(routesKey, target);
    if (!routes) {
        routes = [];
        Reflect.defineMetadata(routesKey, routes, target);
    }
    return routes;
}

export function customRoute(route: Route) {
    return <T extends Handler>(target: object, key: string, descriptor: TypedPropertyDescriptor<T>) => {
        const routes = getMetaData(target);
        const orignalHandler: any = descriptor.value;
        const handlers = [...route.handlers, orignalHandler];
        routes.push(new Route(route.method, route.path, ...handlers));
        return descriptor;
    };
}

export function getRouter(target: object): Router {
    const router: Router = Router();
    const routes = getMetaData(target);

    for (const route of routes) {
        const args = [route.path, ...route.handlers];
        (router as any)[route.method].apply(router, args);
    }
    return router;
}