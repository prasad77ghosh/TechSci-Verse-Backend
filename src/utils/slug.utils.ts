export default function generateSlugName(name: string) {
  let randomNumber = Math.floor(Math.random() * 9000) + 1000;
  let slug = name.replace(/\s+/g, "_") + "_" + randomNumber;
  return slug.toLowerCase();
}
