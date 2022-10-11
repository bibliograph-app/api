
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
}

export interface Material {
    id: string;
    title: string;
}

type Nullable<T> = T | null;
