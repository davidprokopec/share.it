import { useRouter } from "next/router";
import { useMeQuery } from "../generated/graphql";

export const useIsAdmin = async () => {
  const router = useRouter();
  const [{ data, fetching }] = await useMeQuery();

  if (!fetching && data?.me?.banned) {
    router.replace("/banned");
  }

  if (!fetching && data?.me?.role !== "admin" && data?.me?.role !== "owner") {
    router.replace("/");
  }
};
