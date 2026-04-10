import { db } from "./db";

const isDev =
  process.env.DEV_BYPASS_AUTH === "true" &&
  process.env.NODE_ENV !== "production";

async function getClerkAuth() {
  const { auth, currentUser } = await import("@clerk/nextjs/server");
  return { auth, currentUser };
}

export async function getOrCreateUser() {
  if (isDev) {
    let user = await db.user.findUnique({ where: { clerkId: "dev_user" } });
    if (!user) {
      user = await db.user.create({
        data: {
          clerkId: "dev_user",
          email: "dev@localhost",
          name: "Dev User",
        },
      });
    }
    return user;
  }

  const { auth, currentUser } = await getClerkAuth();
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  let user = await db.user.findUnique({ where: { clerkId } });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    user = await db.user.create({
      data: {
        clerkId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name:
          `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
          null,
      },
    });
  }

  return user;
}

export async function requireUser() {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
