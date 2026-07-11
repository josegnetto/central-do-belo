import slugify from "slugify";

export function slugFromTitle(title: string): string {
  return slugify(title, { lower: true, strict: true, locale: "pt" });
}
