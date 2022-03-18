import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsOwner = async () => {
  const router = useRouter();
  const [{ data, fetching }] = await useMeQuery();

  if (data?.me?.banned) {
    router.push("/banned");
  }

  useEffect(() => {
    if (!fetching && data?.me?.role !== "owner") {
      router.replace("/");
    }
  }, [fetching, data, router]);
};
