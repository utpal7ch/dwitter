import * as express from 'express';
import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { App, AppToken } from './app';
import { InjectionToken } from './injection-token';
import { AccountController, IAccountController, AccountControllerToken } from './account';
import { AccountDb, IAccountDb, AccountDbToken } from './account';
import { DweetController, IDweetController, DweetControllerToken } from './dweet';
import { DweetDb, IDweetDb, DweetDbToken } from './dweet';
import { DweeterController, IDweeterController, DweeterControllerToken } from './dweeter';
import { DweeterDb, IDweeterDb, DweeterDbToken } from './dweeter';

const container = new Container();

// express
container.bind<express.Application>(InjectionToken.ExpressApplicationToken)
    .toDynamicValue((context: interfaces.Context) => {
        return express();
    });

container.bind<App>(AppToken).to(App);

// Account
container.bind<IAccountController>(AccountControllerToken).to(AccountController);
container.bind<IAccountDb>(AccountDbToken).to(AccountDb);

// Dweet
container.bind<IDweetController>(DweetControllerToken).to(DweetController);
container.bind<IDweetDb>(DweetDbToken).to(DweetDb);

// Dweeter
container.bind<IDweeterController>(DweeterControllerToken).to(DweeterController);
container.bind<IDweeterDb>(DweeterDbToken).to(DweeterDb);

export { container };
