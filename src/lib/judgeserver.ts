import jwt from 'jsonwebtoken'
import JudgeTokenModel from '../models/judgeservers';
import Queue from './Queue';
import { IJudgeServerToken } from '../types/main';

export class JudgeServers {
    static queue: { [slug: string]: Queue<string> } = {};
    static verfiytoken = (token: string): null | { slug: string, name: string } => {
        try {
            let ret: { slug: string, name: string } = jwt.verify(token, process.env.TOKENSECRET ?? "HELLO") as { slug: string, name: string };
            return ret;
        }
        catch (err) {
            return null;
        }
    }
    static addNewSubmission = (submission_id: string, contest_slug: string) => {
        if (JudgeServers.queue[contest_slug]) {
            JudgeServers.queue[contest_slug].enqueue(submission_id)
        }
        else {
            JudgeServers.queue[contest_slug] = new Queue<string>;
            JudgeServers.queue[contest_slug].enqueue(submission_id)
        }
    }
    static getSubmissionIdToRun = (contest_slug:string):string|null=>{
        if(JudgeServers.queue[contest_slug]?.isEmpty()) return null;
        return JudgeServers.queue[contest_slug].dequeue()??"";
    }

}
export const addNewServerTokens = async (servers: IJudgeServerToken[]): Promise<(IJudgeServerToken & { id: string })[]> => {
    try {
        let ret: (IJudgeServerToken & { id: string })[] = [];
        for (let i = 0; i < servers.length; i++) {
            let newServer = new JudgeTokenModel({
                ...servers[i]
            });
            try {
                await newServer.save();
                ret.push({
                    ...servers[i],
                    id: newServer._id
                })
            } catch (err) { }
        }
        return ret;
    } catch (err) {
        return [];
    }
}
export const deleteAServer = async (id: string): Promise<boolean> => {
    try {
        (await JudgeTokenModel.deleteOne({ _id: id }));
        return true;

    } catch (err) {
        return false;
    }
}
export const getAllServerOfAContest = async (slug: string): Promise<(IJudgeServerToken & { id: string })[]> => {
    try {
        let ret = await JudgeTokenModel.find({ slug });
        let ___: (IJudgeServerToken & { id: string })[] = ret.map((item, key) => ({
            name: item.name,
            slug: item.slug,
            token: item.token,
            status: item.status,
            id: item._id
        }))
        return ___;

    } catch (err) {
        return [];
    }
}

