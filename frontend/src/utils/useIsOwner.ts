import { useRouter } from "next/router";
import { useMeQuery } from "../generated/graphql";

export const useIsOwner = async () => {
  const router = useRouter();
  const [{ data, fetching }] = await useMeQuery();

  if (!fetching && data?.me?.role !== "owner") {
    router.replace("/");
  }
};
