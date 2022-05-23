import { prisma } from '../database.js';

import { CreateItemData } from '../services/itemService.js';

export async function create(createItemData: CreateItemData) {
  await prisma.item.create({
    data: {
      name: createItemData.name,
      categoryId: createItemData.categoryId,
      description: createItemData.description,
    },
  });
}

export async function updateName(id: number, name: string) {
  await prisma.item.update({
    where: { id },
    data: { name },
  });
}

export async function updateDescription(id: number, description: string) {
  await prisma.item.update({
    where: { id },
    data: { description },
  });
}

export async function updateCategoryId(id: number, categoryId: number) {
  await prisma.item.update({
    where: { id },
    data: { categoryId },
  });
}

export async function findMany() {
  return await prisma.item.findMany({
    include: { category: { select: { name: true } } },
  });
}

export async function findByName(name: string) {
  return await prisma.item.findUnique({
    where: { name },
  });
}
export async function findById(id: number) {
  return await prisma.item.findUnique({
    where: { id },
    include: { category: {
      select: { name: true }
    } }
  });
}

export async function addToStorage(itemId: number, houseId: number) {
  await prisma.houseItem.create({
    data: {
      itemId,
      houseId,
    },
  });
}

export async function moveToStorage() {}
export async function addToInventory() {}
export async function moveToInventory() {}
