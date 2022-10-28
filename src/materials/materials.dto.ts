export type MaterialDto = {
  id: string;
  title: string;
  isbn13: string | null;
};

export type AuthorshipDto = {
  authorId: string;
  materialId: string;
  roles: string[] | null;
};
