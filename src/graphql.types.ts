
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Author {
    id: string;
    name: string;
}

export interface IQuery {
    author(id: string): Author | Promise<Author>;
    material(id: string): Material | Promise<Material>;
    materials(): Material[] | Promise<Material[]>;
}

export interface Reference {
    material: Material;
}

export interface Authorship {
    author: Author;
}

export interface Material {
    id: string;
    title: string;
    isbn13?: Nullable<string>;
    cover?: Nullable<string>;
    authorships: Authorship[];
    references: Reference[];
}

type Nullable<T> = T | null;
