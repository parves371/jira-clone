import { z } from "zod";

export const createProjectschema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
  ]),
  workspaceId: z.string().min(1, "Required"),
});
export const updateProjectschema = z.object({
  name: z.string().trim().min(1, "must be at least 1 character").optional(),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
  ]),
});
