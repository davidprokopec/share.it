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
import {
  RegularUserFragment,
  useSetAdminUserMutation,
} from "../generated/graphql";

interface SetAdminPopoverProps {
  user: RegularUserFragment;
}

export const SetAdminPopover: React.FC<SetAdminPopoverProps> = ({ user }) => {
  const [, setAdminUser] = useSetAdminUserMutation();

  const toast = useToast();

  const color = user.role === "admin" ? "red" : "green";
  const note = user.role === "admin" ? "Odebrat práva" : "Udělit práva";
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
                const action = user.role === "admin" ? "remove" : "add";
                const response = await setAdminUser({
                  username: user.username,
                  action,
                });
                const status = response.data?.setAdminUser.status as
                  | "info"
                  | "warning"
                  | "success"
                  | "error"
                  | undefined;
                if (!response.data) {
                  toast({
                    title: "Něco se nepodařilo",
                    description:
                      action === "remove"
                        ? "Při odebíraní práv se něco nezdařilo."
                        : "Při přidělování práv se něco nezdařilo.",
                    status: "error",
                    duration,
                    isClosable: true,
                  });
                }
                if (response.data?.setAdminUser.error) {
                  toast({
                    title:
                      action === "remove"
                        ? "Účtu nebyla odebrána práva."
                        : "Účtu nebyla přidělena práva.",

                    description: response.data.setAdminUser.error,
                    status,
                    duration,
                    isClosable: true,
                  });
                } else {
                  toast({
                    title:
                      action === "remove"
                        ? "Uživateli byla odebrána práva."
                        : "Uživateli byla přidělena práva",
                    description:
                      action === "remove"
                        ? "Uživateli " +
                          response.data?.setAdminUser.user?.username +
                          " byla odebrána práva."
                        : "Uživateli " +
                          response.data?.setAdminUser.user?.username +
                          " byla přidělena práva.",
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
