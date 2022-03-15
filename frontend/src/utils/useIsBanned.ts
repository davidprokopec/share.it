import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

export const useIsBanned = async () => {
  const router = useRouter();
  const [{ data, fetching }] = await useMeQuery();

  if (data?.me?.banned) {
    router.push("/banned");
  }
};
