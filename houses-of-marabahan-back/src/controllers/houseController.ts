import { Request, Response } from 'express';

import * as houseService from '../services/houseService.js';

export async function createHouse(req: Request, res: Response) {
  const { houseData } = req.body;
  const starterItem = req.body.starterItem;
  console.log(starterItem);

  await houseService.signUp(houseData, starterItem);
  res.sendStatus(201);
}

export async function signIn(req: Request, res: Response) {
  const signInData = req.body;
  const token = await houseService.signIn(signInData);
  res.send({ token });
}

export async function checkNameAvailability(req: Request, res: Response) {
  const { name } = req.params;
  const result = await houseService.findByName(name);
  if (result) return res.send(true);
  res.send(false);
}
