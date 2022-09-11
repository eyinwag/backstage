/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

import { AzureWebManagementApi } from '../api';

export interface RouterOptions {
  logger: Logger;
  azureWebManagementApi: AzureWebManagementApi;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, azureWebManagementApi } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });
  router.get('/get', async (request, response) => {
    response.json(await azureWebManagementApi.list({ functionName: request.query['functionName']!.toString() }))
  });
  router.use(errorHandler());
  return router;
}
