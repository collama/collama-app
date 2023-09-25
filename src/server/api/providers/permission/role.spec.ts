import { Role as PrismaRole } from "@prisma/client"
import { Role } from "~/server/api/providers/permission/role"

describe("Role", () => {
  test.each([
    [PrismaRole.Owner, PrismaRole.Admin, true],
    [PrismaRole.Owner, PrismaRole.Writer, true],
    [PrismaRole.Owner, PrismaRole.Reader, true],
    [PrismaRole.Owner, PrismaRole.Public, true],
    [PrismaRole.Admin, PrismaRole.Owner, false],
    [PrismaRole.Writer, PrismaRole.Admin, false],
    [PrismaRole.Reader, PrismaRole.Writer, false],
    [PrismaRole.Public, PrismaRole.Reader, false],
    [PrismaRole.Owner, PrismaRole.Owner, true],
  ])("gte", (a, b, expected) => {
    const roleA = new Role(a)
    const roleB = new Role(b)
    expect(roleA.gte(roleB)).toEqual(expected)
  })
})
