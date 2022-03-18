import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIsBanned = async () => {
  const router = useRouter();
  const [{ data, fetching }] = await useMeQuery();

  if (data?.me?.banned) {
    router.push("/banned");
  }

  useEffect(() => {
    if (!fetching && !data?.me?.banned) {
      router.replace("/");
    }
  }, [fetching, data, router]);
};
