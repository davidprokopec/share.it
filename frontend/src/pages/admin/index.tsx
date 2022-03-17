import {
  Badge,
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import moment from "moment";
import "moment/locale/cs";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import { BanButton } from "../../components/BanButton";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import {
  useBannedUsersQuery,
  useBanUserMutation,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsAdmin } from "../../utils/useIsAdmin";
import { useIsBanned } from "../../utils/useIsBanned";

export const Admin: React.FC = ({}) => {
  useIsBanned();
  useIsAdmin();

  return (
    <Layout>
      <Text fontWeight="bold" fontSize={20} textAlign="center" mb={5}>
        Admin panel
      </Text>
      <Flex bg="gray.100" rounded="md" p={5}></Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Admin);
