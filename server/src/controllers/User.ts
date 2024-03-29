import { Request, Response } from "express";
import User from "../models/User";
import { handleValidationErrors } from "../utils/SchemaExceptionHandler";
import {userParamsValidation, UserSchemaValidation} from "../validations/UserValidation";
import jwt from "jsonwebtoken";
import Jwt from "utils/jwt";
import { z } from "zod";
import { hashPassword } from "utils/cryptog";
import BookmarkModel from "models/Bookmarks";

class UserController {
    public async store(req: Request, res: Response) {
        try {
            const { body } = req;
            const userCreationBody = UserSchemaValidation.parse(body);
            userCreationBody.password = await hashPassword(userCreationBody.password);
            
            const user = new User(userCreationBody);
            const savedUser = await user.save();
            const token = new Jwt(user.id, 3600); 
            token.sign();
            return res.status(200).json(token);
        } catch(err) {
           err = err instanceof z.ZodError ? handleValidationErrors(res, err) : err;
           return res.status(500).json(err);
        }
    }

    public async all(req: Request, res:Response) {
        const users = await User.find().select({"email": 1, "country": 1});
        return res.status(200).json(users);
    }

    public async byUserId(req: Request, res: Response) {
        const headers = req.headers;
        const { id: userId } = userParamsValidation.parse(req.params);
        const user = await User.findById(userId);
        
        return res.status(200).json(user);
    }

    public async info(req:Request, res:Response) {
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token);
        let requestedUser: {email:string, country: string};
        if(!token) return res.status(400).json({ error: "You are not logged in yet"});

        jwt.verify(token, process.env.JWT_SECRET as string,
                    async (err:any, user:any) => {
                        if(err) return res.status(400).json({ error: "Invalid Token"});
                        requestedUser = await User.findById(user.id).select({"email": 1, "country": 1});
                        return res.status(200).json(requestedUser)
                });
    };

    public async delete(req: Request, res: Response) {
       const { id: userId } = userParamsValidation.parse(req.params);
       const user = await User.findById(userId);
       if(!user) return res.status(400).json({ message: "User not found" });

       await user?.deleteOne();
       return res.status(200).json({ message: "User was deleted" });
    }

    public async addBookmark(req:Request, res:Response) {
        const bookmarkValidator = z.object({
            link: z.string(),
            title: z.string(),
            userId: z.string()
        })
        
        const { userId,title,link} = bookmarkValidator.parse(req.body);

        await User.findByIdAndUpdate(userId, {$push: { bookmarks: { title, link } }});
        return res.sendStatus(200);
    }

}

export default new UserController();
