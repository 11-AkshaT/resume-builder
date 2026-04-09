import { db } from "./db";

export async function canExportResume(
  userId: string,
  resumeId: string
): Promise<boolean> {
  const lifetimeUnlock = await db.resumeUnlock.findFirst({
    where: {
      userId,
      unlockType: "lifetime",
      status: "paid",
    },
  });

  if (lifetimeUnlock) return true;

  const singleUnlock = await db.resumeUnlock.findFirst({
    where: {
      userId,
      resumeId,
      unlockType: "single",
      status: "paid",
    },
  });

  return !!singleUnlock;
}

export async function hasLifetimeAccess(userId: string): Promise<boolean> {
  const unlock = await db.resumeUnlock.findFirst({
    where: {
      userId,
      unlockType: "lifetime",
      status: "paid",
    },
  });

  return !!unlock;
}
