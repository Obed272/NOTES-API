import { Request, Response } from "express";
export declare const createNote: (req: Request, res: Response) => Promise<void>;
export declare const getAllNotes: (req: Request, res: Response) => Promise<any>;
export declare const getSingleNote: (req: Request, res: Response) => Promise<any>;
export declare const updateNote: (req: Request, res: Response) => Promise<void>;
export declare const deleteNote: (req: Request, res: Response) => Promise<void>;
