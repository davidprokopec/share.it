import { usePostQuery } from "../generated/graphql";
import { useGetIntId } from "./usetGetIntId";

export const useGetPostFromUrl = () => {
  const intId = useGetIntId();
  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};
