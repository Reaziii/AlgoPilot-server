import UserModel from "../models/user";
import AuthorModel from "../models/author";
import { IUser } from "../types/main";
export const get_all_users = async (limit: number, start: number, email?: string): Promise<{ users: IUser[] }> => {
    try {
        let users: IUser[] = [];
        if (email) users = await UserModel.find({ email: email });
        else users = await UserModel.find().limit(limit).skip(limit * start);
        return { users: users }
    } catch (err) {
        return { users: [] }
    }
}

export const checkContestCreationPermission = async (email: string): Promise<Boolean> => {
    try {
        let user = await UserModel.findOne({ email: email });
        if (!user) return false;
        if (user.permission.admin || user.permission.create_contest) return true;
        return false
    } catch (err) {
        return false;
    }
}

export const checkProblemCreationPermission = async (email: string): Promise<Boolean> => {
    try {
        let user = await UserModel.findOne({ email: email });
        if (!user) return false;
        if (user.permission.admin || user.permission.create_problem) return true;
        return false
    } catch (err) {
        return false;
    }
}

export const checkProblemAdminPermission = async (email: string): Promise<Boolean> => {
    try {
        let user = await UserModel.findOne({ email: email });
        if (!user) return false;
        if (user.permission.admin) return true;
        return false
    } catch (err) {
        return false;
    }
}

export const checkAddProblemToContestPermission = async (email: string, slug: string): Promise<Boolean> => {
    try {
        let author = await AuthorModel.findOne({ email, slug });
        if (!author) return false;
        return true;

    } catch (err) {
        return false;
    }

}



export const updateUsersPermission = async (item:string, email:string):Promise<boolean>=>{
    try{
        let User = await UserModel.findOne({email});
        if(!User) return false;
        if(item==='admin') User.permission.admin = !User.permission.admin;
        if(item==='contest') User.permission.create_contest = !User.permission.create_contest;
        if(item==='problem') User.permission.create_problem = !User.permission.create_problem;
        await User.save();
        return true;
    }catch(err){
        return false;
    }
}

export const DeleteUser = async (email:string):Promise<Boolean>=>{
    try{
        let User = await UserModel.findOne({email});
        if(!User) return false;
        await User.deleteOne();
        return true;
    }catch(err) {
        return false;
    }
}

