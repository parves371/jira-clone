import { createSessionClient } from "@/lib/appwrite";

export const getCurent = async () => {
  try {
    const { account } = await createSessionClient();

    return await account.get();
  } catch (error) {
    return null;
  }
};
