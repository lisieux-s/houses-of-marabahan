import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { House } from '@prisma/client';

import houseRepository from '../repositories/houseRepository.js';
import itemRepository from '../repositories/itemRepository.js';

export type HouseData = Omit<House, 'id'>;

export async function findByName(name: string) {
  return await houseRepository.findByName(name);
}

export async function signUp(createHouseData: HouseData, item: string) {
  if (await findByName(createHouseData.name)) {
    throw {
      type: 'CONFLICT',
      message: 'A house with this name already exists.',
    };
  }

  const passwordHash = bcrypt.hashSync(createHouseData.password, 8);
  await houseRepository.create({ ...createHouseData, password: passwordHash });
  const house = await houseRepository.findByName(createHouseData.name);
  switch (item) {
    case 'shovel':
      await itemRepository.addToStorage(1, house.id);
    case 'sword':
      await itemRepository.addToStorage(2, house.id);
    case 'knitting kit':
      await itemRepository.addToStorage(3, house.id);
  }
}

export async function signIn(signInData: HouseData) {
  const house = await getHouseOrFail(signInData);
  return jwt.sign({ houseId: house.id }, process.env.JWT_SECRET);
}

async function getHouseOrFail(signInData: HouseData) {
  const house = await findByName(signInData.name);
  if (!house) throw { type: 'UNAUTHORIZED', message: 'There is no such house' };
  if (!bcrypt.compareSync(signInData.password, house.password))
    throw { type: 'UNAUTHORIZED', message: 'Incorrect password' };
  return house;
}
