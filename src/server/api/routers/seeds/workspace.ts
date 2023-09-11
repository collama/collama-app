import { type Task } from "@prisma/client"

export const seedTasks: Pick<
  Task,
  "name" | "description" | "prompt" | "slug"
>[] = [
  {
    name: "Perform_calculations",
    slug: "perform_calculations",
    description:
      "Perform addition, subtraction, multiplication, and division operations with two variables",
    prompt:
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"You are an Math teacher "}]},{"type":"paragraph"},{"type":"paragraph","content":[{"type":"text","text":"Example:"},{"type":"hardBreak"},{"type":"text","text":"2 + 2 = 4"}]},{"type":"paragraph","content":[{"type":"text","text":"10 * 2 = 20"},{"type":"hardBreak"},{"type":"text","text":"15.5 - 0.5 = 15"}]},{"type":"paragraph"},{"type":"paragraph","content":[{"type":"variable","attrs":{"text":"Variable A","className":"text-indigo-700","blockId":"6CcENzrLw16K9-g0pligg","type":"text"}},{"type":"text","text":"  "},{"type":"variable","attrs":{"text":"Operator","className":"text-indigo-700","blockId":"6CcENzrLw16K9-g0pligg","type":"text"}},{"type":"text","text":" "},{"type":"variable","attrs":{"text":"Variable B","className":"text-indigo-700","blockId":"6CcENzrLw16K9-g0pligg","type":"text"}},{"type":"text","text":" = "}]}]}',
  },
  {
    name: "Check_eng_grammar",
    slug: "check_eng_grammar",
    description:
      "Help users enhance the accuracy and clarity of their English writing. It provides suggestions and corrections for various grammar aspects, making it valuable for students, professionals, and non-native English speakers looking to improve their written communication.",
    prompt:
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"You are an english teacher with over 10 years experience!"},{"type":"hardBreak"},{"type":"hardBreak"},{"type":"text","text":"you will check and fix below sentence:"},{"type":"hardBreak"},{"type":"hardBreak"},{"type":"variable","attrs":{"text":"The sentence","className":"text-indigo-700","blockId":"dMR6GyrO37orgaFsHhlkb","type":"text"}},{"type":"text","text":" "}]}]}',
  },
  {
    name: "Content",
    slug: "content",
    description: "Help you write a short sentence you can post to your social",
    prompt:
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"You are an content creator!"},{"type":"hardBreak"},{"type":"hardBreak"},{"type":"text","text":"Write for me a content about 100~300 characters for my "},{"type":"variable","attrs":{"text":"Industry","className":"text-indigo-700","blockId":"-FulXrBN8U4gpokoJlsO0","type":"text"}},{"type":"text","text":" i can post to my "},{"type":"variable","attrs":{"text":"Social","className":"text-indigo-700","blockId":"-FulXrBN8U4gpokoJlsO0","type":"text"}},{"type":"text","text":" page"}]}]}',
  },
  {
    name: "Translate",
    slug: "translate",
    description:
      "This prompt  is a versatile and powerful language translation tool designed to facilitate seamless communication across linguistic barriers. Whether you're a professional translator, a traveler exploring new cultures, a student learning a foreign language, or simply someone seeking to understand and connect with people from different linguistic backgrounds, this tool is your ultimate companion",
    prompt:
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"I want you to act as a "},{"type":"variable","attrs":{"text":"Input language","className":"text-indigo-700","blockId":"GxPEYlKdGKGYctCcmDQ8V","type":"text"}},{"type":"text","text":" teacher and translate "},{"type":"variable","attrs":{"text":"Input language","className":"text-indigo-700","blockId":"GxPEYlKdGKGYctCcmDQ8V","type":"text"}},{"type":"text","text":" to "},{"type":"variable","attrs":{"text":"Output language","className":"text-indigo-700","blockId":"GxPEYlKdGKGYctCcmDQ8V","type":"text"}},{"type":"text","text":" for beginner"}]}]}',
  },
]
