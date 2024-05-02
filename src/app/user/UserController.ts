import { Request, Response } from "express"

module.exports = {
    getProfile: async (req: Request, res: Response) => {
        return res.json("Logged user data.");
    },
}