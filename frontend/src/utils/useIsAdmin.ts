import { useRouter } from "next/router";
import { useMeQuery } from "../generated/graphql";

export const useIsAdmin = async () => {
  const router = useRouter();
  const [{ data }] = await useMeQuery();

  if (data?.me?.role !== "admin" && data?.me?.role !== "owner") {
    router.push("/");
  }
};
