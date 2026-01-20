import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export const requireCmsSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return null;
  }
  return session;
};
