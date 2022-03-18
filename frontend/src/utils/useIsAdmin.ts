import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAdmin = async () => {
  const router = useRouter();
  const [{ data, fetching }] = await useMeQuery();

  if (data?.me?.banned) {
    router.push("/banned");
  }

  useEffect(() => {
    if (!fetching && data?.me?.role !== "admin") {
      router.replace("/");
    }
  }, [fetching, data, router]);
};
