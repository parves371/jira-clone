import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.auth.signUp)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.signUp)["$post"]>;

export const useSignUp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.auth.signUp.$post({
        json,
      });
      return await res.json();
    },
  });

  return mutation;
};
