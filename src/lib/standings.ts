import StandingsModel from "../models/Standings"
import { get_problems } from "./contest";


export const getStandings = async (slug: string) => {
    let standingss = await StandingsModel.find({ cid: slug });
    let problems = await get_problems(slug, "")
    let standing: {
        [email: string]: {
            submissions: { total_submit: number, penalty: number, status: boolean, delay: number }[],
            penalty: number,
            name: string,
            ac: number
        };

    } = {}

    for (let i = 0; i < standingss.length; i++) {
        if (!standing[standingss[i].email]) {
            standing[standingss[i].email] = {
                submissions: new Array(problems.problems.length + 2).fill(null).map(item => ({
                    total_submit: 0,
                    penalty: 0,
                    status: false,
                    delay: 0
                })),
                penalty: 0,
                name: standingss[i].name,
                ac: 0
            }
        }
        let email = standingss[i].email;

        if (standingss && standing[email]) {
            standing[email].submissions[standingss[i].position].total_submit += 1;
            if (standingss[i].status) {
                standing[email].submissions[standingss[i].position].status = standingss[i].status;
                standing[email].submissions[standingss[i].position].delay = standingss[i].delay;

            }
            if (standing[email].submissions[standingss[i].position].status) {
                standing[email].submissions[standingss[i].position].penalty = (standing[email].submissions[standingss[i].position].total_submit - 1) * 20 + standing[email].submissions[standingss[i].position].delay

            }
        }
    }

    let final: {
        submissions: { total_submit: number, penalty: number, status: boolean, delay: number }[],
        penalty: number,
        email: string,
        name: string,
        ac: number
    }[] = [];

    Object.keys(standing).forEach(item => {
        let ac = 0;
        standing[item].submissions.forEach(element => {
            standing[item].penalty += element.penalty;
            ac = ac + ((element.status === true) ? 1 : 0);
        });
        final.push({
            email: item,
            submissions: standing[item].submissions,
            name: standing[item].name,
            penalty: standing[item].penalty,
            ac
        })
    });
    final = final.sort((a1, a2) => {
        if (a1.ac < a2.ac) return 1;
        else if (a1.ac > a2.ac) return -1;
        else if (a1.penalty > a2.penalty) return 1;
        return -1;
    })
    return {
        standings: final,
        totalProblem: problems.problems.length
    };
}