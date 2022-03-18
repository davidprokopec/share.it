import { Button } from "@chakra-ui/react";
import React from "react";
import { RegularUserFragment, useBanUserMutation } from "../generated/graphql";

interface BanButtonProps {
  user: RegularUserFragment;
}

export const BanButton: React.FC<BanButtonProps> = ({ user }) => {
  const [, banUser] = useBanUserMutation();
  return (
    <Button
      ml="auto"
      mr={{ md: 0, sm: "auto" }}
      mt={{ md: 0, sm: 4 }}
      colorScheme={user.banned ? "green" : "red"}
      onClick={() => {
        const action = user.banned ? "unban" : "ban";
        banUser({ username: user.username, action });
      }}
    >
      {user.banned ? "Odbanovat" : "Zabanovat"}
    </Button>
  );
};
