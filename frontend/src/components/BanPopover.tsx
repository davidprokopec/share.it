import {
  Button,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { RegularUserFragment, useBanUserMutation } from "../generated/graphql";

interface BanPopoverProps {
  user: RegularUserFragment;
}

export const BanPopover: React.FC<BanPopoverProps> = ({ user }) => {
  const [, banUser] = useBanUserMutation();

  const toast = useToast();

  const color = user.banned ? "green" : "red";
  const note = user.banned ? "Odbanovat" : "Zabanovat";
  const duration = 2000;

  return user.role === "owner" ? null : (
    <Popover>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <Button mt={1} colorScheme={color}>
              {note}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <Button
              colorScheme={color}
              onClick={async () => {
                const action = user.banned ? "unban" : "ban";
                const response = await banUser({
                  username: user.username,
                  action,
                });
                const status = response.data?.banUser.status as
                  | "info"
                  | "warning"
                  | "success"
                  | "error"
                  | undefined;
                if (!response.data) {
                  toast({
                    title: "Něco se nepodařilo",
                    description:
                      action === "ban"
                        ? "Při banování se něco nezdařilo."
                        : "Při odbanování se něco nezdařilo.",
                    status: "error",
                    duration,
                    isClosable: true,
                  });
                }
                if (response.data?.banUser.error) {
                  toast({
                    title:
                      action === "unban"
                        ? "Účet nebyl odbanován"
                        : "Účet nebyl zabanován",

                    description: response.data.banUser.error,
                    status,
                    duration,
                    isClosable: true,
                  });
                } else {
                  toast({
                    title:
                      action === "unban"
                        ? "Účet byl úspěšně odbanován"
                        : "Účet byl úspěšně zabanován",
                    description:
                      action === "ban"
                        ? "Uživatel " +
                          response.data?.banUser.user?.username +
                          " byl zabanován."
                        : "Uživatel " +
                          response.data?.banUser.user?.username +
                          " byl odbanován.",
                    status,
                    duration,
                    isClosable: true,
                  });
                }
                onClose();
              }}
            >
              {note}!
            </Button>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
