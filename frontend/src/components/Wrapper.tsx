import React from "react";
import { Box } from "@chakra-ui/react";

export type WrapperVariant = "small" | "medium";

interface WrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === "regular" ? "80vw" : "40vw"}
      w="100%"
    >
      <Box mx={2}>{children}</Box>
    </Box>
  );
};
